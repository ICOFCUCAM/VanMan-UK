import React, { useState, useEffect } from 'react';
import { MapPin, Clock, CheckCircle2, Loader2, Package, ChevronRight, ArrowLeft, AlertCircle, CreditCard, Truck, Star, TrendingUp } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import { getBookingsByCustomer } from '@/services/bookings';
import { confirmDeliveryAsCustomer } from '@/services/escrow';
import { PAYMENT_STATUS_LABELS, PAYMENT_STATUS_STYLES } from '@/lib/constants';
import type { Booking } from '@/types';

interface CustomerDashboardProps {
  onNavigate: (page: string) => void;
}

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-700 border border-amber-200',
  confirmed: 'bg-blue-50 text-blue-700 border border-blue-200',
  assigned: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
  in_progress: 'bg-purple-50 text-purple-700 border border-purple-200',
  completed: 'bg-green-50 text-green-700 border border-green-200',
  cancelled: 'bg-red-50 text-red-600 border border-red-200',
};

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  assigned: 'Driver Assigned',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

interface BookingCardProps {
  booking: Booking;
  onTrack: () => void;
  onPay: () => void;
  onConfirmDelivery: () => Promise<void>;
}

const BookingCard: React.FC<BookingCardProps> = ({ booking, onTrack, onPay, onConfirmDelivery }) => {
  const [confirming, setConfirming] = useState(false);

  const handleConfirm = async () => {
    setConfirming(true);
    await onConfirmDelivery();
    setConfirming(false);
  };

  const showPayBtn = booking.payment_status === 'pending' && booking.payment_method === 'card';
  const showConfirmBtn = booking.status === 'completed' && !booking.customer_confirmation;
  const isActive = ['assigned', 'in_progress'].includes(booking.status);

  return (
    <div className={`group bg-white rounded-3xl border transition-all hover:-translate-y-0.5 hover:shadow-lg ${isActive ? 'border-[#0A2463]/20 shadow-md shadow-[#0A2463]/5' : 'border-gray-100 shadow-sm'}`}>
      {/* Card top stripe for active bookings */}
      {isActive && (
        <div className="h-1 bg-gradient-to-r from-[#0A2463] to-[#1B3A8C] rounded-t-3xl" />
      )}

      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <p className="font-mono text-xs text-gray-350 mb-1.5">
              {booking.booking_ref ?? booking.id.slice(0, 8).toUpperCase()}
            </p>
            <div className="flex flex-wrap gap-1.5">
              <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${STATUS_STYLES[booking.status] ?? 'bg-gray-50 text-gray-600 border border-gray-200'}`}>
                {STATUS_LABELS[booking.status] ?? booking.status}
              </span>
              {booking.payment_status && (
                <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${PAYMENT_STATUS_STYLES[booking.payment_status] ?? 'bg-gray-50 text-gray-600 border border-gray-200'}`}>
                  {PAYMENT_STATUS_LABELS[booking.payment_status] ?? booking.payment_status}
                </span>
              )}
            </div>
          </div>
          <div className="text-right shrink-0">
            <p className="text-2xl font-black text-[#0A2463]">£{booking.estimated_price}</p>
            <p className="text-gray-400 text-xs mt-0.5">{booking.payment_method === 'card' ? 'Card' : 'Cash'}</p>
          </div>
        </div>

        {/* Addresses */}
        <div className="space-y-2.5 mb-4 bg-gray-50 rounded-2xl p-3.5">
          <div className="flex items-start gap-2.5">
            <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
            </div>
            <p className="text-sm text-gray-700 leading-snug font-medium">{booking.collection_address}</p>
          </div>
          <div className="flex items-start gap-2.5">
            <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
              <div className="w-2 h-2 bg-red-500 rounded-full" />
            </div>
            <p className="text-sm text-gray-700 leading-snug font-medium">{booking.delivery_address}</p>
          </div>
        </div>

        {/* Meta */}
        <div className="flex items-center gap-3 text-xs text-gray-400 mb-4 flex-wrap">
          <span className="flex items-center gap-1 font-medium"><MapPin className="w-3.5 h-3.5" /> {booking.distance_miles} mi</span>
          <span className="w-0.5 h-3 bg-gray-200 rounded" />
          <span className="flex items-center gap-1 font-medium"><Clock className="w-3.5 h-3.5" /> {booking.duration}</span>
          <span className="w-0.5 h-3 bg-gray-200 rounded" />
          <span className="flex items-center gap-1 font-medium"><Package className="w-3.5 h-3.5" /> {booking.vehicle_type}</span>
        </div>

        {booking.driver && (
          <div className="flex items-center gap-2 mb-4 py-2.5 px-3.5 bg-indigo-50 rounded-xl border border-indigo-100">
            <div className="w-6 h-6 bg-[#0A2463] rounded-full flex items-center justify-center shrink-0">
              <Truck className="w-3 h-3 text-white" />
            </div>
            <p className="text-xs font-semibold text-indigo-800">
              {booking.driver.first_name} {booking.driver.last_name} assigned
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <p className="text-xs text-gray-350">
            {new Date(booking.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
          <div className="flex gap-2 flex-wrap">
            {showPayBtn && (
              <button
                onClick={onPay}
                className="flex items-center gap-1.5 bg-[#D4AF37] hover:bg-[#C5A028] text-[#061539] px-4 py-2 rounded-xl text-xs font-black transition-all hover:shadow-md"
              >
                <CreditCard className="w-3.5 h-3.5" /> Complete Payment
              </button>
            )}
            {showConfirmBtn && (
              <button
                onClick={handleConfirm}
                disabled={confirming}
                className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors"
              >
                {confirming ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                Confirm Delivery
              </button>
            )}
            {booking.customer_confirmation && booking.status === 'completed' && (
              <span className="flex items-center gap-1.5 text-green-600 text-xs font-bold bg-green-50 border border-green-200 px-3 py-2 rounded-xl">
                <CheckCircle2 className="w-3.5 h-3.5" /> Confirmed
              </span>
            )}
            {isActive && (
              <button
                onClick={onTrack}
                className="flex items-center gap-1.5 bg-[#0A2463] hover:bg-[#1B3A8C] text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors"
              >
                Track Live <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

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

  const handlePay = (bookingId: string) => {
    sessionStorage.setItem('pending_payment_booking_id', bookingId);
    onNavigate('payment');
  };

  const handleConfirmDelivery = async (bookingId: string) => {
    const { error: err } = await confirmDeliveryAsCustomer(bookingId);
    if (!err) {
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, customer_confirmation: true } : b));
    }
  };

  const active = bookings.filter(b => !['completed', 'cancelled'].includes(b.status));
  const history = bookings.filter(b => ['completed', 'cancelled'].includes(b.status));
  const displayed = tab === 'active' ? active : history;

  const totalSpend = history.filter(b => b.status === 'completed').reduce((sum, b) => sum + (b.estimated_price || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="py-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-black text-gray-400 tracking-widest uppercase mb-1">Customer Portal</p>
              <h1 className="text-3xl font-black text-gray-900">My Bookings</h1>
              <p className="text-gray-500 mt-1 text-sm">Welcome back, <span className="font-semibold text-gray-700">{user?.full_name || user?.email?.split('@')[0]}</span></p>
            </div>
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2 text-gray-500 hover:text-[#0A2463] font-medium text-sm transition-colors group shrink-0 mt-2"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" /> Home
            </button>
          </div>

          {/* Quick stats */}
          {!isLoading && bookings.length > 0 && (
            <div className="grid grid-cols-3 gap-3 mt-6">
              {[
                { label: 'Total Bookings', value: bookings.length, icon: Package },
                { label: 'Active Now', value: active.length, icon: Truck },
                { label: 'Total Spent', value: `£${totalSpend}`, icon: TrendingUp },
              ].map((stat, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
                  <div className="w-9 h-9 bg-[#0A2463]/8 rounded-xl flex items-center justify-center shrink-0">
                    <stat.icon className="w-4 h-4 text-[#0A2463]" />
                  </div>
                  <div>
                    <p className="text-xl font-black text-gray-900">{stat.value}</p>
                    <p className="text-gray-400 text-xs font-medium">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-2xl p-1 mb-6 w-fit">
          {(['active', 'history'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                tab === t ? 'bg-white text-[#0A2463] shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {t === 'active' ? 'Active' : 'History'}
              {t === 'active' && active.length > 0 && (
                <span className="ml-2 bg-[#0A2463] text-white text-xs rounded-full px-1.5 py-0.5 font-black">{active.length}</span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <Loader2 className="w-8 h-8 text-[#0A2463] animate-spin" />
            <p className="text-gray-400 text-sm">Loading your bookings…</p>
          </div>
        ) : error ? (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-2xl p-4">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
            <p className="text-red-700 text-sm font-medium">{error}</p>
          </div>
        ) : displayed.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              {tab === 'active' ? <Truck className="w-8 h-8 text-gray-300" /> : <Star className="w-8 h-8 text-gray-300" />}
            </div>
            <h3 className="text-lg font-black text-gray-700 mb-2">
              {tab === 'active' ? 'No active bookings' : 'No completed bookings yet'}
            </h3>
            <p className="text-gray-400 text-sm mb-8">
              {tab === 'active' ? 'Book a van to get started — quotes take under 60 seconds.' : 'Your completed jobs will appear here.'}
            </p>
            {tab === 'active' && (
              <button
                onClick={() => onNavigate('home')}
                className="bg-[#D4AF37] hover:bg-[#C5A028] text-[#061539] px-8 py-3.5 rounded-2xl font-black text-sm transition-all hover:shadow-xl hover:shadow-[#D4AF37]/25"
              >
                Get a Quote Now
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayed.map(b => (
              <BookingCard
                key={b.id}
                booking={b}
                onTrack={() => onNavigate('tracking')}
                onPay={() => handlePay(b.id)}
                onConfirmDelivery={() => handleConfirmDelivery(b.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;
