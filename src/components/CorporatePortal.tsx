import React, { useState, useEffect } from 'react';
import {
  Building2, Users, FileText, BarChart3, Repeat, Plus, CheckCircle,
  ArrowRight, MapPin, TrendingUp, Loader2, X, Trash2, AlertCircle,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAppContext } from '@/contexts/AppContext';
import {
  registerCorporateAccount,
  getCorporateAccountByUserId,
  getCorporateStats,
  getCorporateBookings,
  createBulkBookings,
  getTeamMembers,
  addTeamMember,
  removeTeamMember,
  getRecurringSchedules,
  createRecurringSchedule,
  toggleRecurringSchedule,
  deleteRecurringSchedule,
  getCorporateInvoices,
} from '@/services/corporate';
import type {
  CorporateAccount,
  CorporateTeamMember,
  RecurringSchedule,
  CorporateRole,
  Booking,
} from '@/types';
import type { CorporateStats, CorporateInvoice, BulkBookingRow } from '@/services/corporate';

interface CorporatePortalProps {
  onNavigate: (page: string) => void;
}

const EMPTY_ROW: BulkBookingRow = { pickup: '', delivery: '', date: '', vehicle: 'Medium Van' };

const ROLE_COLOURS: Record<CorporateRole, string> = {
  admin: 'bg-purple-100 text-purple-700',
  manager: 'bg-blue-100 text-blue-700',
  booker: 'bg-green-100 text-green-700',
  viewer: 'bg-gray-100 text-gray-600',
};

const FEATURES = [
  { icon: Repeat, title: 'Recurring Deliveries', desc: 'Set up automated delivery schedules that run daily, weekly, or monthly.' },
  { icon: FileText, title: 'Monthly Invoicing', desc: 'Consolidated invoices with full breakdowns for easy accounting.' },
  { icon: Users, title: 'Multi-User Access', desc: 'Add team members with role-based permissions.' },
  { icon: BarChart3, title: 'Analytics Reports', desc: 'Real-time delivery analytics and cost reports.' },
  { icon: Building2, title: 'Priority Dispatch', desc: 'Corporate bookings receive priority driver assignment.' },
  { icon: TrendingUp, title: 'Volume Discounts', desc: 'Save up to 25% with corporate volume pricing.' },
];

