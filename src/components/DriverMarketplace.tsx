import React, { useState, useEffect, useMemo } from 'react';
import {
  MapPin, Clock, Truck, Filter, CheckCircle, X, Navigation, Users, Package,
  ArrowUpDown, Loader2, AlertCircle, Wallet, ChevronRight, TrendingUp,
  Star, Award, ArrowRight, CreditCard, BarChart3, Activity, Zap,
} from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import { getAvailableJobs } from '@/services/jobs';
import { assignDriverToBooking, getBookingsByDriver, updateBookingStatus } from '@/services/bookings';
import { TIER_COMMISSION } from '@/lib/constants';
import { setDriverOnline } from '@/services/drivers';
import { getDriverWallet, confirmCompletionAsDriver, processCashReimbursement } from '@/services/escrow';
import type { Job, Booking } from '@/types';
import type { DriverWallet } from '@/services/escrow';

interface DriverMarketplaceProps {
  onNavigate: (page: string) => void;
}

// ── Tier config ──────────────────────────────────────────────────────────────
const TIER_ORDER = ['silver', 'silver_plus', 'gold', 'gold_pro', 'elite'] as const;

const TIER_LABEL: Record<string, string> = {
  silver:      '🥈 Silver',
  silver_plus: '🥈 Silver Plus',
  gold:        '⭐ Gold',
  gold_pro:    '🥇 Gold Pro',
  elite:       '💎 Elite',
};

const TIER_COLOR: Record<string, { bg: string; text: string; border: string }> = {
  silver:      { bg: 'bg-gray-100',           text: 'text-gray-700',    border: 'border-gray-300' },
  silver_plus: { bg: 'bg-blue-50',            text: 'text-blue-700',    border: 'border-blue-300' },
  gold:        { bg: 'bg-[#F5B400]/10',       text: 'text-[#B48A00]',   border: 'border-[#F5B400]/40' },
  gold_pro:    { bg: 'bg-amber-100',          text: 'text-amber-700',   border: 'border-amber-300' },
  elite:       { bg: 'bg-[#0E2A47]/10',       text: 'text-[#0E2A47]',  border: 'border-[#0E2A47]/30' },
};

// ── UK city heatmap data ─────────────────────────────────────────────────────
const UK_CITIES = [
  { name: 'London',       x: 141, y: 224, activity: 9 },
  { name: 'Birmingham',   x: 110, y: 196, activity: 7 },
  { name: 'Manchester',   x: 104, y: 168, activity: 7 },
  { name: 'Leeds',        x: 117, y: 160, activity: 5 },
  { name: 'Sheffield',    x: 117, y: 171, activity: 4 },
  { name: 'Liverpool',    x:  90, y: 171, activity: 4 },
  { name: 'Bristol',      x:  97, y: 224, activity: 4 },
  { name: 'Newcastle',    x: 115, y: 126, activity: 3 },
  { name: 'Glasgow',      x:  67, y: 101, activity: 5 },
  { name: 'Edinburgh',    x:  86, y: 101, activity: 3 },
  { name: 'Cardiff',      x:  86, y: 230, activity: 2 },
  { name: 'Southampton',  x: 119, y: 240, activity: 2 },
  { name: 'Nottingham',   x: 122, y: 183, activity: 3 },
  { name: 'Leicester',    x: 124, y: 191, activity: 3 },
];

function activityColor(level: number): string {
  if (level >= 8) return '#F5B400';
  if (level >= 6) return '#0E2A47';
  if (level >= 4) return '#2E6A9E';
  return '#93C5FD';
}

