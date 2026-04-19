import { supabase } from '@/lib/supabase';

export interface PlatformStats {
  completedJobs: number;
  activeDrivers: number;
  avgRating: number | null;
  cityStats: Record<string, { drivers: number; bookings: number }>;
}

export async function getPlatformStats(): Promise<PlatformStats> {
  const [jobsRes, driversRes, ratingRes] = await Promise.all([
    supabase
      .from('bookings')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'completed'),
    supabase
      .from('drivers')
      .select('id', { count: 'exact', head: true })
      .in('status', ['approved', 'active']),
    supabase
      .from('drivers')
      .select('rating')
      .in('status', ['approved', 'active'])
      .not('rating', 'is', null),
  ]);

  const completedJobs = jobsRes.count ?? 0;
  const activeDrivers = driversRes.count ?? 0;

  let avgRating: number | null = null;
  if (ratingRes.data && ratingRes.data.length > 0) {
    const sum = ratingRes.data.reduce((acc, d) => acc + (d.rating ?? 0), 0);
    avgRating = Math.round((sum / ratingRes.data.length) * 10) / 10;
  }

  return { completedJobs, activeDrivers, avgRating, cityStats: {} };
}
