import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Phone, MessageCircle, Star, Truck, Navigation, CheckCircle, Package } from 'lucide-react';
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

  const startTracking = () => {
    if (trackingId || true) {
      setIsTracking(true);
    }
  };

  const driverInfo = {
    name: 'Marcus Johnson',
    rating: 4.9,
    vehicle: 'Ford Transit - White',
    plate: 'AB21 XYZ',
    phone: '+44 7700 900123',
    tier: 'gold',
    image: DRIVER_IMAGES[0],
  };

  const timeline = [
    { status: 'completed', label: 'Booking Confirmed', time: '14:30' },
    { status: 'completed', label: 'Driver Assigned', time: '14:32' },
    { status: 'completed', label: 'Driver En Route to Pickup', time: '14:35' },
    { status: 'active', label: 'At Pickup Location', time: '14:52' },
    { status: 'pending', label: 'Loading Goods', time: '--:--' },
    { status: 'pending', label: 'In Transit', time: '--:--' },
    { status: 'pending', label: 'Delivered', time: '--:--' },
  ];

  if (!isTracking) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-16">
        <div className="max-w-xl mx-auto px-4 text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-12 border border-gray-100">
            <div className="w-20 h-20 bg-[#0A2463]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Navigation className="w-10 h-10 text-[#0A2463]" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">Track Your Delivery</h1>
            <p className="text-gray-600 mb-8">Enter your booking reference to track your driver in real-time.</p>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                placeholder="Enter booking reference (e.g. FMV-2026-001)"
                className="flex-1 px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-[#0A2463] outline-none text-gray-800"
              />
              <button onClick={startTracking} className="bg-[#0A2463] hover:bg-[#1B3A8C] text-white px-6 py-3.5 rounded-xl font-semibold transition-colors whitespace-nowrap">
                Track
              </button>
            </div>
            <button onClick={startTracking} className="text-[#0A2463] text-sm font-medium hover:underline">
              View demo tracking
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Live Tracking</h1>
            <p className="text-gray-500 text-sm">Booking: FMV-2026-001</p>
          </div>
          <button onClick={() => onNavigate('home')} className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Back to Home
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Area */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="relative h-96 bg-gray-200">
                <img src={FEATURE_IMAGES.tracking} alt="Tracking map" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                {/* Driver marker */}
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2">
                  <div className="relative">
                    <div className="w-12 h-12 bg-[#0A2463] rounded-full flex items-center justify-center shadow-lg border-3 border-white animate-pulse">
                      <Truck className="w-6 h-6 text-white" />
                    </div>
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#0A2463] rotate-45" />
                  </div>
                </div>
                {/* ETA overlay */}
                <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#D4AF37] rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-[#0A2463]" />
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Estimated Arrival</p>
                      <p className="text-2xl font-bold text-[#0A2463]">{eta} min</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="p-4">
                <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                  <span>Pickup</span>
                  <span>{progress}% complete</span>
                  <span>Delivery</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-[#0A2463] h-2 rounded-full transition-all duration-1000" style={{ width: `${progress}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Driver Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center gap-4 mb-4">
                <img src={driverInfo.image} alt={driverInfo.name} className="w-14 h-14 rounded-full object-cover" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-gray-900">{driverInfo.name}</h3>
                    {driverInfo.tier === 'gold' && <Star className="w-4 h-4 text-[#D4AF37] fill-[#D4AF37]" />}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Star className="w-3 h-3 text-[#D4AF37] fill-[#D4AF37]" />
                    <span>{driverInfo.rating}</span>
                    <span className="text-gray-300">|</span>
                    <span>{driverInfo.vehicle}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{driverInfo.plate}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <a href={`tel:${driverInfo.phone}`} className="flex-1 flex items-center justify-center gap-2 bg-[#0A2463] hover:bg-[#1B3A8C] text-white py-2.5 rounded-lg text-sm font-semibold transition-colors">
                  <Phone className="w-4 h-4" /> Call
                </a>
                <a href={`https://wa.me/${driverInfo.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-2.5 rounded-lg text-sm font-semibold transition-colors">
                  <MessageCircle className="w-4 h-4" /> Chat
                </a>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h3 className="font-bold text-gray-900 mb-4">Delivery Progress</h3>
              <div className="space-y-4">
                {timeline.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        item.status === 'completed' ? 'bg-green-500' : item.status === 'active' ? 'bg-[#0A2463] animate-pulse' : 'bg-gray-200'
                      }`}>
                        {item.status === 'completed' ? (
                          <CheckCircle className="w-4 h-4 text-white" />
                        ) : item.status === 'active' ? (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        ) : (
                          <div className="w-2 h-2 bg-gray-400 rounded-full" />
                        )}
                      </div>
                      {idx < timeline.length - 1 && (
                        <div className={`w-0.5 h-6 ${item.status === 'completed' ? 'bg-green-300' : 'bg-gray-200'}`} />
                      )}
                    </div>
                    <div className="flex-1 -mt-0.5">
                      <p className={`text-sm font-medium ${item.status === 'active' ? 'text-[#0A2463]' : item.status === 'completed' ? 'text-gray-700' : 'text-gray-400'}`}>
                        {item.label}
                      </p>
                      <p className="text-xs text-gray-400">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Details */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h3 className="font-bold text-gray-900 mb-3">Delivery Details</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full mt-1.5" />
                  <div>
                    <p className="text-xs text-gray-400">Pickup</p>
                    <p className="text-sm font-medium text-gray-800">15 Baker Street, London W1U</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full mt-1.5" />
                  <div>
                    <p className="text-xs text-gray-400">Delivery</p>
                    <p className="text-sm font-medium text-gray-800">42 Oxford Road, Manchester M1</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                  <Package className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Furniture & boxes (1 helper)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackingView;