const CorporatePortal: React.FC<CorporatePortalProps> = ({ onNavigate }) => {
  const { user } = useAppContext();

  const [isLoading, setIsLoading] = useState(true);
  const [account, setAccount] = useState<CorporateAccount | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Signup
  const [companyName, setCompanyName] = useState('');
  const [companyEmail, setCompanyEmail] = useState('');
  const [companyPhone, setCompanyPhone] = useState('');
  const [signupError, setSignupError] = useState<string | null>(null);
  const [signingUp, setSigningUp] = useState(false);

  // Dashboard
  const [stats, setStats] = useState<CorporateStats | null>(null);

  // Bookings
  const [bulkRows, setBulkRows] = useState<BulkBookingRow[]>([{ ...EMPTY_ROW }, { ...EMPTY_ROW }, { ...EMPTY_ROW }]);
  const [corpBookings, setCorpBookings] = useState<Booking[]>([]);
  const [submittingBulk, setSubmittingBulk] = useState(false);
  const [bulkError, setBulkError] = useState<string | null>(null);
  const [bulkSuccess, setBulkSuccess] = useState(false);

  // Team
  const [team, setTeam] = useState<CorporateTeamMember[]>([]);
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState<CorporateRole>('booker');
  const [addingMember, setAddingMember] = useState(false);

  // Recurring
  const [schedules, setSchedules] = useState<RecurringSchedule[]>([]);
  const [showAddSchedule, setShowAddSchedule] = useState(false);
  const [scheduleForm, setScheduleForm] = useState({
    pickup_address: '',
    delivery_address: '',
    vehicle_type: 'Medium Van',
    frequency: 'weekly' as RecurringSchedule['frequency'],
    day_of_week: 'Monday',
    time_of_day: '09:00',
  });
  const [addingSchedule, setAddingSchedule] = useState(false);

  // Invoices
  const [invoices, setInvoices] = useState<CorporateInvoice[]>([]);

  useEffect(() => {
    if (user) {
      setCompanyEmail(user.email ?? '');
      getCorporateAccountByUserId(user.id).then(({ data }) => {
        if (data) {
          setAccount(data);
          loadAll(data.id);
        } else {
          setIsLoading(false);
        }
      });
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const loadAll = async (accountId: string) => {
    const [statsRes, bookingsRes, teamRes, schedulesRes, invoicesRes] = await Promise.all([
      getCorporateStats(accountId),
      getCorporateBookings(accountId),
      getTeamMembers(accountId),
      getRecurringSchedules(accountId),
      getCorporateInvoices(accountId),
    ]);
    if (statsRes.data) setStats(statsRes.data);
    setCorpBookings(bookingsRes.data);
    setTeam(teamRes.data);
    setSchedules(schedulesRes.data);
    setInvoices(invoicesRes.data);
    setIsLoading(false);
  };

  const refreshStats = (accountId: string) =>
    getCorporateStats(accountId).then(({ data }) => { if (data) setStats(data); });

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSigningUp(true);
    setSignupError(null);
    const { data, error } = await registerCorporateAccount(companyName, companyEmail, companyPhone, user?.id);
    setSigningUp(false);
    if (error) { setSignupError(error.message); return; }
    setAccount(data!);
    loadAll(data!.id);
  };

  const handleBulkSubmit = async () => {
    if (!account) return;
    setSubmittingBulk(true);
    setBulkError(null);
    const { data, error } = await createBulkBookings(account.id, bulkRows, user?.id);
    setSubmittingBulk(false);
    if (error) { setBulkError(error.message); return; }
    setCorpBookings(prev => [...data, ...prev]);
    setBulkRows([{ ...EMPTY_ROW }, { ...EMPTY_ROW }, { ...EMPTY_ROW }]);
    setBulkSuccess(true);
    setTimeout(() => setBulkSuccess(false), 4000);
    refreshStats(account.id);
  };

  const handleAddMember = async () => {
    if (!account || !newMemberEmail) return;
    setAddingMember(true);
    const { data, error } = await addTeamMember(account.id, newMemberEmail, newMemberName, newMemberRole);
    setAddingMember(false);
    if (error || !data) return;
    setTeam(prev => [...prev, data]);
    setNewMemberName(''); setNewMemberEmail(''); setNewMemberRole('booker');
    setShowAddMember(false);
    refreshStats(account.id);
  };

  const handleRemoveMember = async (id: string) => {
    await removeTeamMember(id);
    setTeam(prev => prev.filter(m => m.id !== id));
    if (account) refreshStats(account.id);
  };

  const handleAddSchedule = async () => {
    if (!account || !scheduleForm.pickup_address || !scheduleForm.delivery_address) return;
    setAddingSchedule(true);
    const { data, error } = await createRecurringSchedule({ ...scheduleForm, account_id: account.id, is_active: true });
    setAddingSchedule(false);
    if (error || !data) return;
    setSchedules(prev => [...prev, data]);
    setScheduleForm({ pickup_address: '', delivery_address: '', vehicle_type: 'Medium Van', frequency: 'weekly', day_of_week: 'Monday', time_of_day: '09:00' });
    setShowAddSchedule(false);
    refreshStats(account.id);
  };

  const handleToggleSchedule = async (id: string, isActive: boolean) => {
    const { data } = await toggleRecurringSchedule(id, !isActive);
    if (data) setSchedules(prev => prev.map(s => s.id === id ? data : s));
    if (account) refreshStats(account.id);
  };

  const handleDeleteSchedule = async (id: string) => {
    await deleteRecurringSchedule(id);
    setSchedules(prev => prev.filter(s => s.id !== id));
  };

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#0A2463] animate-spin" />
      </div>
    );
  }

  // ── Signup ───────────────────────────────────────────────────────────────────
  if (!account) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#0A2463] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Corporate Logistics Portal</h1>
            <p className="text-gray-600 max-w-xl mx-auto">Streamline your business deliveries with bulk bookings, recurring schedules, and detailed analytics.</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Create Corporate Account</h2>
              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                  <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} required className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0A2463] outline-none" placeholder="Your Company Ltd" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Business Email</label>
                  <input type="email" value={companyEmail} onChange={e => setCompanyEmail(e.target.value)} required className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0A2463] outline-none" placeholder="logistics@company.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input type="tel" value={companyPhone} onChange={e => setCompanyPhone(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0A2463] outline-none" placeholder="+44 20 xxxx xxxx" />
                </div>
                {signupError && (
                  <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                    <AlertCircle className="w-4 h-4 shrink-0" /> {signupError}
                  </div>
                )}
                <button type="submit" disabled={signingUp} className="w-full bg-[#0A2463] hover:bg-[#1B3A8C] disabled:opacity-60 text-white py-3.5 rounded-xl font-bold text-lg transition-colors flex items-center justify-center gap-2">
                  {signingUp ? <Loader2 className="w-5 h-5 animate-spin" /> : <><span>Create Account</span><ArrowRight className="w-5 h-5" /></>}
                </button>
              </form>
              {!user && (
                <p className="text-center text-sm text-gray-500 mt-4">
                  Already registered?{' '}
                  <button onClick={() => onNavigate('login')} className="text-[#0A2463] font-medium hover:underline">Sign in</button>
                </p>
              )}
            </div>
            <div className="space-y-4">
              {FEATURES.map((f, idx) => (
                <div key={idx} className="flex gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 bg-[#0A2463]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <f.icon className="w-5 h-5 text-[#0A2463]" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{f.title}</p>
                    <p className="text-gray-500 text-sm">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Dashboard ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{account.company_name} — Corporate Portal</h1>
            <p className="text-gray-500 text-sm">{account.email}</p>
          </div>
          <button onClick={() => onNavigate('home')} className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Back
          </button>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {['dashboard', 'bookings', 'recurring', 'team', 'invoices'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors capitalize ${
              activeTab === tab ? 'bg-[#0A2463] text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}>{tab}</button>
          ))}
        </div>

        {/* ── Dashboard ── */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Deliveries', value: stats?.totalDeliveries ?? 0, icon: MapPin },
                { label: 'This Month Cost', value: `£${(stats?.monthCost ?? 0).toLocaleString()}`, icon: FileText },
                { label: 'Active Schedules', value: stats?.activeSchedules ?? 0, icon: Repeat },
                { label: 'Team Members', value: stats?.teamMembers ?? 0, icon: Users },
              ].map((s, idx) => (
                <div key={idx} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                  <s.icon className="w-6 h-6 text-[#0A2463] mb-2" />
                  <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                  <p className="text-gray-500 text-sm">{s.label}</p>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4">4-Week Delivery Analytics</h3>
              {stats?.weeklyData.some(w => w.deliveries > 0) ? (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={stats.weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="week" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip />
                    <Bar dataKey="deliveries" fill="#0A2463" radius={[4, 4, 0, 0]} name="Deliveries" />
                    <Bar dataKey="cost" fill="#D4AF37" radius={[4, 4, 0, 0]} name="Cost (£)" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                  <BarChart3 className="w-12 h-12 mb-3 opacity-30" />
                  <p className="text-sm">Submit your first bulk booking to see analytics here.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Bookings ── */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4">Bulk Booking</h3>
              <div className="space-y-3">
                {bulkRows.map((row, i) => (
                  <div key={i} className="grid grid-cols-1 md:grid-cols-5 gap-3 p-4 bg-gray-50 rounded-xl items-center">
                    <input
                      value={row.pickup}
                      onChange={e => setBulkRows(prev => prev.map((r, idx) => idx === i ? { ...r, pickup: e.target.value } : r))}
                      placeholder="Pickup address"
                      className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#0A2463]"
                    />
                    <input
                      value={row.delivery}
                      onChange={e => setBulkRows(prev => prev.map((r, idx) => idx === i ? { ...r, delivery: e.target.value } : r))}
                      placeholder="Delivery address"
                      className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#0A2463]"
                    />
                    <input
                      value={row.date}
                      onChange={e => setBulkRows(prev => prev.map((r, idx) => idx === i ? { ...r, date: e.target.value } : r))}
                      type="date"
                      className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#0A2463]"
                    />
                    <select
                      value={row.vehicle}
                      onChange={e => setBulkRows(prev => prev.map((r, idx) => idx === i ? { ...r, vehicle: e.target.value } : r))}
                      className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#0A2463]"
                    >
                      {['Small Van', 'Medium Van', 'Large Van', 'Luton Van'].map(v => <option key={v}>{v}</option>)}
                    </select>
                    <button
                      onClick={() => setBulkRows(prev => prev.filter((_, idx) => idx !== i))}
                      className="text-gray-400 hover:text-red-500 transition-colors flex items-center justify-center"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setBulkRows(prev => [...prev, { ...EMPTY_ROW }])}
                className="flex items-center gap-2 text-[#0A2463] text-sm font-medium hover:underline mt-3"
              >
                <Plus className="w-4 h-4" /> Add another delivery
              </button>
              {bulkError && (
                <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg mt-3">
                  <AlertCircle className="w-4 h-4" /> {bulkError}
                </div>
              )}
              {bulkSuccess && (
                <div className="flex items-center gap-2 text-green-700 text-sm bg-green-50 p-3 rounded-lg mt-3">
                  <CheckCircle className="w-4 h-4" /> Bookings submitted successfully!
                </div>
              )}
              <button
                onClick={handleBulkSubmit}
                disabled={submittingBulk}
                className="w-full mt-4 bg-[#D4AF37] hover:bg-[#C5A028] disabled:opacity-60 text-[#0A2463] py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
              >
                {submittingBulk && <Loader2 className="w-4 h-4 animate-spin" />}
                {submittingBulk ? 'Submitting…' : 'Submit Bulk Booking'}
              </button>
            </div>

            {corpBookings.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4">Recent Bookings</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-gray-500 border-b border-gray-100">
                        <th className="pb-2 font-medium">Collection</th>
                        <th className="pb-2 font-medium">Delivery</th>
                        <th className="pb-2 font-medium">Vehicle</th>
                        <th className="pb-2 font-medium">Status</th>
                        <th className="pb-2 font-medium">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {corpBookings.map(b => (
                        <tr key={b.id} className="hover:bg-gray-50">
                          <td className="py-3 pr-4 max-w-[160px] truncate">{b.collection_address}</td>
                          <td className="py-3 pr-4 max-w-[160px] truncate">{b.delivery_address}</td>
                          <td className="py-3 pr-4">{b.vehicle_type}</td>
                          <td className="py-3 pr-4">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              b.status === 'completed' ? 'bg-green-100 text-green-700' :
                              b.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-blue-100 text-blue-700'
                            }`}>{b.status}</span>
                          </td>
                          <td className="py-3 text-gray-500">{new Date(b.created_at).toLocaleDateString('en-GB')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Recurring ── */}
        {activeTab === 'recurring' && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">Recurring Delivery Schedules</h3>
              <button
                onClick={() => setShowAddSchedule(v => !v)}
                className="flex items-center gap-2 bg-[#0A2463] hover:bg-[#1B3A8C] text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
              >
                <Plus className="w-4 h-4" /> Add Schedule
              </button>
            </div>

            {showAddSchedule && (
              <div className="bg-gray-50 rounded-xl p-5 mb-5 space-y-3 border border-gray-200">
                <p className="font-semibold text-gray-900 text-sm">New Schedule</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input value={scheduleForm.pickup_address} onChange={e => setScheduleForm(f => ({ ...f, pickup_address: e.target.value }))} placeholder="Pickup address" className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#0A2463]" />
                  <input value={scheduleForm.delivery_address} onChange={e => setScheduleForm(f => ({ ...f, delivery_address: e.target.value }))} placeholder="Delivery address" className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#0A2463]" />
                  <select value={scheduleForm.frequency} onChange={e => setScheduleForm(f => ({ ...f, frequency: e.target.value as RecurringSchedule['frequency'] }))} className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#0A2463]">
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="biweekly">Bi-weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                  <input value={scheduleForm.day_of_week ?? ''} onChange={e => setScheduleForm(f => ({ ...f, day_of_week: e.target.value }))} placeholder="Day (e.g. Monday)" className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#0A2463]" />
                  <input value={scheduleForm.time_of_day} onChange={e => setScheduleForm(f => ({ ...f, time_of_day: e.target.value }))} type="time" className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#0A2463]" />
                  <select value={scheduleForm.vehicle_type} onChange={e => setScheduleForm(f => ({ ...f, vehicle_type: e.target.value }))} className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#0A2463]">
                    {['Small Van', 'Medium Van', 'Large Van', 'Luton Van'].map(v => <option key={v}>{v}</option>)}
                  </select>
                </div>
                <div className="flex gap-2 justify-end">
                  <button onClick={() => setShowAddSchedule(false)} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-100">Cancel</button>
                  <button onClick={handleAddSchedule} disabled={addingSchedule} className="px-4 py-2 text-sm bg-[#0A2463] text-white rounded-lg font-semibold hover:bg-[#1B3A8C] disabled:opacity-60 flex items-center gap-2">
                    {addingSchedule && <Loader2 className="w-3 h-3 animate-spin" />} Save Schedule
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {schedules.length === 0 ? (
                <p className="text-center text-gray-400 py-10 text-sm">No recurring schedules yet.</p>
              ) : schedules.map(s => (
                <div key={s.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-4">
                    <Repeat className={`w-5 h-5 shrink-0 ${s.is_active ? 'text-green-500' : 'text-gray-400'}`} />
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{s.pickup_address} → {s.delivery_address}</p>
                      <p className="text-gray-500 text-xs capitalize">{s.frequency}{s.day_of_week ? ` (${s.day_of_week})` : ''} at {s.time_of_day} · {s.vehicle_type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${s.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}>
                      {s.is_active ? 'Active' : 'Paused'}
                    </span>
                    <button onClick={() => handleToggleSchedule(s.id, s.is_active)} className="text-[#0A2463] text-xs font-medium hover:underline">
                      {s.is_active ? 'Pause' : 'Resume'}
                    </button>
                    <button onClick={() => handleDeleteSchedule(s.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Team ── */}
        {activeTab === 'team' && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">Team Members</h3>
              <button
                onClick={() => setShowAddMember(v => !v)}
                className="flex items-center gap-2 bg-[#0A2463] hover:bg-[#1B3A8C] text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
              >
                <Plus className="w-4 h-4" /> Add Member
              </button>
            </div>

            {showAddMember && (
              <div className="bg-gray-50 rounded-xl p-5 mb-5 space-y-3 border border-gray-200">
                <p className="font-semibold text-gray-900 text-sm">Invite Team Member</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input value={newMemberName} onChange={e => setNewMemberName(e.target.value)} placeholder="Full name" className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#0A2463]" />
                  <input value={newMemberEmail} onChange={e => setNewMemberEmail(e.target.value)} type="email" placeholder="Email address" className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#0A2463]" />
                  <select value={newMemberRole} onChange={e => setNewMemberRole(e.target.value as CorporateRole)} className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#0A2463]">
                    <option value="admin">Admin</option>
                    <option value="manager">Manager</option>
                    <option value="booker">Booker</option>
                    <option value="viewer">Viewer</option>
                  </select>
                </div>
                <div className="flex gap-2 justify-end">
                  <button onClick={() => setShowAddMember(false)} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-100">Cancel</button>
                  <button onClick={handleAddMember} disabled={addingMember || !newMemberEmail} className="px-4 py-2 text-sm bg-[#0A2463] text-white rounded-lg font-semibold hover:bg-[#1B3A8C] disabled:opacity-60 flex items-center gap-2">
                    {addingMember && <Loader2 className="w-3 h-3 animate-spin" />} Add Member
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {team.length === 0 ? (
                <p className="text-center text-gray-400 py-10 text-sm">No team members yet.</p>
              ) : team.map(m => (
                <div key={m.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#0A2463] rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {(m.name ?? m.email).slice(0, 1).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{m.name ?? '—'}</p>
                      <p className="text-gray-500 text-sm">{m.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${ROLE_COLOURS[m.role]}`}>{m.role}</span>
                    <button onClick={() => handleRemoveMember(m.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Invoices ── */}
        {activeTab === 'invoices' && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4">Monthly Invoices</h3>
            {invoices.length === 0 ? (
              <p className="text-center text-gray-400 py-10 text-sm">
                Invoices are generated automatically from your corporate bookings.
              </p>
            ) : (
              <div className="space-y-3">
                {invoices.map((inv, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-semibold text-gray-900">{inv.label}</p>
                      <p className="text-gray-500 text-sm">{inv.deliveries} {inv.deliveries === 1 ? 'delivery' : 'deliveries'}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="text-xl font-bold text-[#0A2463]">£{inv.amount.toLocaleString()}</p>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        inv.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                      }`}>{inv.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CorporatePortal;
