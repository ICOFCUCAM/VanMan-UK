import { supabase } from '@/lib/supabase';
import type {
  CorporateAccount,
  CorporateTeamMember,
  RecurringSchedule,
  CorporateRole,
  Booking,
  ServiceResult,
  ServiceListResult,
} from '@/types';

// ─── Account ──────────────────────────────────────────────────────────────────

export async function registerCorporateAccount(
  companyName: string,
  email: string,
  phone: string,
  userId?: string,
): Promise<ServiceResult<CorporateAccount>> {
  try {
    const { data, error } = await supabase
      .from('corporate_accounts')
      .insert({ company_name: companyName, email, phone: phone || null, user_id: userId ?? null })
      .select('*')
      .single();
    if (error) throw error;
    return { data: data as CorporateAccount, error: null };
  } catch (err) {
    return { data: null, error: err as Error };
  }
}

export async function getCorporateAccountByUserId(userId: string): Promise<ServiceResult<CorporateAccount>> {
  try {
    const { data, error } = await supabase
      .from('corporate_accounts')
      .select('*')
      .eq('user_id', userId)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return { data: (data ?? null) as CorporateAccount | null, error: null };
  } catch (err) {
    return { data: null, error: err as Error };
  }
}

// ─── Stats ────────────────────────────────────────────────────────────────────

export interface CorporateStats {
  totalDeliveries: number;
  monthCost: number;
  activeSchedules: number;
  teamMembers: number;
  weeklyData: { week: string; deliveries: number; cost: number }[];
}

export async function getCorporateStats(accountId: string): Promise<ServiceResult<CorporateStats>> {
  try {
    const [bookingsRes, schedulesRes, teamRes] = await Promise.all([
      supabase
        .from('bookings')
        .select('estimated_price, created_at')
        .eq('corporate_account_id', accountId),
      supabase
        .from('recurring_schedules')
        .select('id', { count: 'exact', head: true })
        .eq('account_id', accountId)
        .eq('is_active', true),
      supabase
        .from('corporate_team_members')
        .select('id', { count: 'exact', head: true })
        .eq('account_id', accountId),
    ]);

    if (bookingsRes.error) throw bookingsRes.error;

    const bookings = bookingsRes.data ?? [];
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthCost = bookings
      .filter(b => new Date(b.created_at) >= monthStart)
      .reduce((s, b) => s + (b.estimated_price ?? 0), 0);

    const weeklyData = Array.from({ length: 4 }, (_, i) => {
      const weekEnd = new Date(now);
      weekEnd.setDate(now.getDate() - i * 7);
      const weekStart = new Date(weekEnd);
      weekStart.setDate(weekEnd.getDate() - 7);
      const wb = bookings.filter(b => {
        const d = new Date(b.created_at);
        return d >= weekStart && d < weekEnd;
      });
      return {
        week: `W${4 - i}`,
        deliveries: wb.length,
        cost: wb.reduce((s, b) => s + (b.estimated_price ?? 0), 0),
      };
    }).reverse();

    return {
      data: {
        totalDeliveries: bookings.length,
        monthCost,
        activeSchedules: schedulesRes.count ?? 0,
        teamMembers: teamRes.count ?? 0,
        weeklyData,
      },
      error: null,
    };
  } catch (err) {
    return { data: null, error: err as Error };
  }
}

// ─── Bookings ─────────────────────────────────────────────────────────────────

export async function getCorporateBookings(accountId: string): Promise<ServiceListResult<Booking>> {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('corporate_account_id', accountId)
      .order('created_at', { ascending: false })
      .limit(50);
    if (error) throw error;
    return { data: (data ?? []) as Booking[], error: null };
  } catch (err) {
    return { data: [], error: err as Error };
  }
}

export interface BulkBookingRow {
  pickup: string;
  delivery: string;
  date: string;
  vehicle: string;
}

export async function createBulkBookings(
  accountId: string,
  rows: BulkBookingRow[],
  customerId?: string,
): Promise<ServiceListResult<Booking>> {
  try {
    const inserts = rows
      .filter(r => r.pickup.trim() && r.delivery.trim())
      .map(r => ({
        corporate_account_id: accountId,
        customer_id: customerId ?? null,
        collection_address: r.pickup,
        delivery_address: r.delivery,
        stop_addresses: [],
        has_stairs: false,
        vehicle_type: r.vehicle,
        delivery_type: 'dedicated',
        helpers: 0,
        distance_miles: 0,
        duration: 'TBC',
        estimated_price: 0,
        surge_multiplier: 1,
        status: 'pending',
        payment_method: 'card',
        payment_status: 'pending',
        scheduled_at: r.date ? new Date(r.date).toISOString() : null,
      }));

    if (inserts.length === 0) throw new Error('Please fill in at least one pickup and delivery address.');

    const { data, error } = await supabase.from('bookings').insert(inserts).select('*');
    if (error) throw error;
    return { data: (data ?? []) as Booking[], error: null };
  } catch (err) {
    return { data: [], error: err as Error };
  }
}