// ── Skeleton ─────────────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
    <div className="flex justify-between mb-3">
      <div className="h-3 bg-gray-200 rounded w-24" />
      <div className="h-5 bg-gray-200 rounded-full w-20" />
    </div>
    <div className="space-y-2 mb-4">
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-4 bg-gray-200 rounded w-2/3" />
    </div>
    <div className="grid grid-cols-4 gap-2 mb-4">
      {[...Array(4)].map((_, i) => <div key={i} className="h-12 bg-gray-100 rounded-lg" />)}
    </div>
    <div className="flex justify-between">
      <div className="h-7 bg-gray-200 rounded w-16" />
      <div className="flex gap-2">
        <div className="h-9 bg-gray-200 rounded-lg w-20" />
        <div className="h-9 bg-gray-200 rounded-lg w-20" />
      </div>
    </div>
  </div>
);

// ── Component ────────────────────────────────────────────────────────────────
const DriverMarketplace: React.FC<DriverMarketplaceProps> = ({ onNavigate }) => {
  const { driver } = useAppContext();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'marketplace' | 'my-jobs'>('dashboard');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [myBookings, setMyBookings] = useState<Booking[]>([]);
  const [wallet, setWallet] = useState<DriverWallet | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterTier, setFilterTier] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('price-desc');
  const [acceptedJob, setAcceptedJob] = useState<string | null>(null);
  const [showWallet, setShowWallet] = useState(false);
  const [isOnline, setIsOnline] = useState(driver?.is_online ?? false);
  const [confirmingJob, setConfirmingJob] = useState<string | null>(null);
  const [pendingConfirm, setPendingConfirm] = useState<string | null>(null); // dual confirm step 1

  const fetchData = async (silent = false) => {
    if (!silent) setIsLoading(true);
    const [jobsRes, bookingsRes, walletRes] = await Promise.all([
      getAvailableJobs(),
      driver ? getBookingsByDriver(driver.id) : Promise.resolve({ data: [], error: null }),
      driver ? getDriverWallet(driver.id) : Promise.resolve({ data: null, error: null }),
    ]);
    if (jobsRes.error) setError(jobsRes.error.message);
    else setJobs(jobsRes.data);
    setMyBookings((bookingsRes.data ?? []).filter(b => ['assigned', 'in_progress', 'completed'].includes(b.status)));
    setWallet(walletRes.data);
    if (!silent) setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => fetchData(true), 30_000);
    return () => clearInterval(interval);
  }, [driver]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleOnline = async () => {
    if (!driver) return;
    const next = !isOnline;
    setIsOnline(next);
    await setDriverOnline(driver.id, next);
  };

  const handleAccept = async (job: Job) => {
    if (!driver || !job.booking_id) return;
    const { error: err } = await assignDriverToBooking(job.booking_id, driver.id);
    if (err) { setError(err.message); return; }
    setJobs(prev => prev.filter(j => j.id !== job.id));
    setAcceptedJob(job.id);
    setTimeout(() => setAcceptedJob(null), 4000);
    const { data } = await getBookingsByDriver(driver.id);
    setMyBookings((data ?? []).filter(b => ['assigned', 'in_progress', 'completed'].includes(b.status)));
  };

  const handleDecline = (jobId: string) => setJobs(prev => prev.filter(j => j.id !== jobId));

  const handleStartJob = async (bookingId: string) => {
    const { error: err } = await updateBookingStatus(bookingId, 'in_progress');
    if (err) { setError(err.message); return; }
    setMyBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'in_progress' as const } : b));
  };

  const handleMarkDelivered = async (bookingId: string) => {
    const { error: err } = await updateBookingStatus(bookingId, 'completed');
    if (err) { setError(err.message); return; }
    setMyBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'completed' as const } : b));
  };

  const handleConfirmCompletion = async (bookingId: string) => {
    setConfirmingJob(bookingId);
    setPendingConfirm(null);
    const { error: err } = await confirmCompletionAsDriver(bookingId);
    if (err) { setError(err.message); }
    else {
      // For cash bookings, process tier-based platform reimbursement
      const completedBooking = myBookings.find(b => b.id === bookingId);
      if (completedBooking?.payment_method === 'cash' && driver) {
        await processCashReimbursement(
          bookingId,
          driver.id,
          driver.tier ?? 'silver',
          completedBooking.estimated_price,
        );
      }
      setMyBookings(prev => prev.map(b => b.id === bookingId ? { ...b, driver_confirmation: true } : b));
      if (driver) {
        const { data } = await getDriverWallet(driver.id);
        setWallet(data);
      }
    }
    setConfirmingJob(null);
  };

  const filteredJobs = jobs
    .filter(j => filterTier === 'all' || j.tier === filterTier)
    .sort((a, b) => {
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'distance') return parseFloat(a.distance) - parseFloat(b.distance);
      return b.customerRating - a.customerRating;
    });

  const walletBalance = wallet?.balance ?? 0;
  const walletPending = wallet?.pending ?? 0;
  const totalEarned   = wallet?.total_earned ?? driver?.total_earnings ?? 0;
  const commissionPct = TIER_COMMISSION[driver?.tier ?? 'silver'] ?? 30;
  const currentTierIdx = TIER_ORDER.indexOf((driver?.tier ?? 'silver') as typeof TIER_ORDER[number]);
  const nextTier = TIER_ORDER[currentTierIdx + 1] ?? null;

  // Weekly earnings from completed bookings
  const weeklyData = useMemo(() => {
    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const amounts = Array(7).fill(0);
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    myBookings.forEach(b => {
      if (b.status === 'completed' && b.driver_earning && b.updated_at) {
        const d = new Date(b.updated_at);
        if (d >= weekAgo) {
          const idx = d.getDay() === 0 ? 6 : d.getDay() - 1;
          amounts[idx] += b.driver_earning;
        }
      }
    });
    const max = Math.max(...amounts, 1);
    return labels.map((label, i) => ({ label, amount: amounts[i], pct: amounts[i] / max }));
  }, [myBookings]);

  const completedJobs = myBookings.filter(b => b.status === 'completed').length;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Driver Portal</h1>
            <p className="text-gray-500 mt-0.5 text-sm">
              {driver ? `${driver.first_name} ${driver.last_name}` : 'Loading…'} · {TIER_LABEL[driver?.tier ?? 'silver']}
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={toggleOnline}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm transition-colors ${
                isOnline ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-white animate-pulse' : 'bg-gray-400'}`} />
              {isOnline ? 'Online' : 'Go Online'}
            </button>
            <button
              onClick={() => setShowWallet(!showWallet)}
              className="bg-[#F5B400] hover:bg-[#E5A000] text-[#0E2A47] px-4 py-2.5 rounded-lg font-semibold text-sm transition-colors flex items-center gap-2"
            >
              <Wallet className="w-4 h-4" /> £{walletBalance.toFixed(2)}
              {walletPending > 0 && <span className="text-[#0E2A47]/70 text-xs">(+£{walletPending.toFixed(2)})</span>}
            </button>
            <button onClick={() => onNavigate('home')} className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2.5 rounded-lg font-medium text-sm transition-colors">
              Back
            </button>
          </div>
        </div>

        {/* ── Wallet Panel ── */}
        {showWallet && driver && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Driver Wallet</h3>
              <button onClick={() => setShowWallet(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
              <div className="bg-green-50 rounded-xl p-4">
                <p className="text-xs text-green-600 font-medium">Available</p>
                <p className="text-xl font-bold text-green-700">£{walletBalance.toFixed(2)}</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-4">
                <p className="text-xs text-blue-600 font-medium">In Escrow</p>
                <p className="text-xl font-bold text-blue-700">£{walletPending.toFixed(2)}</p>
              </div>
              <div className="bg-[#F5B400]/10 rounded-xl p-4">
                <p className="text-xs text-[#0E2A47] font-medium">Total Earned</p>
                <p className="text-xl font-bold text-[#0E2A47]">£{totalEarned.toFixed(2)}</p>
              </div>
              <div className={`rounded-xl p-4 ${TIER_COLOR[driver.tier]?.bg ?? 'bg-gray-50'}`}>
                <p className="text-xs text-gray-600 font-medium">Current Tier</p>
                <p className={`text-lg font-bold ${TIER_COLOR[driver.tier]?.text ?? 'text-gray-700'}`}>
                  {TIER_LABEL[driver.tier]}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">{commissionPct}% commission</p>
              </div>
            </div>
            <div className="flex gap-3 flex-wrap">
              <button disabled className="bg-[#0E2A47] text-white px-6 py-2.5 rounded-lg font-semibold text-sm opacity-50 cursor-not-allowed flex items-center gap-2">
                Bank Transfer <span className="text-xs font-normal opacity-80">soon</span>
              </button>
              <button disabled className="bg-[#F5B400] text-[#0E2A47] px-6 py-2.5 rounded-lg font-semibold text-sm opacity-50 cursor-not-allowed flex items-center gap-2">
                Instant Payout <span className="text-xs font-normal opacity-80">soon</span>
              </button>
              <button
                onClick={() => { setShowWallet(false); onNavigate('driver-subscription'); }}
                className="ml-auto bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors flex items-center gap-2"
              >
                <CreditCard className="w-4 h-4" /> Change Plan
              </button>
            </div>
          </div>
        )}

        {/* ── Accepted notification ── */}
        {acceptedJob && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-500 shrink-0" />
            <div>
              <p className="font-semibold text-green-800">Job Accepted!</p>
              <p className="text-green-600 text-sm">Navigate to the pickup location. The customer has been notified.</p>
            </div>
          </div>
        )}

        {/* ── Error ── */}
        {error && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
            <p className="text-red-700 text-sm">{error}</p>
            <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-600"><X className="w-4 h-4" /></button>
          </div>
        )}

        {/* ── Tabs ── */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6 w-fit">
          {(['dashboard', 'marketplace', 'my-jobs'] as const).map(tab => {
            const label = tab === 'dashboard' ? 'Dashboard' : tab === 'marketplace' ? 'Available Jobs' : 'My Jobs';
            const count = tab === 'marketplace' ? filteredJobs.length : tab === 'my-jobs' ? myBookings.length : 0;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === tab ? 'bg-white text-[#0E2A47] shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {label}
                {count > 0 && (
                  <span className="ml-1.5 bg-[#0E2A47] text-white text-xs rounded-full px-1.5 py-0.5">{count}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* ════════════════════════════════════════════════════════════════════
            DASHBOARD TAB
        ════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">

            {/* Stats row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 bg-[#0E2A47]/10 rounded-lg">
                    <Truck className="w-4 h-4 text-[#0E2A47]" />
                  </div>
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Jobs Done</span>
                </div>
                <p className="text-3xl font-bold text-gray-900">{driver?.total_jobs ?? 0}</p>
                <p className="text-xs text-gray-400 mt-1">{completedJobs} this session</p>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Earned</span>
                </div>
                <p className="text-3xl font-bold text-gray-900">£{totalEarned.toFixed(0)}</p>
                <p className="text-xs text-green-600 mt-1">£{walletBalance.toFixed(2)} available</p>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 bg-[#F5B400]/20 rounded-lg">
                    <Star className="w-4 h-4 text-[#F5B400]" />
                  </div>
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Rating</span>
                </div>
                <p className="text-3xl font-bold text-gray-900">{(driver?.rating ?? 5.0).toFixed(1)}</p>
                <div className="flex gap-0.5 mt-1">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className={`w-3 h-3 ${i <= Math.round(driver?.rating ?? 5) ? 'text-[#F5B400] fill-[#F5B400]' : 'text-gray-200 fill-gray-200'}`} />
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Activity className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Commission</span>
                </div>
                <p className="text-3xl font-bold text-gray-900">{commissionPct}%</p>
                <p className="text-xs text-gray-400 mt-1">
                  {nextTier ? `${TIER_COMMISSION[nextTier]}% on ${TIER_LABEL[nextTier]}` : 'Best rate unlocked'}
                </p>
              </div>
            </div>

            {/* Subscription card + Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* Subscription card */}
              <div className="lg:col-span-1 bg-white rounded-2xl border border-gray-100 p-6 flex flex-col">
                <div className="flex items-center gap-2 mb-4">
                  <Award className="w-5 h-5 text-[#0E2A47]" />
                  <h3 className="font-bold text-gray-900">Your Plan</h3>
                </div>

                <div className={`rounded-xl border p-4 mb-4 ${TIER_COLOR[driver?.tier ?? 'silver'].bg} ${TIER_COLOR[driver?.tier ?? 'silver'].border}`}>
                  <p className={`text-2xl font-bold mb-1 ${TIER_COLOR[driver?.tier ?? 'silver'].text}`}>
                    {TIER_LABEL[driver?.tier ?? 'silver']}
                  </p>
                  <p className="text-sm text-gray-600">{commissionPct}% platform commission</p>
                  <p className="text-sm text-gray-600">Keep {100 - commissionPct}% of every job</p>
                </div>

                {nextTier && (
                  <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 mb-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Upgrade to {TIER_LABEL[nextTier]}</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Save {commissionPct - (TIER_COMMISSION[nextTier] ?? 0)}% commission</p>
                        <p className="text-xs text-gray-400">Keep {100 - (TIER_COMMISSION[nextTier] ?? 0)}% per job</p>
                      </div>
                      <Zap className="w-5 h-5 text-[#F5B400]" />
                    </div>
                  </div>
                )}

                <button
                  onClick={() => onNavigate('driver-subscription')}
                  className="mt-auto w-full bg-[#0E2A47] hover:bg-[#0F3558] text-white px-4 py-3 rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2"
                >
                  {nextTier ? 'Upgrade Plan' : 'Manage Plan'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Weekly earnings chart */}
              <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-[#0E2A47]" />
                    <h3 className="font-bold text-gray-900">Weekly Earnings</h3>
                  </div>
                  <span className="text-xs text-gray-400">Last 7 days</span>
                </div>

                {weeklyData.every(d => d.amount === 0) ? (
                  <div className="flex flex-col items-center justify-center h-36 text-center">
                    <BarChart3 className="w-10 h-10 text-gray-200 mb-2" />
                    <p className="text-sm text-gray-400">Earnings will appear here as you complete jobs</p>
                  </div>
                ) : (
                  <div className="flex items-end gap-2 h-36">
                    {weeklyData.map(({ label, amount, pct }) => (
                      <div key={label} className="flex-1 flex flex-col items-center gap-1">
                        <span className="text-xs font-semibold text-[#0E2A47]">
                          {amount > 0 ? `£${amount.toFixed(0)}` : ''}
                        </span>
                        <div
                          className="w-full rounded-t-lg transition-all duration-500"
                          style={{
                            height: `${Math.max(pct * 96, 4)}px`,
                            background: pct > 0.7 ? '#F5B400' : pct > 0.4 ? '#0E2A47' : '#CBD5E1',
                          }}
                        />
                        <span className="text-xs text-gray-400">{label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* UK heatmap */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-[#0E2A47]" />
                <h3 className="font-bold text-gray-900">UK Job Activity</h3>
                <span className="ml-auto text-xs text-gray-400">Live demand heatmap</span>
              </div>
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="relative flex-shrink-0">
                  <svg viewBox="0 0 180 290" width="180" height="290" className="overflow-visible">
                    {/* Background */}
                    <rect x="40" y="85" width="115" height="185" rx="12" fill="#F1F5F9" opacity="0.8" />
                    {/* Scotland top */}
                    <ellipse cx="88" cy="95" rx="45" ry="20" fill="#E2E8F0" opacity="0.6" />

                    {/* City dots */}
                    {UK_CITIES.map(city => {
                      const r = 3 + city.activity * 1.4;
                      const color = activityColor(city.activity);
                      return (
                        <g key={city.name}>
                          {city.activity >= 6 && (
                            <circle cx={city.x} cy={city.y} r={r + 5} fill={color} opacity="0.15">
                              <animate attributeName="r" values={`${r+3};${r+9};${r+3}`} dur="2s" repeatCount="indefinite" />
                              <animate attributeName="opacity" values="0.2;0.05;0.2" dur="2s" repeatCount="indefinite" />
                            </circle>
                          )}
                          <circle cx={city.x} cy={city.y} r={r} fill={color} opacity="0.85" />
                          <text
                            x={city.x}
                            y={city.y - r - 3}
                            textAnchor="middle"
                            fontSize="7"
                            fill="#475569"
                            fontFamily="system-ui"
                          >
                            {city.name}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>

                <div className="flex-1 space-y-3">
                  <p className="text-sm text-gray-600 font-medium">Highest demand areas</p>
                  {[...UK_CITIES].sort((a, b) => b.activity - a.activity).slice(0, 6).map(city => (
                    <div key={city.name} className="flex items-center gap-3">
                      <span className="text-sm text-gray-700 w-24">{city.name}</span>
                      <div className="flex-1 bg-gray-100 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all"
                          style={{
                            width: `${city.activity * 10}%`,
                            background: activityColor(city.activity),
                          }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-gray-500 w-8 text-right">{city.activity * 10}%</span>
                    </div>
                  ))}
                  <div className="pt-3 border-t border-gray-100 flex flex-wrap gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#F5B400] inline-block" /> High demand</span>
                    <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#0E2A47] inline-block" /> Medium</span>
                    <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#2E6A9E] inline-block" /> Active</span>
                    <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#93C5FD] inline-block" /> Low</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════════
            AVAILABLE JOBS TAB
        ════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'marketplace' && (
          <>
            <div className="flex flex-wrap gap-3 mb-6">
              <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 px-3 py-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select value={filterTier} onChange={e => setFilterTier(e.target.value)} className="bg-transparent text-sm font-medium text-gray-700 outline-none">
                  <option value="all">All Tiers</option>
                  <option value="gold">Gold Only</option>
                  <option value="silver">Silver Only</option>
                </select>
              </div>
              <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 px-3 py-2">
                <ArrowUpDown className="w-4 h-4 text-gray-400" />
                <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="bg-transparent text-sm font-medium text-gray-700 outline-none">
                  <option value="price-desc">Highest Price</option>
                  <option value="price-asc">Lowest Price</option>
                  <option value="distance">Nearest First</option>
                  <option value="rating">Best Customer Rating</option>
                </select>
              </div>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="text-center py-20">
                <Truck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No jobs available right now</h3>
                <p className="text-gray-400 text-sm">New jobs appear here as customers book. Check back soon.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredJobs.map(job => (
                  <div key={job.id} className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden">
                    <div className="p-5">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-mono text-gray-400">{job.id.slice(0, 8).toUpperCase()}</span>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          job.tier === 'gold' || job.tier === 'gold_pro' || job.tier === 'elite'
                            ? 'bg-[#F5B400]/10 text-[#B48A00]'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {job.tier ? TIER_LABEL[job.tier] : '📦 Standard'}
                        </span>
                      </div>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-start gap-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full mt-1 shrink-0" />
                          <p className="text-sm text-gray-800 font-medium">{job.pickup}</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full mt-1 shrink-0" />
                          <p className="text-sm text-gray-800 font-medium">{job.dropoff}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-4 gap-2 mb-4">
                        <div className="text-center bg-gray-50 rounded-lg p-2">
                          <Navigation className="w-4 h-4 text-gray-400 mx-auto mb-0.5" />
                          <p className="text-xs font-semibold text-gray-700">{job.distance}</p>
                        </div>
                        <div className="text-center bg-gray-50 rounded-lg p-2">
                          <Clock className="w-4 h-4 text-gray-400 mx-auto mb-0.5" />
                          <p className="text-xs font-semibold text-gray-700">{job.duration}</p>
                        </div>
                        <div className="text-center bg-gray-50 rounded-lg p-2">
                          <Star className="w-4 h-4 text-[#F5B400] mx-auto mb-0.5" />
                          <p className="text-xs font-semibold text-gray-700">{job.customerRating ?? '—'}</p>
                        </div>
                        <div className="text-center bg-gray-50 rounded-lg p-2">
                          <Users className="w-4 h-4 text-gray-400 mx-auto mb-0.5" />
                          <p className="text-xs font-semibold text-gray-700">{job.helpers} help</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mb-4">
                        <Package className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{job.items}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-2xl font-bold text-[#0E2A47]">£{job.price}</p>
                          {job.paymentMethod === 'cash' ? (
                            <p className="text-xs text-amber-600">
                              £{Math.round(job.price * 0.70)} cash + £{Math.round(job.price * (30 - commissionPct) / 100)} wallet
                            </p>
                          ) : (
                            <p className="text-xs text-green-600">
                              You keep £{(job.price * (1 - commissionPct / 100)).toFixed(2)}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => handleDecline(job.id)} className="px-4 py-2 rounded-lg border-2 border-gray-200 text-gray-500 hover:border-red-300 hover:text-red-500 text-sm font-medium transition-colors">
                            Decline
                          </button>
                          <button onClick={() => handleAccept(job)} className="px-6 py-2 rounded-lg bg-[#0E2A47] hover:bg-[#0F3558] text-white text-sm font-semibold transition-colors">
                            Accept
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ════════════════════════════════════════════════════════════════════
            MY JOBS TAB
        ════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'my-jobs' && (
          <>
            {myBookings.length === 0 ? (
              <div className="text-center py-20">
                <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No active jobs</h3>
                <p className="text-gray-400 text-sm">Accept a job from the marketplace to see it here.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {myBookings.map(booking => {
                  const isConfirming  = confirmingJob === booking.id;
                  const awaitConfirm  = pendingConfirm === booking.id;
                  const canStart      = booking.status === 'assigned';
                  const canDeliver    = booking.status === 'in_progress';
                  const canConfirm    = booking.status === 'completed' && !booking.driver_confirmation;
                  const confirmed     = booking.driver_confirmation;

                  return (
                    <div key={booking.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div>
                          <p className="font-mono text-xs text-gray-400 mb-1">
                            {booking.booking_ref ?? booking.id.slice(0, 8).toUpperCase()}
                          </p>
                          <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                            booking.status === 'assigned'    ? 'bg-indigo-100 text-indigo-700' :
                            booking.status === 'in_progress' ? 'bg-purple-100 text-purple-700' :
                                                               'bg-green-100 text-green-700'
                          }`}>
                            {booking.status === 'assigned' ? 'Assigned' : booking.status === 'in_progress' ? 'In Progress' : 'Completed'}
                          </span>
                        </div>
                        <p className="text-2xl font-bold text-[#0E2A47]">£{booking.estimated_price}</p>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-start gap-2">
                          <div className="w-2.5 h-2.5 bg-green-500 rounded-full mt-1.5 shrink-0" />
                          <p className="text-sm text-gray-700 leading-snug">{booking.collection_address}</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="w-2.5 h-2.5 bg-red-500 rounded-full mt-1.5 shrink-0" />
                          <p className="text-sm text-gray-700 leading-snug">{booking.delivery_address}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                        <span className="flex items-center gap-1"><Navigation className="w-3.5 h-3.5" /> {booking.distance_miles} mi</span>
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {booking.duration}</span>
                      </div>

                      {booking.payment_method === 'cash' ? (
                        <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-4 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-amber-700">Cash from customer (70%)</span>
                            <span className="text-sm font-bold text-amber-800">£{Math.round(booking.estimated_price * 0.70)}</span>
                          </div>
                          {(() => {
                            const tierPct    = TIER_COMMISSION[driver?.tier ?? 'silver'] ?? 30;
                            const reimbPct   = 30 - tierPct;
                            const reimbAmt   = Math.round(booking.estimated_price * reimbPct / 100);
                            return reimbPct > 0 ? (
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-green-600">Platform reimbursement ({reimbPct}%)</span>
                                <span className="text-sm font-bold text-green-700">+£{reimbAmt}</span>
                              </div>
                            ) : (
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-400">No platform reimbursement (Silver)</span>
                                <span className="text-xs text-gray-400">£0</span>
                              </div>
                            );
                          })()}
                          <div className="border-t border-amber-200 pt-1 flex items-center justify-between">
                            <span className="text-xs font-semibold text-gray-600">Total you keep</span>
                            <span className="text-sm font-bold text-[#0E2A47]">
                              £{Math.round(booking.estimated_price * (100 - (TIER_COMMISSION[driver?.tier ?? 'silver'] ?? 30)) / 100)}
                            </span>
                          </div>
                        </div>
                      ) : booking.driver_earning != null ? (
                        <div className="bg-green-50 rounded-lg px-3 py-2 mb-4 flex items-center justify-between">
                          <span className="text-xs text-gray-500">Your earnings</span>
                          <span className="font-bold text-green-700">
                            £{booking.driver_earning.toFixed(2)}
                            {booking.commission_rate != null && (
                              <span className="text-xs font-normal text-gray-400 ml-1">
                                ({Math.round(booking.commission_rate * 100)}% deducted)
                              </span>
                            )}
                          </span>
                        </div>
                      ) : null}

                      {/* Action buttons */}
                      <div className="flex gap-2 flex-wrap">
                        {canStart && (
                          <button
                            onClick={() => handleStartJob(booking.id)}
                            className="flex-1 bg-[#0E2A47] hover:bg-[#0F3558] text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                          >
                            <Navigation className="w-4 h-4" /> Start Journey
                          </button>
                        )}

                        {canDeliver && (
                          <button
                            onClick={() => handleMarkDelivered(booking.id)}
                            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                          >
                            <MapPin className="w-4 h-4" /> Mark Delivered
                          </button>
                        )}

                        {/* ── Dual confirmation ── */}
                        {canConfirm && !awaitConfirm && (
                          <button
                            onClick={() => setPendingConfirm(booking.id)}
                            className="flex-1 bg-green-100 hover:bg-green-200 text-green-800 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2 border-2 border-green-300"
                          >
                            <CheckCircle className="w-4 h-4" /> Confirm Completion
                          </button>
                        )}
                        {canConfirm && awaitConfirm && (
                          <div className="flex-1 flex gap-2">
                            <button
                              onClick={() => setPendingConfirm(null)}
                              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleConfirmCompletion(booking.id)}
                              disabled={isConfirming}
                              className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white px-3 py-2.5 rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-1.5"
                            >
                              {isConfirming
                                ? <Loader2 className="w-4 h-4 animate-spin" />
                                : <CheckCircle className="w-4 h-4" />
                              }
                              Yes, Confirm
                            </button>
                          </div>
                        )}

                        {confirmed && (
                          <span className="flex items-center gap-1.5 text-green-600 text-sm font-semibold">
                            <CheckCircle className="w-4 h-4" /> Completion Confirmed
                          </span>
                        )}

                        <button
                          onClick={() => onNavigate('tracking')}
                          className="px-4 py-2.5 rounded-lg border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-1"
                        >
                          Track <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
};

export default DriverMarketplace;
