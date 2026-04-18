import { supabase } from '@/lib/supabase';
import type { Booking, CreateBookingInput, BookingStatus, ServiceResult, ServiceListResult } from '@/types';

export async function createBooking(input: CreateBookingInput): Promise<ServiceResult<Booking>> {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .insert({
        collection_address: input.collection_address,
        delivery_address: input.delivery_address,
        stop_addresses: input.stop_addresses,
        has_stairs: input.has_stairs,
        vehicle_type: input.vehicle_type,
        delivery_type: input.delivery_type,
        helpers: input.helpers,
        distance_miles: input.distance_miles,
        duration: input.duration,
        estimated_price: input.estimated_price,
        surge_multiplier: input.surge_multiplier,
        payment_method: input.payment_method,
        status: 'pending',
        payment_status: 'pending',
        customer_id: input.customer_id ?? null,
        scheduled_at: input.scheduled_at ?? null,
      })
      .select('*')
      .single();

    if (error) throw error;
    return { data: data as Booking, error: null };
  } catch (err) {
    return { data: null, error: err as Error };
  }
}

export async function getBookingById(id: string): Promise<ServiceResult<Booking>> {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*, driver:drivers(*), customer:profiles(*)')
      .eq('id', id)
      .single();

    if (error) throw error;
    return { data: data as Booking, error: null };
  } catch (err) {
    return { data: null, error: err as Error };
  }
}

export async function getBookingsByCustomer(customerId: string): Promise<ServiceListResult<Booking>> {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*, driver:drivers(*)')
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data: (data ?? []) as Booking[], error: null };
  } catch (err) {
    return { data: [], error: err as Error };
  }
}

export async function getBookingsByDriver(driverId: string): Promise<ServiceListResult<Booking>> {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*, customer:profiles(*)')
      .eq('driver_id', driverId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data: (data ?? []) as Booking[], error: null };
  } catch (err) {
    return { data: [], error: err as Error };
  }
}

export async function getAllBookings(): Promise<ServiceListResult<Booking>> {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*, driver:drivers(*), customer:profiles(*)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data: (data ?? []) as Booking[], error: null };
  } catch (err) {
    return { data: [], error: err as Error };
  }
}

export async function updateBookingStatus(id: string, status: BookingStatus): Promise<ServiceResult<Booking>> {
  try {
    const updates: Record<string, unknown> = { status, updated_at: new Date().toISOString() };
    if (status === 'in_progress') updates.picked_up_at = new Date().toISOString();
    if (status === 'completed') updates.delivered_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('bookings')
      .update(updates)
      .eq('id', id)
      .select('*')
      .single();

    if (error) throw error;
    return { data: data as Booking, error: null };
  } catch (err) {
    return { data: null, error: err as Error };
  }
}

export async function assignDriverToBooking(bookingId: string, driverId: string): Promise<ServiceResult<Booking>> {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .update({ driver_id: driverId, status: 'assigned', updated_at: new Date().toISOString() })
      .eq('id', bookingId)
      .select('*')
      .single();

    if (error) throw error;
    return { data: data as Booking, error: null };
  } catch (err) {
    return { data: null, error: err as Error };
  }
}
