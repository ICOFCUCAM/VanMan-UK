export async function createCheckoutSession(
  amountGBP: number,
  description: string,
  successUrl: string,
  cancelUrl: string,
  customerEmail?: string,
  bookingId?: string,
): Promise<{ url: string | null; error: Error | null }> {
  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

    const response = await fetch(
      `${supabaseUrl}/functions/v1/create-payment`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseKey}`,
          'apikey': supabaseKey,
        },
        body: JSON.stringify({ amount: amountGBP, description, successUrl, cancelUrl, customerEmail, bookingId }),
      },
    );

    const data = await response.json();
    if (data.error) throw new Error(data.error);
    if (!data.url) throw new Error('Payment session could not be created. Please try again.');
    return { url: data.url as string, error: null };
  } catch (err) {
    return { url: null, error: err as Error };
  }
}
