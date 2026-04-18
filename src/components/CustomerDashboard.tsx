import React, { useState, useEffect } from 'react';
import { MapPin, Clock, CheckCircle2, Loader2, Package, ChevronRight, ArrowLeft, AlertCircle } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import { getBookingsByCustomer } from '@/services/bookings';
import type { Booking } from '@/types';

interface CustomerDashboardProps {
  onNavigate: (page: string) => void;
}

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  assigned: 'bg-indigo-100 text-indigo-700',
  in_progress: 'bg-purple-100 text-purple-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  assigned: 'Driver Assigned',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

const BookingCard: React.FC<{ booking: Booking; onTrack: () => void }> = ({ booking, onTrack }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5">
    <div className="flex items-start justify-between gap-3 mb-4">
      <div>
        <p className="font-mono text-xs text-gray-400 mb-1">
          {booking.booking_ref ?? booking.id.slice(0, 8).toUpperCase()}
        </p>
        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[booking.status] ?? 'bg-gray-100 text-gray-600'}`}>
          {STATUS_LABELS[booking.status] ?? booking.status}
        </span>
      </div>
      <p className="text-2xl font-bold text-[#0A2463] shrink-0">£{booking.estimated_price}</p>
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
      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {booking.distance_miles} mi</span>
      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {booking.duration}</span>
      <span className="flex items-center gap-1"><Package className="w-3.5 h-3.5" /> {booking.vehicle_type}</span>
    </div>

    {booking.driver && (
      <p className="text-xs text-gray-500 mb-3">
        Driver: <span className="font-semibold text-gray-700">{booking.driver.first_name} {booking.driver.last_name}</span>
      </p>
    )}

    <div className="flex items-center justify-between">
      <p className="text-xs text-gray-400">{new Date(booking.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
      {(booking.status === 'assigned' || booking.status === 'in_progress') && (
        <button onClick={onTrack} className="flex items-center gap-1 text-[#0A2463] text-sm font-semibold hover:underline">
          Track <ChevronRight className="w-4 h-4" />
        </button>
      )}
    </div>
  </div>
);

const CustomerDashboard: React.FC<CustomerDashboardProps> = ({ onNavigate }) => {
  const { user } = useAppContext();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<'active' | 'history'>('active');

  useEffect(() => {
    if (!user) return;
    getBookingsByCustomer(user.id).then(({ data, error: err }) => {
      if (err) setError(err.message);
      else setBookings(data);
      setIsLoading(false);
    });
  }, [user]);

  const active = bookings.filter(b => !['completed', 'cancelled'].includes(b.status));
  const history = bookings.filter(b => ['completed', 'cancelled'].includes(b.status));
  const displayed = tab === 'active' ? active : history;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
            <p className="text-gray-500 mt-1">Welcome back, {user?.full_name || user?.email}</p>
          </div>
          <button onClick={() => onNavigate('home')} className="flex items-center gap-2 text-[#0A2463] font-medium hover:underline text-sm">
            <ArrowLeft className="w-4 h-4" /> Home
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6 w-fit">
          <button
            onClick={() => setTab('active')}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${tab === 'active' ? 'bg-white text-[#0A2463] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Active {active.length > 0 && <span className="ml-1.5 bg-[#0A2463] text-white text-xs rounded-full px-1.5 py-0.5">{active.length}</span>}
          </button>
          <button
            onClick={() => setTab('history')}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${tab === 'history' ? 'bg-white text-[#0A2463] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            History
          </button>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-[#0A2463] animate-spin" />
          </div>
        ) : error ? (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        ) : displayed.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              {tab === 'active' ? <Clock className="w-8 h-8 text-gray-400" /> : <CheckCircle2 className="w-8 h-8 text-gray-400" />}
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              {tab === 'active' ? 'No active bookings' : 'No completed bookings yet'}
            </h3>
            <p className="text-gray-500 text-sm mb-6">
              {tab === 'active' ? 'Book a van to get started.' : 'Your completed jobs will appear here.'}
            </p>
            {tab === 'active' && (
              <button onClick={() => onNavigate('home')} className="bg-[#D4AF37] hover:bg-[#C5A028] text-[#0A2463] px-6 py-2.5 rounded-xl font-bold text-sm transition-colors">
                Get a Quote
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayed.map(b => (
              <BookingCard key={b.id} booking={b} onTrack={() => onNavigate('tracking')} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;