// ─── Team ─────────────────────────────────────────────────────────────────────

export async function getTeamMembers(accountId: string): Promise<ServiceListResult<CorporateTeamMember>> {
  try {
    const { data, error } = await supabase
      .from('corporate_team_members')
      .select('*')
      .eq('account_id', accountId)
      .order('created_at');
    if (error) throw error;
    return { data: (data ?? []) as CorporateTeamMember[], error: null };
  } catch (err) {
    return { data: [], error: err as Error };
  }
}

export async function addTeamMember(
  accountId: string,
  email: string,
  name: string,
  role: CorporateRole,
): Promise<ServiceResult<CorporateTeamMember>> {
  try {
    const { data, error } = await supabase
      .from('corporate_team_members')
      .insert({ account_id: accountId, email, name: name || null, role })
      .select('*')
      .single();
    if (error) throw error;
    return { data: data as CorporateTeamMember, error: null };
  } catch (err) {
    return { data: null, error: err as Error };
  }
}

export async function removeTeamMember(id: string): Promise<ServiceResult<null>> {
  try {
    const { error } = await supabase.from('corporate_team_members').delete().eq('id', id);
    if (error) throw error;
    return { data: null, error: null };
  } catch (err) {
    return { data: null, error: err as Error };
  }
}

// ─── Recurring Schedules ──────────────────────────────────────────────────────

export async function getRecurringSchedules(accountId: string): Promise<ServiceListResult<RecurringSchedule>> {
  try {
    const { data, error } = await supabase
      .from('recurring_schedules')
      .select('*')
      .eq('account_id', accountId)
      .order('created_at');
    if (error) throw error;
    return { data: (data ?? []) as RecurringSchedule[], error: null };
  } catch (err) {
    return { data: [], error: err as Error };
  }
}

export async function createRecurringSchedule(
  schedule: Omit<RecurringSchedule, 'id' | 'created_at'>,
): Promise<ServiceResult<RecurringSchedule>> {
  try {
    const { data, error } = await supabase
      .from('recurring_schedules')
      .insert(schedule)
      .select('*')
      .single();
    if (error) throw error;
    return { data: data as RecurringSchedule, error: null };
  } catch (err) {
    return { data: null, error: err as Error };
  }
}

export async function toggleRecurringSchedule(id: string, isActive: boolean): Promise<ServiceResult<RecurringSchedule>> {
  try {
    const { data, error } = await supabase
      .from('recurring_schedules')
      .update({ is_active: isActive })
      .eq('id', id)
      .select('*')
      .single();
    if (error) throw error;
    return { data: data as RecurringSchedule, error: null };
  } catch (err) {
    return { data: null, error: err as Error };
  }
}

export async function deleteRecurringSchedule(id: string): Promise<ServiceResult<null>> {
  try {
    const { error } = await supabase.from('recurring_schedules').delete().eq('id', id);
    if (error) throw error;
    return { data: null, error: null };
  } catch (err) {
    return { data: null, error: err as Error };
  }
}

// ─── Invoices (computed from bookings) ───────────────────────────────────────

export interface CorporateInvoice {
  month: string;
  label: string;
  amount: number;
  deliveries: number;
  status: 'current' | 'paid';
}

export async function getCorporateInvoices(accountId: string): Promise<ServiceListResult<CorporateInvoice>> {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('estimated_price, created_at')
      .eq('corporate_account_id', accountId)
      .order('created_at', { ascending: false });
    if (error) throw error;

    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const byMonth = new Map<string, { amount: number; deliveries: number }>();

    for (const b of data ?? []) {
      const d = new Date(b.created_at);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const prev = byMonth.get(key) ?? { amount: 0, deliveries: 0 };
      byMonth.set(key, { amount: prev.amount + (b.estimated_price ?? 0), deliveries: prev.deliveries + 1 });
    }

    const invoices: CorporateInvoice[] = [...byMonth.keys()]
      .sort((a, b) => b.localeCompare(a))
      .map(month => {
        const { amount, deliveries } = byMonth.get(month)!;
        const [y, m] = month.split('-');
        const label = new Date(Number(y), Number(m) - 1, 1).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
        return { month, label, amount, deliveries, status: month === currentMonth ? 'current' : 'paid' };
      });

    return { data: invoices, error: null };
  } catch (err) {
    return { data: [], error: err as Error };
  }
}
