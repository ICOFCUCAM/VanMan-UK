import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Star, Truck, DollarSign, Filter, CheckCircle, X, Navigation, Users, Package, ArrowUpDown, Loader2, AlertCircle, Wallet, ChevronRight } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import { getAvailableJobs } from '@/services/jobs';
import { assignDriverToBooking, getBookingsByDriver, updateBookingStatus } from '@/services/bookings';
import { setDriverOnline } from '@/services/drivers';
import { getDriverWallet, confirmCompletionAsDriver } from '@/services/escrow';
import type { Job, Booking } from '@/types';
import type { DriverWallet } from '@/services/escrow';

interface DriverMarketplaceProps {
  onNavigate: (page: string) => void;
}

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

const DriverMarketplace: React.FC<DriverMarketplaceProps> = ({ onNavigate }) => {
  const { driver } = useAppContext();
  const [activeTab, setActiveTab] = useState<'marketplace' | 'my-jobs'>('marketplace');
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

  useEffect(() => {
    Promise.all([
      getAvailableJobs(),
      driver ? getBookingsByDriver(driver.id) : Promise.resolve({ data: [], error: null }),
      driver ? getDriverWallet(driver.id) : Promise.resolve({ data: null, error: null }),
    ]).then(([jobsRes, bookingsRes, walletRes]) => {
      if (jobsRes.error) setError(jobsRes.error.message);
      else setJobs(jobsRes.data);
      setMyBookings((bookingsRes.data ?? []).filter(b => ['assigned', 'in_progress', 'completed'].includes(b.status)));
      setWallet(walletRes.data);
      setIsLoading(false);
    });
  }, [driver]);

  const toggleOnline = async () => {
    if (!driver) return;
    const newState = !isOnline;
    setIsOnline(newState);
    await setDriverOnline(driver.id, newState);
  };

  const handleAccept = async (job: Job) => {
    if (!driver || !job.booking_id) return;
    const { error: err } = await assignDriverToBooking(job.booking_id, driver.id);
    if (err) { setError(err.message); return; }
    setJobs(prev => prev.filter(j => j.id !== job.id));
    setAcceptedJob(job.id);
    setTimeout(() => setAcceptedJob(null), 4000);
    // Refresh my bookings
    const { data } = await getBookingsByDriver(driver.id);
    setMyBookings((data ?? []).filter(b => ['assigned', 'in_progress', 'completed'].includes(b.status)));
  };

  const handleDecline = (jobId: string) => {
    setJobs(prev => prev.filter(j => j.id !== jobId));
  };

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
    const { error: err } = await confirmCompletionAsDriver(bookingId);
    if (err) { setError(err.message); }
    else {
      setMyBookings(prev => prev.map(b => b.id === bookingId ? { ...b, driver_confirmation: true } : b));
      // Refresh wallet after confirmation
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

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Driver Marketplace</h1>
            <p className="text-gray-600 mt-1">
              {isLoading ? 'Loading…' : `${filteredJobs.length} job${filteredJobs.length !== 1 ? 's' : ''} available`}
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
            <button onClick={() => setShowWallet(!showWallet)} className="bg-[#F5B400] hover:bg-[#E5A000] text-[#0E2A47] px-4 py-2.5 rounded-lg font-semibold text-sm transition-colors flex items-center gap-2">
              <Wallet className="w-4 h-4" /> £{walletBalance.toFixed(2)}
              {walletPending > 0 && <span className="text-[#0E2A47]/70 text-xs">(+£{walletPending.toFixed(2)} pending)</span>}
            </button>
            <button onClick={() => onNavigate('home')} className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2.5 rounded-lg font-medium text-sm transition-colors">
              Back
            </button>
          </div>
        </div>

        {/* Wallet Panel */}
        {showWallet && driver && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Driver Wallet</h3>
              <button onClick={() => setShowWallet(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
              <div className="bg-green-50 rounded-xl p-4">
                <p className="text-xs text-green-600 font-medium">Available Balance</p>
                <p className="text-xl font-bold text-green-700">£{walletBalance.toFixed(2)}</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-4">
                <p className="text-xs text-blue-600 font-medium">In Escrow</p>
                <p className="text-xl font-bold text-blue-700">£{walletPending.toFixed(2)}</p>
              </div>
              <div className="bg-[#F5B400]/10 rounded-xl p-4">
                <p className="text-xs text-[#0E2A47] font-medium">Total Earned</p>
                <p className="text-xl font-bold text-[#0E2A47]">£{(wallet?.total_earned ?? driver.total_earnings).toFixed(2)}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-600 font-medium">Tier</p>
                <p className="text-xl font-bold text-gray-700 capitalize">
                  {driver.tier === 'elite' ? '💎 Elite' : driver.tier === 'gold_pro' ? '🥇 Gold Pro' : driver.tier === 'gold' ? '⭐ Gold' : driver.tier === 'silver_plus' ? '🥈 Silver Plus' : '🥈 Silver'}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {driver.tier === 'elite' ? '10%' : driver.tier === 'gold_pro' ? '12%' : driver.tier === 'gold' ? '15%' : driver.tier === 'silver_plus' ? '18%' : '20%'} commission
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button disabled title="Coming soon" className="bg-[#0E2A47] text-white px-6 py-2.5 rounded-lg font-semibold text-sm opacity-60 cursor-not-allowed flex items-center gap-2">
                Bank Transfer <span className="text-xs font-normal opacity-80">soon</span>
              </button>
              <button disabled title="Coming soon" className="bg-[#F5B400] text-[#0E2A47] px-6 py-2.5 rounded-lg font-semibold text-sm opacity-60 cursor-not-allowed flex items-center gap-2">
                Instant Payout <span className="text-xs font-normal opacity-80">soon</span>
              </button>
            </div>
          </div>
        )}

        {/* Accepted notification */}
        {acceptedJob && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex items-center gap-3 animate-in slide-in-from-top-2">
            <CheckCircle className="w-6 h-6 text-green-500 shrink-0" />
            <div>
              <p className="font-semibold text-green-800">Job Accepted!</p>
              <p className="text-green-600 text-sm">Navigate to the pickup location. The customer has been notified.</p>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6 w-fit">
          <button
            onClick={() => setActiveTab('marketplace')}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'marketplace' ? 'bg-white text-[#0E2A47] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Available Jobs {filteredJobs.length > 0 && <span className="ml-1.5 bg-[#0E2A47] text-white text-xs rounded-full px-1.5 py-0.5">{filteredJobs.length}</span>}
          </button>
          <button
            onClick={() => setActiveTab('my-jobs')}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'my-jobs' ? 'bg-white text-[#0E2A47] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            My Jobs {myBookings.length > 0 && <span className="ml-1.5 bg-[#0E2A47] text-white text-xs rounded-full px-1.5 py-0.5">{myBookings.length}</span>}
          </button>
        </div>

        {/* ── Available Jobs Tab ── */}
        {activeTab === 'marketplace' && (
          <>
            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-6">
              <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 px-3 py-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select value={filterTier} onChange={e => setFilterTier(e.target.value)} className="bg-transparent text-sm font-medium text-gray-700 outline-none">
                  <option value="all">All Tiers</option>
                  <option value="gold">Golden Star Only</option>
                  <option value="silver">Silver Star Only</option>
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
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${job.tier === 'gold' ? 'bg-[#F5B400]/10 text-[#F5B400]' : 'bg-gray-100 text-gray-600'}`}>
                          {job.tier === 'gold' ? '⭐ Golden Star' : '🥈 Silver Star'}
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
                          <p className="text-xs font-semibold text-gray-700">{job.customerRating}</p>
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
                        <p className="text-2xl font-bold text-[#0E2A47]">£{job.price}</p>
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

        {/* ── My Jobs Tab ── */}
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
                  const isConfirming = confirmingJob === booking.id;
                  const canStart = booking.status === 'assigned';
                  const canMarkDelivered = booking.status === 'in_progress';
                  const canConfirm = booking.status === 'completed' && !booking.driver_confirmation;
                  const alreadyConfirmed = booking.driver_confirmation;

                  return (
                    <div key={booking.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div>
                          <p className="font-mono text-xs text-gray-400 mb-1">
                            {booking.booking_ref ?? booking.id.slice(0, 8).toUpperCase()}
                          </p>
                          <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                            booking.status === 'assigned' ? 'bg-indigo-100 text-indigo-700' :
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

                      {booking.driver_earning && (
                        <p className="text-xs text-gray-500 mb-4">
                          Your earnings: <span className="font-bold text-green-700">£{booking.driver_earning.toFixed(2)}</span>
                          {booking.commission_rate && <span className="text-gray-400 ml-1">({Math.round(booking.commission_rate * 100)}% commission deducted)</span>}
                        </p>
                      )}

                      <div className="flex gap-2 flex-wrap">
                        {canStart && (
                          <button
                            onClick={() => handleStartJob(booking.id)}
                            className="flex-1 bg-[#0E2A47] hover:bg-[#0F3558] text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                          >
                            <Navigation className="w-4 h-4" /> Start Journey
                          </button>
                        )}
                        {canMarkDelivered && (
                          <button
                            onClick={() => handleMarkDelivered(booking.id)}
                            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                          >
                            <MapPin className="w-4 h-4" /> Mark Delivered
                          </button>
                        )}
                        {canConfirm && (
                          <button
                            onClick={() => handleConfirmCompletion(booking.id)}
                            disabled={isConfirming}
                            className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                          >
                            {isConfirming ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                            Confirm Completion
                          </button>
                        )}
                        {alreadyConfirmed && (
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
