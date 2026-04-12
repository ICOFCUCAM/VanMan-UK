import React, { useState } from 'react';
import { MapPin, Clock, Star, Truck, DollarSign, Filter, CheckCircle, X, Navigation, Users, Package, ArrowUpDown } from 'lucide-react';
import { SAMPLE_JOBS } from '@/lib/constants';

interface DriverMarketplaceProps {
  onNavigate: (page: string) => void;
}

const DriverMarketplace: React.FC<DriverMarketplaceProps> = ({ onNavigate }) => {
  const [jobs, setJobs] = useState(SAMPLE_JOBS);
  const [filterTier, setFilterTier] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('price-desc');
  const [acceptedJob, setAcceptedJob] = useState<string | null>(null);
  const [showWallet, setShowWallet] = useState(false);

  const filteredJobs = jobs
    .filter(j => j.status === 'available')
    .filter(j => filterTier === 'all' || j.tier === filterTier)
    .sort((a, b) => {
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'distance') return parseFloat(a.distance) - parseFloat(b.distance);
      return b.customerRating - a.customerRating;
    });

  const handleAccept = (jobId: string) => {
    setAcceptedJob(jobId);
    setJobs(jobs.map(j => j.id === jobId ? { ...j, status: 'accepted' } : j));
    setTimeout(() => setAcceptedJob(null), 3000);
  };

  const handleDecline = (jobId: string) => {
    setJobs(jobs.map(j => j.id === jobId ? { ...j, status: 'declined' } : j));
  };

  // Wallet data
  const walletData = {
    balance: 1847.50,
    cardEarnings: 1250.00,
    cashEarnings: 780.00,
    bonuses: 120.00,
    penalties: -15.00,
    commission: -287.50,
    pendingPayout: 1547.50,
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Driver Marketplace</h1>
            <p className="text-gray-600 mt-1">{filteredJobs.length} jobs available in your area</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowWallet(!showWallet)} className="bg-[#D4AF37] hover:bg-[#C5A028] text-[#0A2463] px-4 py-2.5 rounded-lg font-semibold text-sm transition-colors flex items-center gap-2">
              <DollarSign className="w-4 h-4" /> Wallet: £{walletData.balance.toFixed(2)}
            </button>
            <button onClick={() => onNavigate('home')} className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2.5 rounded-lg font-medium text-sm transition-colors">
              Back
            </button>
          </div>
        </div>

        {/* Wallet Panel */}
        {showWallet && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Driver Wallet</h3>
              <button onClick={() => setShowWallet(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
              <div className="bg-green-50 rounded-xl p-4">
                <p className="text-xs text-green-600 font-medium">Total Balance</p>
                <p className="text-xl font-bold text-green-700">£{walletData.balance.toFixed(2)}</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-4">
                <p className="text-xs text-blue-600 font-medium">Card Earnings</p>
                <p className="text-xl font-bold text-blue-700">£{walletData.cardEarnings.toFixed(2)}</p>
              </div>
              <div className="bg-purple-50 rounded-xl p-4">
                <p className="text-xs text-purple-600 font-medium">Cash Earnings</p>
                <p className="text-xl font-bold text-purple-700">£{walletData.cashEarnings.toFixed(2)}</p>
              </div>
              <div className="bg-[#D4AF37]/10 rounded-xl p-4">
                <p className="text-xs text-[#D4AF37] font-medium">Bonuses</p>
                <p className="text-xl font-bold text-[#D4AF37]">£{walletData.bonuses.toFixed(2)}</p>
              </div>
              <div className="bg-red-50 rounded-xl p-4">
                <p className="text-xs text-red-600 font-medium">Penalties</p>
                <p className="text-xl font-bold text-red-700">£{walletData.penalties.toFixed(2)}</p>
              </div>
              <div className="bg-orange-50 rounded-xl p-4">
                <p className="text-xs text-orange-600 font-medium">Commission</p>
                <p className="text-xl font-bold text-orange-700">£{walletData.commission.toFixed(2)}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-600 font-medium">Pending Payout</p>
                <p className="text-xl font-bold text-gray-700">£{walletData.pendingPayout.toFixed(2)}</p>
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button className="bg-[#0A2463] hover:bg-[#1B3A8C] text-white px-6 py-2.5 rounded-lg font-semibold text-sm transition-colors">Bank Transfer</button>
              <button className="bg-[#D4AF37] hover:bg-[#C5A028] text-[#0A2463] px-6 py-2.5 rounded-lg font-semibold text-sm transition-colors">Instant Payout</button>
            </div>
          </div>
        )}

        {/* Accepted Job Notification */}
        {acceptedJob && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex items-center gap-3 animate-in slide-in-from-top-2">
            <CheckCircle className="w-6 h-6 text-green-500" />
            <div>
              <p className="font-semibold text-green-800">Job Accepted!</p>
              <p className="text-green-600 text-sm">Navigate to pickup location. Customer has been notified.</p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 px-3 py-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select value={filterTier} onChange={(e) => setFilterTier(e.target.value)} className="bg-transparent text-sm font-medium text-gray-700 outline-none">
              <option value="all">All Tiers</option>
              <option value="gold">Golden Star Only</option>
              <option value="silver">Silver Star Only</option>
            </select>
          </div>
          <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 px-3 py-2">
            <ArrowUpDown className="w-4 h-4 text-gray-400" />
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-transparent text-sm font-medium text-gray-700 outline-none">
              <option value="price-desc">Highest Price</option>
              <option value="price-asc">Lowest Price</option>
              <option value="distance">Nearest First</option>
              <option value="rating">Best Customer Rating</option>
            </select>
          </div>
        </div>

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredJobs.map((job) => (
            <div key={job.id} className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden">
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono text-gray-400">{job.id}</span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                    job.tier === 'gold' ? 'bg-[#D4AF37]/10 text-[#D4AF37]' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {job.tier === 'gold' ? 'Golden Star' : 'Silver Star'}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-start gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full mt-1 flex-shrink-0" />
                    <p className="text-sm text-gray-800 font-medium">{job.pickup}</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full mt-1 flex-shrink-0" />
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
                    <button onClick={() => handleAccept(job.id)} className="px-6 py-2 rounded-lg bg-[#0A2463] hover:bg-[#1B3A8C] text-white text-sm font-semibold transition-colors">
                      Accept
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <div className="text-center py-16">
            <Truck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No jobs available matching your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverMarketplace;
