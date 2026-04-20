const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
};

async function verifyStripeSignature(body: string, sigHeader: string, secret: string): Promise<void> {
  const parts     = Object.fromEntries(sigHeader.split(',').map(p => p.split('=')));
  const timestamp = parts['t'];
  const received  = parts['v1'];

  if (!timestamp || !received) throw new Error('Missing stripe-signature fields');
  if (Math.abs(Date.now() / 1000 - parseInt(timestamp, 10)) > 300) throw new Error('Webhook timestamp too old');

  const key = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'],
  );
  const mac      = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(`${timestamp}.${body}`));
  const expected = Array.from(new Uint8Array(mac)).map(b => b.toString(16).padStart(2, '0')).join('');
  if (expected !== received) throw new Error('Stripe signature verification failed');
}

// Commission rates by driver tier (must match constants.ts)
const TIER_COMMISSION: Record<string, number> = {
  elite:       0.10,
  gold_pro:    0.15,
  gold:        0.20,
  silver_plus: 0.25,
  silver:      0.30,
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const supabaseUrl   = Deno.env.get('SUPABASE_URL')              ?? '';
  const supabaseKey   = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
  const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')     ?? '';

  const jsonHeaders = (extra: Record<string, string> = {}) => ({
    ...corsHeaders, 'Content-Type': 'application/json', ...extra,
  });
  const sbHeaders = { 'Authorization': `Bearer ${supabaseKey}`, 'apikey': supabaseKey };

  try {
    const body      = await req.text();
    const sigHeader = req.headers.get('stripe-signature') ?? '';
    if (webhookSecret) await verifyStripeSignature(body, sigHeader, webhookSecret);

    const event   = JSON.parse(body);
    const session = event.data.object;

    // ── SUBSCRIPTION CHECKOUT COMPLETED ─────────────────────────────────
    if (event.type === 'checkout.session.completed' && session.mode === 'subscription') {
      const { planId, driverId } = session.metadata ?? {};
      if (!driverId || !planId) {
        return new Response(
          JSON.stringify({ skipped: 'missing subscription metadata' }),
          { status: 200, headers: jsonHeaders() },
        );
      }

      await fetch(`${supabaseUrl}/rest/v1/drivers?id=eq.${driverId}`, {
        method: 'PATCH',
        headers: { ...sbHeaders, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
        body: JSON.stringify({
          tier:                   planId,
          subscription_plan:      planId,
          subscription_active:    true,
          subscription_expires_at: null,
        }),
      });

      return new Response(
        JSON.stringify({ received: true, action: 'tier_updated', planId }),
        { headers: jsonHeaders() },
      );
    }

    // ── SUBSCRIPTION CANCELLED / EXPIRED ────────────────────────────────
    if (event.type === 'customer.subscription.deleted') {
      const customerId = session.customer;
      if (!customerId) {
        return new Response(JSON.stringify({ skipped: 'no customer' }), { status: 200, headers: jsonHeaders() });
      }

      const res = await fetch(
        `${supabaseUrl}/rest/v1/drivers?stripe_customer_id=eq.${customerId}&select=id`,
        { headers: sbHeaders },
      );
      const drivers = await res.json();
      if (drivers?.[0]?.id) {
        await fetch(`${supabaseUrl}/rest/v1/drivers?id=eq.${drivers[0].id}`, {
          method: 'PATCH',
          headers: { ...sbHeaders, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
          body: JSON.stringify({ tier: 'silver', subscription_plan: 'silver', subscription_active: false }),
        });
      }
      return new Response(JSON.stringify({ received: true, action: 'tier_reset' }), { headers: jsonHeaders() });
    }

    // ── SUBSCRIPTION PAYMENT FAILED ──────────────────────────────────────
    if (event.type === 'invoice.payment_failed') {
      return new Response(
        JSON.stringify({ received: true, action: 'payment_failed_logged' }),
        { headers: jsonHeaders() },
      );
    }

    // ── ONE-TIME BOOKING PAYMENT ─────────────────────────────────────────
    if (event.type === 'checkout.session.completed' && session.mode === 'payment') {
      const bookingId = session.metadata?.bookingId;
      if (!bookingId) {
        return new Response(
          JSON.stringify({ skipped: 'no bookingId in metadata' }),
          { status: 200, headers: jsonHeaders() },
        );
      }

      const bookingRes = await fetch(
        `${supabaseUrl}/rest/v1/bookings?id=eq.${bookingId}&select=estimated_price,driver_id,drivers(tier)`,
        { headers: sbHeaders },
      );
      const bookings = await bookingRes.json();
      const booking  = bookings[0];
      const price    = booking?.estimated_price ?? 0;

      const driverTier       = booking?.drivers?.tier ?? 'silver';
      const commissionRate   = TIER_COMMISSION[driverTier] ?? 0.30;
      const commissionAmount = price * commissionRate;
      const driverEarning    = price - commissionAmount;

      await fetch(`${supabaseUrl}/rest/v1/bookings?id=eq.${bookingId}`, {
        method: 'PATCH',
        headers: { ...sbHeaders, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
        body: JSON.stringify({
          payment_status:    'escrow',
          payment_provider:  'stripe',
          stripe_session_id: session.id,
          payment_intent_id: session.payment_intent,
          escrow_activated:  true,
          commission_rate:   commissionRate,
          commission_amount: commissionAmount,
          driver_earning:    driverEarning,
        }),
      });

      await fetch(`${supabaseUrl}/rest/v1/escrow_payments`, {
        method: 'POST',
        headers: { ...sbHeaders, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
        body: JSON.stringify({
          booking_id:        bookingId,
          status:            'escrow',
          driver_earning:    driverEarning,
          commission_amount: commissionAmount,
        }),
      });

      if (booking?.driver_id) {
        await fetch(`${supabaseUrl}/rest/v1/rpc/add_driver_pending`, {
          method: 'POST',
          headers: { ...sbHeaders, 'Content-Type': 'application/json' },
          body: JSON.stringify({ p_driver_id: booking.driver_id, p_amount: driverEarning }),
        });
      }

      return new Response(
        JSON.stringify({ received: true, action: 'booking_escrowed' }),
        { headers: jsonHeaders() },
      );
    }

    return new Response(JSON.stringify({ received: true, action: 'ignored' }), { headers: jsonHeaders() });

  } catch (err) {
    return new Response(
      JSON.stringify({ error: (err as Error).message }),
      { status: 400, headers: jsonHeaders() },
    );
  }
});
