const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Map plan IDs to Stripe Price IDs (set these in Supabase edge function secrets)
const PRICE_IDS: Record<string, string> = {
  silver_plus: Deno.env.get('STRIPE_PRICE_SILVER_PLUS') ?? '',
  gold:        Deno.env.get('STRIPE_PRICE_GOLD')        ?? '',
  gold_pro:    Deno.env.get('STRIPE_PRICE_GOLD_PRO')    ?? '',
  elite:       Deno.env.get('STRIPE_PRICE_ELITE')       ?? '',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { planId, driverId, driverEmail, successUrl, cancelUrl } = await req.json();

    if (!planId || !driverId) throw new Error('planId and driverId are required');

    const priceId = PRICE_IDS[planId];
    if (!priceId) throw new Error(`No Stripe price configured for plan: ${planId}`);

    const secretKey = Deno.env.get('STRIPE_SECRET_KEY') ?? '';
    if (!secretKey) throw new Error('Stripe secret key not configured');

    const body = new URLSearchParams({
      mode:                           'subscription',
      'line_items[0][price]':         priceId,
      'line_items[0][quantity]':      '1',
      success_url:                    successUrl,
      cancel_url:                     cancelUrl,
      'metadata[type]':               'subscription',
      'metadata[planId]':             planId,
      'metadata[driverId]':           driverId,
      // Pre-fill customer email if available
      ...(driverEmail ? { customer_email: driverEmail } : {}),
      // Allow promotion codes
      allow_promotion_codes:          'true',
    });

    const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    });

    const session = await response.json();
    if (!response.ok) throw new Error(session.error?.message ?? 'Stripe error');

    return new Response(
      JSON.stringify({ url: session.url, sessionId: session.id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: (err as Error).message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
