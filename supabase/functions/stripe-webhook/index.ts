const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const supabaseUrl   = Deno.env.get('SUPABASE_URL') ?? '';
  const supabaseKey   = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

  try {
    const body  = await req.text();
    const event = JSON.parse(body);

    if (event.type === 'checkout.session.completed') {
      const session   = event.data.object;
      const bookingId = session.metadata?.bookingId;

      if (!bookingId) {
        return new Response(JSON.stringify({ skipped: 'no bookingId in metadata' }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // 1. Fetch booking to calculate commission
      const bookingRes = await fetch(
        `${supabaseUrl}/rest/v1/bookings?id=eq.${bookingId}&select=estimated_price,driver_id,drivers(tier)`,
        { headers: { 'Authorization': `Bearer ${supabaseKey}`, 'apikey': supabaseKey } },
      );
      const bookings = await bookingRes.json();
      const booking  = bookings[0];
      const price    = booking?.estimated_price ?? 0;

      // Gold tier = 15%, Silver = 20%
      const driverTier       = booking?.drivers?.tier ?? 'silver';
      const commissionRate   = driverTier === 'gold' ? 0.15 : 0.20;
      const commissionAmount = price * commissionRate;
      const driverEarning    = price - commissionAmount;

      // 2. Update booking → escrow
      await fetch(`${supabaseUrl}/rest/v1/bookings?id=eq.${bookingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseKey}`,
          'apikey': supabaseKey,
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify({
          payment_status:     'escrow',
          payment_provider:   'stripe',
          stripe_session_id:  session.id,
          payment_intent_id:  session.payment_intent,
          escrow_activated:   true,
          commission_rate:    commissionRate,
          commission_amount:  commissionAmount,
          driver_earning:     driverEarning,
        }),
      });

      // 3. Create escrow_payments record
      await fetch(`${supabaseUrl}/rest/v1/escrow_payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseKey}`,
          'apikey': supabaseKey,
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify({
          booking_id:        bookingId,
          status:            'escrow',
          driver_earning:    driverEarning,
          commission_amount: commissionAmount,
        }),
      });

      // 4. Add pending to driver wallet (if already assigned)
      if (booking?.driver_id) {
        await fetch(
          `${supabaseUrl}/rest/v1/rpc/add_driver_pending`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${supabaseKey}`,
              'apikey': supabaseKey,
            },
            body: JSON.stringify({ p_driver_id: booking.driver_id, p_amount: driverEarning }),
          },
        );
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: (err as Error).message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
