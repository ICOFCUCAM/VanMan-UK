import { supabase } from '@/lib/supabase';
import { TIER_COMMISSION } from '@/lib/constants';
import type { ServiceResult } from '@/types';

export async function confirmDeliveryAsCustomer(bookingId: string): Promise<ServiceResult<null>> {
  try {
    const { error } = await supabase
      .from('bookings')
      .update({ customer_confirmation: true })
      .eq('id', bookingId);
    if (error) throw error;
    return { data: null, error: null };
  } catch (err) {
    return { data: null, error: err as Error };
  }
}

export async function confirmCompletionAsDriver(bookingId: string): Promise<ServiceResult<null>> {
  try {
    const { error } = await supabase
      .from('bookings')
      .update({ driver_confirmation: true })
      .eq('id', bookingId);
    if (error) throw error;
    return { data: null, error: null };
  } catch (err) {
    return { data: null, error: err as Error };
  }
}

export interface DriverWallet {
  id: string;
  driver_id: string;
  balance: number;
  pending: number;
  total_earned: number;
  total_withdrawn: number;
  pending_payout: number;
}

export async function getDriverWallet(driverId: string): Promise<ServiceResult<DriverWallet>> {
  try {
    const { data, error } = await supabase
      .from('driver_wallets')
      .select('*')
      .eq('driver_id', driverId)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return { data: (data ?? null) as DriverWallet | null, error: null };
  } catch (err) {
    return { data: null, error: err as Error };
  }
}

export interface WalletTransaction {
  id: string;
  driver_id: string;
  booking_id: string | null;
  type: string;
  amount: number;
  description: string | null;
  created_at: string;
}

export async function getWalletTransactions(driverId: string): Promise<{ data: WalletTransaction[]; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('driver_wallet_transactions')
      .select('*')
      .eq('driver_id', driverId)
      .order('created_at', { ascending: false })
      .limit(20);
    if (error) throw error;
    return { data: (data ?? []) as WalletTransaction[], error: null };
  } catch (err) {
    return { data: [], error: err as Error };
  }
}

export interface EscrowPayment {
  id: string;
  booking_id: string;
  status: 'held' | 'escrow' | 'released' | 'refunded';
  driver_earning: number | null;
  commission_amount: number | null;
  refund_amount: number | null;
  created_at: string;
  released_at: string | null;
  booking?: {
    booking_ref: string | null;
    collection_address: string;
    delivery_address: string;
    estimated_price: number;
    payment_method: string;
    driver_id: string | null;
  };
}

export async function getEscrowPayments(): Promise<{ data: EscrowPayment[]; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('escrow_payments')
      .select('*, booking:bookings(booking_ref, collection_address, delivery_address, estimated_price, payment_method, driver_id)')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return { data: (data ?? []) as EscrowPayment[], error: null };
  } catch (err) {
    return { data: [], error: err as Error };
  }
}

export async function releaseEscrowManually(bookingId: string): Promise<ServiceResult<null>> {
  try {
    const { error } = await supabase.rpc('release_escrow_manually', { p_booking_id: bookingId });
    if (error) throw error;
    return { data: null, error: null };
  } catch (err) {
    return { data: null, error: err as Error };
  }
}

export async function refundEscrowManually(bookingId: string): Promise<ServiceResult<null>> {
  try {
    const { error } = await supabase.rpc('refund_escrow_manually', { p_booking_id: bookingId });
    if (error) throw error;
    return { data: null, error: null };
  } catch (err) {
    return { data: null, error: err as Error };
  }
}

// Fallback: update payment_status directly (dev/testing — no real money moves)
export async function activateEscrowFallback(bookingId: string, price: number, driverTier?: string): Promise<ServiceResult<null>> {
  try {
    const ratePercent  = TIER_COMMISSION[driverTier ?? 'silver'] ?? 30;
    const rate         = ratePercent / 100;
    const commissionAmount = price * rate;
    const driverEarning    = price - commissionAmount;

    const { error: bookingErr } = await supabase
      .from('bookings')
      .update({
        payment_status:    'escrow',
        escrow_activated:  true,
        commission_rate:   rate,
        commission_amount: commissionAmount,
        driver_earning:    driverEarning,
      })
      .eq('id', bookingId);
    if (bookingErr) throw bookingErr;

    await supabase.from('escrow_payments').insert({
      booking_id:        bookingId,
      status:            'escrow',
      driver_earning:    driverEarning,
      commission_amount: commissionAmount,
    });

    return { data: null, error: null };
  } catch (err) {
    return { data: null, error: err as Error };
  }
}
