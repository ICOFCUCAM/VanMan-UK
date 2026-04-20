import { supabase } from '@/lib/supabase';
import type { Job, ServiceResult, ServiceListResult } from '@/types';

const VEHICLE_LABELS: Record<string, string> = {
  small:  'Small van — boxes & single items',
  medium: 'Medium van — studio / 1-bed move',
  large:  'Large van — 1–2 bed flat move',
  luton:  'Luton van — full house move',
};

function itemLabel(vehicleType: string, notes?: string | null): string {
  if (notes?.trim()) return notes.trim();
  return VEHICLE_LABELS[vehicleType] ?? vehicleType;
}

export async function getAvailableJobs(): Promise<ServiceListResult<Job>> {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('id, collection_address, delivery_address, distance_miles, duration, estimated_price, helpers, vehicle_type, payment_method')
      .eq('status', 'pending')
      .is('driver_id', null)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const jobs: Job[] = (data ?? []).map((row) => ({
      id: row.id,
      pickup: row.collection_address,
      dropoff: row.delivery_address,
      distance: `${row.distance_miles ?? 0} miles`,
      duration: row.duration ?? '—',
      price: row.estimated_price ?? 0,
      customerRating: null,
      tier: null,
      status: 'available',
      items: itemLabel(row.vehicle_type ?? ''),
      helpers: row.helpers ?? 0,
      booking_id: row.id,
      paymentMethod: row.payment_method === 'cash' ? 'cash' : 'card',
    }));

    return { data: jobs, error: null };
  } catch (err) {
    return { data: [], error: err as Error };
  }
}

export async function getJobById(id: string): Promise<ServiceResult<Job>> {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('id, collection_address, delivery_address, distance_miles, duration, estimated_price, helpers, vehicle_type')
      .eq('id', id)
      .single();

    if (error) throw error;

    const job: Job = {
      id: data.id,
      pickup: data.collection_address,
      dropoff: data.delivery_address,
      distance: `${data.distance_miles ?? 0} miles`,
      duration: data.duration ?? '—',
      price: data.estimated_price ?? 0,
      customerRating: null,
      tier: null,
      status: 'available',
      items: itemLabel(data.vehicle_type ?? ''),
      helpers: data.helpers ?? 0,
      booking_id: data.id,
    };

    return { data: job, error: null };
  } catch (err) {
    return { data: null, error: err as Error };
  }
}
