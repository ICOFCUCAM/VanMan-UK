import { supabase } from '@/lib/supabase';

export async function createPaymentIntent(
  amountGBP: number,
): Promise<{ clientSecret: string | null; error: Error | null }> {
  try {
    const { data, error } = await supabase.functions.invoke('create-payment-intent', {
      body: { amount: amountGBP },
    });
    if (error) throw error;
    if (data?.error) throw new Error(data.error);
    return { clientSecret: data.clientSecret as string, error: null };
  } catch (err) {
    return { clientSecret: null, error: err as Error };
  }
}
