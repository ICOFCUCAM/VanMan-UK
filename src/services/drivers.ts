import { supabase } from '@/lib/supabase';
import type { Driver, CreateDriverInput, DriverStatus, ServiceResult, ServiceListResult } from '@/types';

export async function registerDriver(input: CreateDriverInput): Promise<ServiceResult<Driver>> {
  try {
    const { data, error } = await supabase
      .from('drivers')
      .insert({
        first_name: input.first_name,
        last_name: input.last_name,
        email: input.email,
        phone: input.phone,
        vehicle_type: input.vehicle_type,
        vehicle_make: input.vehicle_make,
        vehicle_model: input.vehicle_model,
        vehicle_year: input.vehicle_year,
        vehicle_reg: input.vehicle_reg,
        insurance_type: input.insurance_type,
        user_id: input.user_id ?? null,
        tier: input.insurance_type === 'comprehensive' ? 'gold' : 'silver',
        status: 'pending',
        is_online: false,
        rating: 5.0,
        total_jobs: 0,
        total_earnings: 0,
        license_document_url: input.license_document_url ?? null,
        insurance_document_url: input.insurance_document_url ?? null,
        vehicle_registration_url: input.vehicle_registration_url ?? null,
        vehicle_photo_url: input.vehicle_photo_url ?? null,
      })
      .select('*')
      .single();

    if (error) throw error;
    return { data: data as Driver, error: null };
  } catch (err) {
    return { data: null, error: err as Error };
  }
}

export async function getDriverById(id: string): Promise<ServiceResult<Driver>> {
  try {
    const { data, error } = await supabase
      .from('drivers')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return { data: data as Driver, error: null };
  } catch (err) {
    return { data: null, error: err as Error };
  }
}

export async function getDriverByUserId(userId: string): Promise<ServiceResult<Driver>> {
  try {
    const { data, error } = await supabase
      .from('drivers')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return { data: (data ?? null) as Driver | null, error: null };
  } catch (err) {
    return { data: null, error: err as Error };
  }
}

export async function getAllDrivers(): Promise<ServiceListResult<Driver>> {
  try {
    const { data, error } = await supabase
      .from('drivers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data: (data ?? []) as Driver[], error: null };
  } catch (err) {
    return { data: [], error: err as Error };
  }
}

export async function updateDriverStatus(id: string, status: DriverStatus): Promise<ServiceResult<Driver>> {
  try {
    const { data, error } = await supabase
      .from('drivers')
      .update({ status })
      .eq('id', id)
      .select('*')
      .single();

    if (error) throw error;
    return { data: data as Driver, error: null };
  } catch (err) {
    return { data: null, error: err as Error };
  }
}

export async function setDriverOnline(id: string, isOnline: boolean): Promise<ServiceResult<Driver>> {
  try {
    const { data, error } = await supabase
      .from('drivers')
      .update({ is_online: isOnline })
      .eq('id', id)
      .select('*')
      .single();

    if (error) throw error;
    return { data: data as Driver, error: null };
  } catch (err) {
    return { data: null, error: err as Error };
  }
}

export async function updateDriverTier(driverId: string, tier: string): Promise<ServiceResult<Driver>> {
  try {
    const { data, error } = await supabase
      .from('drivers')
      .update({ tier })
      .eq('id', driverId)
      .select('*')
      .single();

    if (error) throw error;
    return { data: data as Driver, error: null };
  } catch (err) {
    return { data: null, error: err as Error };
  }
}
