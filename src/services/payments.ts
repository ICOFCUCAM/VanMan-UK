export async function createPaymentIntent(
  amountGBP: number,
): Promise<{ clientSecret: string | null; error: Error | null }> {
  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

    const response = await fetch(
      `${supabaseUrl}/functions/v1/create-payment-intent`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseKey}`,
          'apikey': supabaseKey,
        },
        body: JSON.stringify({ amount: amountGBP }),
      },
    );

    const data = await response.json();
    if (data.error) throw new Error(data.error);
    return { clientSecret: data.clientSecret as string, error: null };
  } catch (err) {
    return { clientSecret: null, error: err as Error };
  }
}
