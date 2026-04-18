const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { amount, description, successUrl, cancelUrl } = await req.json();
    if (!amount || amount <= 0) throw new Error('Invalid amount');

    const secretKey = Deno.env.get('STRIPE_SECRET_KEY') ?? '';

    const body = new URLSearchParams({
      'payment_method_types[]': 'card',
      'line_items[0][price_data][currency]': 'gbp',
      'line_items[0][price_data][product_data][name]': description ?? 'Man & Van Service',
      'line_items[0][price_data][unit_amount]': Math.round(amount * 100).toString(),
      'line_items[0][quantity]': '1',
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
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
      JSON.stringify({ url: session.url }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: (err as Error).message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
