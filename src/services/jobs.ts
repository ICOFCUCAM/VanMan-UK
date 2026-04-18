import { supabase } from '@/lib/supabase';
import type { Job, DriverTier, ServiceResult, ServiceListResult } from '@/types';

export async function getAvailableJobs(tier: DriverTier): Promise<ServiceListResult<Job>> {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('id, collection_address, delivery_address, distance_miles, duration, estimated_price, helpers, vehicle_type')
      .eq('status', 'pending')
      .eq('tier', tier)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const jobs: Job[] = (data ?? []).map((row) => ({
      id: row.id,
      pickup: row.collection_address,
      dropoff: row.delivery_address,
      distance: `${row.distance_miles} miles`,
      duration: row.duration,
      price: row.estimated_price,
      customerRating: 4.8,
      tier,
      status: 'available',
      items: row.vehicle_type,
      helpers: row.helpers,
      booking_id: row.id,
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
      distance: `${data.distance_miles} miles`,
      duration: data.duration,
      price: data.estimated_price,
      customerRating: 4.8,
      tier: 'silver',
      status: 'available',
      items: data.vehicle_type,
      helpers: data.helpers,
      booking_id: data.id,
    };

    return { data: job, error: null };
  } catch (err) {
    return { data: null, error: err as Error };
  }
}
