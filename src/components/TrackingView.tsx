import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Phone, MessageCircle, Star, Truck, Navigation, CheckCircle, Package, ArrowLeft, Shield, ChevronRight, Headphones, User } from 'lucide-react';
import { DRIVER_IMAGES, FEATURE_IMAGES } from '@/lib/constants';

interface TrackingViewProps {
  onNavigate: (page: string) => void;
}

const TrackingView: React.FC<TrackingViewProps> = ({ onNavigate }) => {
  const [trackingId, setTrackingId] = useState('');
  const [isTracking, setIsTracking] = useState(false);
  const [progress, setProgress] = useState(35);
  const [eta, setEta] = useState(22);

  useEffect(() => {
    if (!isTracking) return;
    const interval = setInterval(() => {
      setProgress(prev => Math.min(prev + 1, 95));
      setEta(prev => Math.max(prev - 1, 1));
    }, 3000);
    return () => clearInterval(interval);
  }, [isTracking]);

  const startTracking = () => setIsTracking(true);

  const driverInfo = {
    name: 'Marcus Johnson',
    rating: 4.9,
    trips: 847,
    vehicle: 'Ford Transit – White',
    plate: 'AB21 XYZ',
    phone: '+44 7700 900123',
    tier: 'gold',
    image: DRIVER_IMAGES[0],
  };

  const timeline = [
    { status: 'completed', label: 'Booking Confirmed', time: '14:30', desc: 'Your booking is confirmed' },
    { status: 'completed', label: 'Driver Assigned', time: '14:32', desc: 'Marcus accepted your job' },
    { status: 'completed', label: 'Driver En Route', time: '14:35', desc: 'Heading to your pickup' },
    { status: 'active', label: 'At Pickup Location', time: '14:52', desc: 'Driver is at your door' },
    { status: 'pending', label: 'Loading Goods', time: '–', desc: 'Items being loaded' },
    { status: 'pending', label: 'In Transit', time: '–', desc: 'On the way to delivery' },
    { status: 'pending', label: 'Delivered', time: '–', desc: 'Job complete' },
  ];

  if (!isTracking) {
    return (
      <>
        {/* ── SECTION 1 — TRACKING HERO ────────────────────────────────────── */}
        <section className="relative pt-[88px] py-14 overflow-hidden">
          {/* City routes photo background */}
          <img
            src={FEATURE_IMAGES.cityRoutes}
            alt=""
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          {/* Teal-navy overlay — visually distinct from pure #071A2F header */}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(4,40,72,0.94) 0%, rgba(10,70,100,0.90) 100%)' }} />
          {/* Bottom fade to white */}
          <div className="absolute bottom-0 left-0 right-0" style={{ height: '60px', background: 'linear-gradient(to bottom, transparent, #ffffff)' }} />

          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="text-[#F5B400] text-xs font-bold tracking-[0.2em] uppercase mb-4 block">
              Live Tracking
            </span>
            <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-5">
              Track your delivery in real time
            </h1>
            <p className="text-white/50 text-base leading-relaxed mb-8 max-w-xl mx-auto">
              Live GPS updates from pickup to arrival. Enter your booking reference below.
            </p>

            {/* Badge pills */}
            <div className="flex flex-wrap gap-3 justify-center">
              {['GPS Tracked', 'Fully Insured', 'Verified Drivers'].map((label) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-2 bg-white/8 border border-white/10 text-white/70 text-xs font-semibold px-4 py-2 rounded-full"
                >
                  <Shield className="w-3.5 h-3.5 text-[#F5B400]" />
                  {label}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── SECTION 2 — TRACKING INPUT STRIP ────────────────────────────── */}
        <section className="py-12 bg-white border-t border-[#EEF2F7]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <label className="block text-[#0E2A47] text-xs font-bold tracking-[0.18em] uppercase mb-4">
              Enter your booking reference
            </label>

            {/* Input row */}
            <div className="flex gap-3">
              <input
                type="text"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                placeholder="e.g. FMV-2026-001234"
                className="flex-1 border border-gray-200 rounded-xl px-5 py-4 text-[#0B2239] placeholder:text-gray-400 text-sm focus:outline-none focus:border-[#0E2A47] transition-colors"
              />
              <button
                onClick={startTracking}
                className="bg-[#F5B400] hover:bg-[#FFD24A] text-[#0B2239] font-black rounded-xl px-8 py-4 text-sm transition-all hover:shadow-lg hover:shadow-[#F5B400]/25 whitespace-nowrap"
              >
                Track Delivery
              </button>
            </div>

            {/* Or divider + demo link */}
            <div className="flex items-center gap-3 mt-5">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-gray-400 text-xs font-medium">or</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>
            <div className="text-center mt-3">
              <button
                onClick={startTracking}
                className="text-[#0E2A47] hover:text-[#F5B400] text-sm font-semibold transition-colors"
              >
                View live demo →
              </button>
            </div>
          </div>
        </section>

        {/* ── SECTION 3 — MAP PREVIEW PANEL ───────────────────────────────── */}
        <section className="py-10 border-t border-[#EEF2F7]" style={{ background: '#F3F7FB' }}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative rounded-2xl overflow-hidden h-80">
              {/* Background map image */}
              <img
                src={FEATURE_IMAGES.cityRoutes}
                alt="Map preview"
                className="absolute inset-0 w-full h-full object-cover opacity-35"
              />
              {/* Dark overlay */}
              <div className="absolute inset-0 bg-[#071A2F]/60" />

              {/* Centered overlay content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
                <Navigation className="w-12 h-12 text-[#F5B400]/50 mb-4" />
                <p className="text-white/70 font-semibold text-sm mb-2">
                  Driver location will appear here once tracking begins
                </p>
                <p className="text-white/35 text-xs max-w-xs leading-relaxed">
                  Enter your booking reference above to start live tracking
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 4 — DELIVERY TIMELINE ───────────────────────────────── */}
        <section className="py-16 bg-white border-t border-[#EEF2F7]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Header */}
            <div className="text-center mb-12">
              <span className="text-[#0E2A47] text-xs font-bold tracking-[0.2em] uppercase mb-3 block">
                Delivery Progress
              </span>
              <h2 className="text-2xl font-black text-[#0B2239]">
                Track every stage of your delivery
              </h2>
            </div>

            {/* 5-step inactive horizontal timeline */}
            <div className="relative">
              {/* Connecting line */}
              <div className="absolute top-[28px] left-[calc(10%+20px)] right-[calc(10%+20px)] h-0.5 bg-gray-200 hidden sm:block" />

              <div className="grid grid-cols-3 sm:grid-cols-5 gap-6">
                {[
                  'Booking Confirmed',
                  'Driver Assigned',
                  'Driver En Route',
                  'Arriving Soon',
                  'Delivered',
                ].map((label, i) => (
                  <div key={i} className="flex flex-col items-center text-center relative">
                    <div className="relative mb-4">
                      <div className="w-14 h-14 rounded-2xl bg-gray-100 border border-gray-200 flex items-center justify-center">
                        <span className="text-gray-400 font-black text-base">{i + 1}</span>
                      </div>
                    </div>
                    <p className="text-gray-400 text-xs font-semibold leading-snug">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-center text-gray-300 text-xs mt-10">
              Timeline activates once tracking begins
            </p>
          </div>
        </section>

        {/* ── SECTION 5 — DRIVER INFO PLACEHOLDER ─────────────────────────── */}
        <section className="py-16 border-t border-[#EEF2F7]" style={{ background: '#F7FAFC' }}>
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm"
              style={{ boxShadow: '0px 4px 20px rgba(0,0,0,0.05)' }}
            >
              {/* Icon */}
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                  <User className="w-6 h-6 text-gray-400" />
                </div>
                <h3 className="text-[#0B2239] font-black text-base mb-2">Driver information</h3>
                <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
                  Driver name, vehicle details, and estimated arrival time will appear here once tracking begins.
                </p>
              </div>

              {/* Placeholder detail rows */}
              <div className="space-y-3 mt-4">
                <div className="flex items-center justify-between py-3 border-t border-gray-100">
                  <div className="h-3 w-24 bg-gray-100 rounded-full" />
                  <div className="h-3 w-32 bg-gray-100 rounded-full" />
                </div>
                <div className="flex items-center justify-between py-3 border-t border-gray-100">
                  <div className="h-3 w-20 bg-gray-100 rounded-full" />
                  <div className="h-3 w-28 bg-gray-100 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 6 — SUPPORT STRIP ────────────────────────────────────── */}
        <section className="py-10 bg-white border-t border-[#EEF2F7]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="flex items-center gap-3">
                <Headphones className="w-5 h-5 text-[#0E2A47]" />
                <span className="text-[#0B2239] font-semibold text-sm">Need help locating your delivery?</span>
              </div>
              <button className="border border-[#0E2A47] text-[#0E2A47] hover:bg-[#0E2A47] hover:text-white rounded-xl px-6 py-2.5 font-bold text-sm transition-all">
                Contact Dispatch Support
              </button>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Page header */}
        <div className="flex items-center justify-between py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('home')}
              className="w-9 h-9 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-gray-600 hover:text-[#0E2A47] hover:border-[#0E2A47]/30 transition-all shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-gray-900">Live Tracking</h1>
                <span className="flex items-center gap-1 bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  LIVE
                </span>
              </div>
              <p className="text-gray-400 text-xs mt-0.5 font-mono">FMV-2026-001</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            <span>Updated just now</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Map Area */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="relative h-96">
                <img src={FEATURE_IMAGES.tracking} alt="Tracking map" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                {/* Driver marker */}
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="relative">
                    <div className="absolute inset-0 bg-[#0E2A47] rounded-full animate-ping opacity-30 scale-150" />
                    <div className="relative w-12 h-12 bg-[#0E2A47] rounded-full flex items-center justify-center shadow-xl border-3 border-white">
                      <Truck className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>

                {/* Destination pin */}
                <div className="absolute bottom-1/3 right-1/3">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                    <MapPin className="w-4 h-4 text-white" />
                  </div>
                </div>

                {/* ETA card */}
                <div className="absolute bottom-4 left-4 bg-white rounded-2xl shadow-xl border border-gray-100 p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 bg-[#F5B400] rounded-xl flex items-center justify-center shadow-md">
                      <Clock className="w-5 h-5 text-[#071A2F]" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs font-medium">Estimated Arrival</p>
                      <p className="text-2xl font-black text-[#0E2A47]">{eta} min</p>
                    </div>
                  </div>
                </div>

                {/* Distance badge */}
                <div className="absolute bottom-4 right-4 bg-[#071A2F]/85 backdrop-blur-sm rounded-xl px-3.5 py-2 border border-white/10">
                  <p className="text-white/50 text-[10px] uppercase tracking-wider">Distance left</p>
                  <p className="text-white font-black text-sm">{Math.round((100 - progress) * 0.42)} mi</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="px-5 py-4">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-2.5">
                  <span className="flex items-center gap-1 font-semibold"><span className="w-2 h-2 bg-green-500 rounded-full" />Pickup</span>
                  <span className="font-bold text-[#0E2A47]">{progress}% complete</span>
                  <span className="flex items-center gap-1 font-semibold"><span className="w-2 h-2 bg-red-500 rounded-full" />Delivery</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#0E2A47] to-[#0F3558] rounded-full transition-all duration-1000 relative"
                    style={{ width: `${progress}%` }}
                  >
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#F5B400] rounded-full border-2 border-white shadow-md" />
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery route summary */}
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
                    <p className="text-xs text-gray-400 font-medium mb-0.5">Pickup</p>
                    <p className="text-sm font-bold text-gray-800">15 Baker Street, London W1U</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium mb-0.5">Delivery</p>
                    <p className="text-sm font-bold text-gray-800">42 Oxford Road, Manchester M1</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs text-gray-400 mb-1">
                    <Package className="w-3.5 h-3.5 inline mr-1" />Cargo
                  </p>
                  <p className="text-sm font-semibold text-gray-700">Furniture & boxes</p>
                  <p className="text-xs text-gray-400 mt-0.5">1 helper</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">

            {/* Driver Card */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-[#071A2F] to-[#0E2A47] px-5 py-4">
                <p className="text-white/40 text-xs font-black tracking-widest uppercase mb-0.5">Your Driver</p>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                  <p className="text-green-400 text-xs font-semibold">On the way</p>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-4 mb-5">
                  <div className="relative">
                    <img src={driverInfo.image} alt={driverInfo.name} className="w-14 h-14 rounded-2xl object-cover" />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#F5B400] rounded-full flex items-center justify-center border-2 border-white">
                      <Star className="w-2.5 h-2.5 text-[#071A2F] fill-[#071A2F]" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-black text-gray-900">{driverInfo.name}</h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => <Star key={i} className="w-2.5 h-2.5 text-[#F5B400] fill-[#F5B400]" />)}
                      </div>
                      <span className="text-gray-700 font-bold text-xs">{driverInfo.rating}</span>
                      <span className="text-gray-400 text-xs">({driverInfo.trips} trips)</span>
                    </div>
                    <p className="text-gray-400 text-xs mt-0.5">{driverInfo.vehicle}</p>
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 mb-4 flex items-center justify-between">
                  <span className="text-gray-400 text-xs font-medium">Plate number</span>
                  <span className="font-black text-gray-800 text-sm font-mono tracking-widest">{driverInfo.plate}</span>
                </div>

                <div className="flex gap-2.5">
                  <a
                    href={`tel:${driverInfo.phone}`}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#0E2A47] hover:bg-[#0F3558] text-white py-3 rounded-2xl text-sm font-bold transition-colors"
                  >
                    <Phone className="w-4 h-4" /> Call
                  </a>
                  <a
                    href={`https://wa.me/${driverInfo.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-3 rounded-2xl text-sm font-bold transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" /> WhatsApp
                  </a>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
              <h3 className="text-xs font-black text-gray-400 tracking-widest uppercase mb-5">Delivery Progress</h3>
              <div className="space-y-0">
                {timeline.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3.5">
                    <div className="flex flex-col items-center shrink-0">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all ${
                        item.status === 'completed'
                          ? 'bg-green-500 border-green-500'
                          : item.status === 'active'
                          ? 'bg-[#0E2A47] border-[#0E2A47]'
                          : 'bg-white border-gray-200'
                      }`}>
                        {item.status === 'completed' ? (
                          <CheckCircle className="w-4 h-4 text-white" />
                        ) : item.status === 'active' ? (
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                        ) : (
                          <div className="w-2 h-2 bg-gray-300 rounded-full" />
                        )}
                      </div>
                      {idx < timeline.length - 1 && (
                        <div className={`w-0.5 h-8 my-0.5 rounded-full ${item.status === 'completed' ? 'bg-green-200' : 'bg-gray-100'}`} />
                      )}
                    </div>
                    <div className="flex-1 pt-0.5 pb-2">
                      <div className="flex items-center justify-between gap-2">
                        <p className={`text-sm font-bold leading-tight ${
                          item.status === 'active' ? 'text-[#0E2A47]' : item.status === 'completed' ? 'text-gray-700' : 'text-gray-300'
                        }`}>
                          {item.label}
                        </p>
                        <span className={`text-xs font-mono shrink-0 ${item.status !== 'pending' ? 'text-gray-400' : 'text-gray-200'}`}>
                          {item.time}
                        </span>
                      </div>
                      {item.status === 'active' && (
                        <p className="text-xs text-[#0E2A47]/60 mt-0.5">{item.desc}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackingView;
