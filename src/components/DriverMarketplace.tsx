import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Star, Truck, DollarSign, Filter, CheckCircle, X, Navigation, Users, Package, ArrowUpDown, Loader2, AlertCircle } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import { getAvailableJobs } from '@/services/jobs';
import { assignDriverToBooking } from '@/services/bookings';
import { setDriverOnline } from '@/services/drivers';
import type { Job } from '@/types';

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
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterTier, setFilterTier] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('price-desc');
  const [acceptedJob, setAcceptedJob] = useState<string | null>(null);
  const [showWallet, setShowWallet] = useState(false);
  const [isOnline, setIsOnline] = useState(driver?.is_online ?? false);

  useEffect(() => {
    getAvailableJobs().then(({ data, error: err }) => {
      if (err) setError(err.message);
      else setJobs(data);
      setIsLoading(false);
    });
  }, []);

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
  };

  const handleDecline = (jobId: string) => {
    setJobs(prev => prev.filter(j => j.id !== jobId));
  };

  const filteredJobs = jobs
    .filter(j => filterTier === 'all' || j.tier === filterTier)
    .sort((a, b) => {
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'distance') return parseFloat(a.distance) - parseFloat(b.distance);
      return b.customerRating - a.customerRating;
    });

  const earnings = driver?.total_earnings ?? 0;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Driver Marketplace</h1>
            <p className="text-gray-600 mt-1">
              {isLoading ? 'Loading jobs…' : `${filteredJobs.length} job${filteredJobs.length !== 1 ? 's' : ''} available`}
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {/* Online toggle */}
            <button
              onClick={toggleOnline}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm transition-colors ${
                isOnline ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-white animate-pulse' : 'bg-gray-400'}`} />
              {isOnline ? 'Online' : 'Go Online'}
            </button>
            <button onClick={() => setShowWallet(!showWallet)} className="bg-[#D4AF37] hover:bg-[#C5A028] text-[#0A2463] px-4 py-2.5 rounded-lg font-semibold text-sm transition-colors flex items-center gap-2">
              <DollarSign className="w-4 h-4" /> £{earnings.toFixed(2)}
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
                <p className="text-xs text-green-600 font-medium">Total Earnings</p>
                <p className="text-xl font-bold text-green-700">£{driver.total_earnings.toFixed(2)}</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-4">
                <p className="text-xs text-blue-600 font-medium">Total Jobs</p>
                <p className="text-xl font-bold text-blue-700">{driver.total_jobs}</p>
              </div>
              <div className="bg-[#D4AF37]/10 rounded-xl p-4">
                <p className="text-xs text-[#0A2463] font-medium">Rating</p>
                <p className="text-xl font-bold text-[#0A2463]">★ {driver.rating.toFixed(1)}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-600 font-medium">Tier</p>
                <p className="text-xl font-bold text-gray-700 capitalize">{driver.tier === 'gold' ? '⭐ Gold' : '🥈 Silver'}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="bg-[#0A2463] hover:bg-[#1B3A8C] text-white px-6 py-2.5 rounded-lg font-semibold text-sm transition-colors">Bank Transfer</button>
              <button className="bg-[#D4AF37] hover:bg-[#C5A028] text-[#0A2463] px-6 py-2.5 rounded-lg font-semibold text-sm transition-colors">Instant Payout</button>
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

        {/* Jobs Grid */}
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
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${job.tier === 'gold' ? 'bg-[#D4AF37]/10 text-[#D4AF37]' : 'bg-gray-100 text-gray-600'}`}>
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
                      <Star className="w-4 h-4 text-[#D4AF37] mx-auto mb-0.5" />
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
                    <p className="text-2xl font-bold text-[#0A2463]">£{job.price}</p>
                    <div className="flex gap-2">
                      <button onClick={() => handleDecline(job.id)} className="px-4 py-2 rounded-lg border-2 border-gray-200 text-gray-500 hover:border-red-300 hover:text-red-500 text-sm font-medium transition-colors">
                        Decline
                      </button>
                      <button onClick={() => handleAccept(job)} className="px-6 py-2 rounded-lg bg-[#0A2463] hover:bg-[#1B3A8C] text-white text-sm font-semibold transition-colors">
                        Accept
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverMarketplace;
