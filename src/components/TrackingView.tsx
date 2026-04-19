import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Phone, MessageCircle, Star, Truck, Navigation, CheckCircle, Package, ArrowLeft, Shield, ChevronRight } from 'lucide-react';
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
      <div className="min-h-screen bg-[#071A2F] flex items-center justify-center px-4 pt-24 pb-16">
        <div className="w-full max-w-lg">
          {/* Card */}
          <div className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-white/5 backdrop-blur-sm" />
            <div className="absolute inset-0 border border-white/10 rounded-3xl pointer-events-none" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#F5B400]/6 rounded-full blur-3xl pointer-events-none" />

            <div className="relative p-8 sm:p-12 text-center">
              <div className="w-20 h-20 bg-[#F5B400]/15 border border-[#F5B400]/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Navigation className="w-10 h-10 text-[#F5B400]" />
              </div>
              <h1 className="text-3xl font-black text-white mb-3">Track Your Delivery</h1>
              <p className="text-white/45 mb-8 leading-relaxed">Enter your booking reference to see your driver on the map in real-time.</p>

              <div className="flex gap-2.5 mb-5">
                <input
                  type="text"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  placeholder="e.g. FMV-2026-001"
                  className="flex-1 px-4 py-3.5 bg-white/8 border border-white/12 rounded-2xl text-white placeholder:text-white/30 focus:outline-none focus:border-[#F5B400]/50 text-sm transition-colors"
                />
                <button
                  onClick={startTracking}
                  className="bg-[#F5B400] hover:bg-[#E5A000] text-[#071A2F] px-6 py-3.5 rounded-2xl font-black text-sm transition-all hover:shadow-lg hover:shadow-[#F5B400]/30 whitespace-nowrap"
                >
                  Track
                </button>
              </div>

              <button onClick={startTracking} className="text-white/35 hover:text-[#F5B400] text-sm font-medium transition-colors">
                View live demo →
              </button>

              <div className="flex items-center justify-center gap-4 mt-8 pt-8 border-t border-white/8">
                {[
                  { icon: Shield, label: 'Insured' },
                  { icon: Star, label: '4.9 Rated' },
                  { icon: Truck, label: 'GPS Tracked' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-white/30 text-xs">
                    <item.icon className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
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
