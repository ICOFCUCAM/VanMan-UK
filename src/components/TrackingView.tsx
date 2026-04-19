import React, { useState } from 'react';
import { MapPin, Clock, Phone, MessageCircle, Star, Truck, Navigation, CheckCircle, Package, ArrowLeft, Shield, Headphones, User, Loader2, AlertCircle } from 'lucide-react';
import { FEATURE_IMAGES, BRAND } from '@/lib/constants';
import { getBookingById } from '@/services/bookings';
import type { Booking } from '@/types';

interface TrackingViewProps {
  onNavigate: (page: string) => void;
}

const STATUS_STEPS: Record<string, number> = {
  pending:     1,
  accepted:    2,
  in_progress: 4,
  completed:   7,
};

const TIMELINE_LABELS = [
  'Booking Confirmed',
  'Driver Assigned',
  'Driver En Route',
  'At Pickup Location',
  'Loading Goods',
  'In Transit',
  'Delivered',
];

function stepsCompleted(status: string): number {
  return STATUS_STEPS[status] ?? 1;
}

function progressPct(status: string): number {
  const s = STATUS_STEPS[status] ?? 1;
  return Math.min(95, Math.round((s / 7) * 100));
}

const TrackingView: React.FC<TrackingViewProps> = ({ onNavigate }) => {
  const [trackingId, setTrackingId]   = useState('');
  const [booking, setBooking]         = useState<Booking | null>(null);
  const [loading, setLoading]         = useState(false);
  const [notFound, setNotFound]       = useState(false);
  const [error, setError]             = useState<string | null>(null);

  async function handleTrack() {
    if (!trackingId.trim()) return;
    setLoading(true);
    setNotFound(false);
    setError(null);
    setBooking(null);

    const { data, error: svcError } = await getBookingById(trackingId.trim());
    setLoading(false);

    if (svcError || !data) {
      setNotFound(true);
      return;
    }
    setBooking(data);
  }

  const driver = (booking as any)?.driver ?? null;
  const status = booking?.status ?? 'pending';
  const done   = stepsCompleted(status);
  const pct    = progressPct(status);

  /* ── IDLE STATE ─────────────────────────────────────────────────────── */
  if (!booking) {
    return (
      <>
        {/* HERO */}
        <section className="relative pt-[88px] py-16 overflow-hidden">
          <img src={FEATURE_IMAGES.cityRoutes} alt="" className="absolute inset-0 w-full h-full object-cover object-center" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(7,26,47,0.82) 0%, rgba(14,42,71,0.78) 100%)' }} />

          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="text-[#F5B400] text-xs font-bold tracking-[0.2em] uppercase mb-4 block">Live Tracking</span>
            <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-5">
              Track your delivery in real time
            </h1>
            <p className="text-white/50 text-base leading-relaxed mb-8 max-w-xl mx-auto">
              Enter your booking reference to see live status, driver details, and delivery progress.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              {['GPS Tracked', 'Fully Insured', 'Verified Drivers'].map(label => (
                <span key={label} className="inline-flex items-center gap-2 bg-white/[0.08] border border-white/10 text-white/70 text-xs font-semibold px-4 py-2 rounded-full">
                  <Shield className="w-3.5 h-3.5 text-[#F5B400]" />{label}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* SEARCH */}
        <section className="py-12 bg-white border-t border-[#EEF2F7]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <label className="block text-[#0E2A47] text-xs font-bold tracking-[0.18em] uppercase mb-4">
              Enter your booking reference
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={trackingId}
                onChange={e => setTrackingId(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleTrack()}
                placeholder="Paste your booking ID here"
                className="flex-1 border border-gray-200 rounded-xl px-5 py-4 text-[#0B2239] placeholder:text-gray-400 text-sm focus:outline-none focus:border-[#0E2A47] transition-colors"
              />
              <button
                onClick={handleTrack}
                disabled={loading || !trackingId.trim()}
                className="bg-[#F5B400] hover:bg-[#E5A000] text-[#071A2F] font-black rounded-xl px-8 py-4 text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? 'Searching…' : 'Track Delivery'}
              </button>
            </div>

            {notFound && (
              <div className="mt-4 flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                <div>
                  <p className="text-red-800 font-semibold text-sm">Booking not found</p>
                  <p className="text-red-600 text-xs mt-0.5">Check your booking confirmation email for the correct reference.</p>
                </div>
              </div>
            )}

            {error && (
              <div className="mt-4 flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
                <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
                <p className="text-amber-800 text-sm">{error}</p>
              </div>
            )}

            <p className="text-gray-400 text-xs mt-4 text-center">
              Your booking reference was sent in your confirmation email. It starts with your booking ID.
            </p>
          </div>
        </section>

        {/* MAP PLACEHOLDER */}
        <section className="py-10 border-t border-[#EEF2F7] bg-[#F3F7FB]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative rounded-2xl overflow-hidden h-72">
              <img src={FEATURE_IMAGES.cityRoutes} alt="" className="absolute inset-0 w-full h-full object-cover opacity-40" />
              <div className="absolute inset-0 bg-[#071A2F]/55" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
                <Navigation className="w-12 h-12 text-[#F5B400]/50 mb-4" />
                <p className="text-white/70 font-semibold text-sm mb-2">Live map appears once tracking begins</p>
                <p className="text-white/35 text-xs max-w-xs">Enter your booking reference above to see your driver's location</p>
              </div>
            </div>
          </div>
        </section>

        {/* STAGES PREVIEW */}
        <section className="py-16 bg-white border-t border-[#EEF2F7]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="text-[#0E2A47] text-xs font-bold tracking-[0.2em] uppercase mb-3 block">Delivery Progress</span>
            <h2 className="text-2xl font-black text-[#0B2239] mb-10">Track every stage of your delivery</h2>
            <div className="relative">
              <div className="absolute top-7 left-[10%] right-[10%] h-0.5 bg-gray-100 hidden sm:block" />
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
                {['Booking Confirmed', 'Driver Assigned', 'Driver En Route', 'Arriving Soon', 'Delivered'].map((label, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-center mb-3">
                      <span className="text-gray-300 font-black text-base">{i + 1}</span>
                    </div>
                    <p className="text-gray-400 text-xs font-semibold leading-snug">{label}</p>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-gray-200 text-xs mt-10">Timeline activates once tracking begins</p>
          </div>
        </section>

        {/* DRIVER PLACEHOLDER */}
        <section className="py-16 border-t border-[#EEF2F7] bg-[#F7FAFC]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                <User className="w-6 h-6 text-gray-300" />
              </div>
              <h3 className="text-[#0B2239] font-black text-base mb-2">Driver information</h3>
              <p className="text-gray-400 text-sm max-w-sm">Name, vehicle details, and estimated arrival will appear here once a driver is assigned to your booking.</p>
            </div>
          </div>
        </section>

        {/* SUPPORT */}
        <section className="py-10 bg-white border-t border-[#EEF2F7]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="flex items-center gap-3">
              <Headphones className="w-5 h-5 text-[#0E2A47]" />
              <span className="text-[#0B2239] font-semibold text-sm">Need help locating your delivery?</span>
            </div>
            <a
              href={`https://wa.me/${BRAND.whatsapp.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-[#0E2A47] text-[#0E2A47] hover:bg-[#0E2A47] hover:text-white rounded-xl px-6 py-2.5 font-bold text-sm transition-all"
            >
              Contact Dispatch Support
            </a>
          </div>
        </section>
      </>
    );
  }

  /* ── ACTIVE TRACKING STATE ───────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-gray-50 pt-[88px] pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Page header */}
        <div className="flex items-center justify-between py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => { setBooking(null); setTrackingId(''); }}
              className="w-9 h-9 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-gray-600 hover:text-[#0E2A47] hover:border-[#0E2A47]/30 transition-all shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-gray-900">Live Tracking</h1>
                {status === 'in_progress' && (
                  <span className="flex items-center gap-1 bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />LIVE
                  </span>
                )}
                {status === 'completed' && (
                  <span className="flex items-center gap-1 bg-[#F5B400]/15 text-[#8A6E00] text-xs font-bold px-2.5 py-1 rounded-full">
                    <CheckCircle className="w-3 h-3" />DELIVERED
                  </span>
                )}
              </div>
              <p className="text-gray-400 text-xs mt-0.5 font-mono truncate max-w-[200px]">{booking.id}</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            <span className="capitalize">{status.replace('_', ' ')}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Map + Route */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="relative h-80">
                <img src={FEATURE_IMAGES.tracking} alt="Tracking map" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                {status === 'in_progress' && (
                  <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="relative">
                      <div className="absolute inset-0 bg-[#0E2A47] rounded-full animate-ping opacity-30 scale-150" />
                      <div className="relative w-12 h-12 bg-[#0E2A47] rounded-full flex items-center justify-center shadow-xl border-2 border-white">
                        <Truck className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </div>
                )}
                <div className="absolute bottom-1/3 right-1/3">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                    <MapPin className="w-4 h-4 text-white" />
                  </div>
                </div>
                {status === 'in_progress' && (
                  <div className="absolute bottom-4 left-4 bg-white rounded-2xl shadow-xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#F5B400] rounded-xl flex items-center justify-center">
                        <Clock className="w-5 h-5 text-[#071A2F]" />
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs">ETA</p>
                        <p className="text-xl font-black text-[#0E2A47]">In transit</p>
                      </div>
                    </div>
                  </div>
                )}
                {status === 'completed' && (
                  <div className="absolute bottom-4 left-4 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                    <div>
                      <p className="font-black text-gray-900 text-sm">Delivered</p>
                      <p className="text-gray-400 text-xs">Job complete</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Progress bar */}
              <div className="px-5 py-4">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-2.5">
                  <span className="flex items-center gap-1 font-semibold"><span className="w-2 h-2 bg-green-500 rounded-full" />Pickup</span>
                  <span className="font-bold text-[#0E2A47]">{pct}% complete</span>
                  <span className="flex items-center gap-1 font-semibold"><span className="w-2 h-2 bg-red-500 rounded-full" />Delivery</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#0E2A47] to-[#F5B400] rounded-full transition-all duration-700 relative" style={{ width: `${pct}%` }}>
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#F5B400] rounded-full border-2 border-white shadow-md" />
                  </div>
                </div>
              </div>
            </div>

            {/* Route details — real addresses */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="text-xs font-black text-gray-400 tracking-widest uppercase mb-4">Route Details</h3>
              <div className="flex items-start gap-3">
                <div className="flex flex-col items-center shrink-0 mt-1">
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  <div className="w-0.5 h-10 bg-gradient-to-b from-green-300 to-red-300 my-1" />
                  <div className="w-3 h-3 bg-red-500 rounded-full" />
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <p className="text-xs text-gray-400 font-medium mb-0.5">Collection</p>
                    <p className="text-sm font-bold text-gray-800">{booking.collection_address}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium mb-0.5">Delivery</p>
                    <p className="text-sm font-bold text-gray-800">{booking.delivery_address}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs text-gray-400 mb-1"><Package className="w-3.5 h-3.5 inline mr-1" />Vehicle</p>
                  <p className="text-sm font-semibold text-gray-700 capitalize">{booking.vehicle_type?.replace('_', ' ')}</p>
                  {(booking.helpers ?? 0) > 0 && (
                    <p className="text-xs text-gray-400 mt-0.5">{booking.helpers} helper{booking.helpers !== 1 ? 's' : ''}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">

            {/* Driver card — real data or awaiting */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-[#071A2F] to-[#0E2A47] px-5 py-4">
                <p className="text-white/40 text-xs font-black tracking-widest uppercase mb-0.5">Your Driver</p>
                <div className="flex items-center gap-1">
                  {driver ? (
                    <><span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" /><p className="text-green-400 text-xs font-semibold">Assigned</p></>
                  ) : (
                    <><span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" /><p className="text-amber-300 text-xs font-semibold">Awaiting assignment</p></>
                  )}
                </div>
              </div>
              <div className="p-5">
                {driver ? (
                  <>
                    <div className="flex items-center gap-4 mb-5">
                      <div className="w-14 h-14 bg-[#0E2A47]/8 rounded-2xl flex items-center justify-center">
                        <User className="w-7 h-7 text-[#0E2A47]" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-black text-gray-900">{driver.first_name} {driver.last_name}</h3>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <Star className="w-3 h-3 text-[#F5B400] fill-[#F5B400]" />
                          <span className="text-gray-700 font-bold text-xs">{driver.rating?.toFixed(1) ?? '—'}</span>
                          <span className="text-gray-400 text-xs">({driver.total_jobs ?? 0} trips)</span>
                        </div>
                        <p className="text-gray-400 text-xs mt-0.5 capitalize">{driver.vehicle_make} {driver.vehicle_model}</p>
                      </div>
                    </div>

                    {driver.vehicle_reg && (
                      <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 mb-4 flex items-center justify-between">
                        <span className="text-gray-400 text-xs font-medium">Plate number</span>
                        <span className="font-black text-gray-800 text-sm font-mono tracking-widest">{driver.vehicle_reg}</span>
                      </div>
                    )}

                    <div className="flex gap-2.5">
                      {driver.phone && (
                        <a href={`tel:${driver.phone}`}
                          className="flex-1 flex items-center justify-center gap-2 bg-[#0E2A47] hover:bg-[#0F3558] text-white py-3 rounded-2xl text-sm font-bold transition-colors">
                          <Phone className="w-4 h-4" />Call
                        </a>
                      )}
                      <a href={`https://wa.me/${BRAND.whatsapp.replace(/[^0-9]/g, '')}`}
                        target="_blank" rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 bg-[#0E2A47]/10 hover:bg-[#0E2A47]/20 text-[#0E2A47] py-3 rounded-2xl text-sm font-bold transition-colors">
                        <MessageCircle className="w-4 h-4" />Support
                      </a>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <Truck className="w-6 h-6 text-amber-400" />
                    </div>
                    <p className="text-gray-700 font-semibold text-sm mb-1">Matching your driver</p>
                    <p className="text-gray-400 text-xs">A verified driver will be assigned to your booking shortly. You'll receive a confirmation when matched.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
              <h3 className="text-xs font-black text-gray-400 tracking-widest uppercase mb-5">Delivery Progress</h3>
              <div className="space-y-0">
                {TIMELINE_LABELS.map((label, idx) => {
                  const stepNum   = idx + 1;
                  const completed = stepNum < done;
                  const active    = stepNum === done;
                  return (
                    <div key={idx} className="flex items-start gap-3.5">
                      <div className="flex flex-col items-center shrink-0">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all ${
                          completed ? 'bg-green-500 border-green-500' : active ? 'bg-[#0E2A47] border-[#0E2A47]' : 'bg-white border-gray-200'
                        }`}>
                          {completed ? <CheckCircle className="w-4 h-4 text-white" /> : active ? <div className="w-2 h-2 bg-white rounded-full animate-pulse" /> : <div className="w-2 h-2 bg-gray-300 rounded-full" />}
                        </div>
                        {idx < TIMELINE_LABELS.length - 1 && (
                          <div className={`w-0.5 h-8 my-0.5 rounded-full ${completed ? 'bg-green-200' : 'bg-gray-100'}`} />
                        )}
                      </div>
                      <div className="flex-1 pt-0.5 pb-2">
                        <p className={`text-sm font-bold leading-tight ${active ? 'text-[#0E2A47]' : completed ? 'text-gray-700' : 'text-gray-300'}`}>{label}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Support */}
            <div className="bg-[#0E2A47] rounded-2xl p-5 text-center">
              <Headphones className="w-6 h-6 text-[#F5B400] mx-auto mb-2" />
              <p className="text-white font-semibold text-sm mb-3">Need help with this delivery?</p>
              <a href={`https://wa.me/${BRAND.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank" rel="noopener noreferrer"
                className="w-full block bg-[#F5B400] hover:bg-[#E5A000] text-[#071A2F] py-2.5 rounded-xl font-black text-sm transition-all">
                WhatsApp Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackingView;
