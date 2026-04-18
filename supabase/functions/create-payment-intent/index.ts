const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { amount } = await req.json();
    if (!amount || amount <= 0) throw new Error('Invalid amount');

    const secretKey = Deno.env.get('STRIPE_SECRET_KEY') ?? '';
    console.log('Secret key present:', secretKey.length > 0, 'starts with:', secretKey.slice(0, 7));

    const response = await fetch('https://api.stripe.com/v1/payment_intents', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        amount: Math.round(amount * 100).toString(),
        currency: 'gbp',
        'automatic_payment_methods[enabled]': 'true',
      }),
    });

    const paymentIntent = await response.json();
    console.log('Stripe response status:', response.status, 'ok:', response.ok);

    if (!response.ok) throw new Error(paymentIntent.error?.message ?? 'Stripe error');

    return new Response(
      JSON.stringify({ clientSecret: paymentIntent.client_secret }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (err) {
    console.error('Error:', (err as Error).message);
    // Always return 200 so client can read the actual error message
    return new Response(
      JSON.stringify({ error: (err as Error).message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
