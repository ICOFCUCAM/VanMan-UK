import React, { useState, useEffect } from 'react';
import { MapPin, Plus, X, Truck, ArrowRight, CheckCircle2, AlertTriangle, Building2, Loader2, CreditCard, Calendar, Repeat, Shield, Clock, Star } from 'lucide-react';
import { PRICING, VEHICLE_TYPES } from '@/lib/constants';
import { geocodeUK } from '@/lib/geocoding';
import { getRoute } from '@/lib/routing';
import { useAppContext } from '@/contexts/AppContext';
import { createBooking } from '@/services/bookings';
import type { PaymentMethod, QuoteData } from '@/types';

interface BookingWidgetProps {
  bookingRef: React.RefObject<HTMLDivElement | null>;
  onNavigate?: (page: string) => void;
}

const BookingWidget: React.FC<BookingWidgetProps> = ({ bookingRef, onNavigate }) => {
  const { user } = useAppContext();
  const [collectionAddress, setCollectionAddress] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [hasStairs, setHasStairs] = useState(false);
  const [addStops, setAddStops] = useState(false);
  const [stopAddresses, setStopAddresses] = useState<string[]>(['']);
  const [selectedVehicle, setSelectedVehicle] = useState('medium');
  const [helpers, setHelpers] = useState(0);
  const [deliveryType, setDeliveryType] = useState<'dedicated' | 'shared'>('dedicated');
  const [showQuote, setShowQuote] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [quoteData, setQuoteData] = useState<QuoteData | null>(null);
  const [geocodeError, setGeocodeError] = useState<string | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [scheduleForLater, setScheduleForLater] = useState(false);
  const [scheduledAt, setScheduledAt] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringFrequency, setRecurringFrequency] = useState<'weekly' | 'biweekly' | 'monthly'>('weekly');

  const addStop = () => setStopAddresses([...stopAddresses, '']);
  const removeStop = (idx: number) => setStopAddresses(stopAddresses.filter((_, i) => i !== idx));
  const updateStop = (idx: number, val: string) => {
    const updated = [...stopAddresses];
    updated[idx] = val;
    setStopAddresses(updated);
  };

  const calculateQuote = async () => {
    if (!collectionAddress || !deliveryAddress) return;
    setIsCalculating(true);
    setBookingConfirmed(false);
    setBookingError(null);
    setGeocodeError(null);

    const [fromCoords, toCoords] = await Promise.all([
      geocodeUK(collectionAddress),
      geocodeUK(deliveryAddress),
    ]);

    if (!fromCoords || !toCoords) {
      setGeocodeError('Could not find one or both addresses. Please check and try again.');
      setIsCalculating(false);
      return;
    }

    const vehicle = VEHICLE_TYPES.find(v => v.id === selectedVehicle)!;
    const route = await getRoute(fromCoords, toCoords);
    const stopCount = addStops ? stopAddresses.filter(s => s).length : 0;
    const totalMiles = Math.max(1, Math.round((route.distanceMiles + stopCount * 8) * 10) / 10);
    const travelTimeMin = route.durationMinutes + stopCount * 10;
    const hours = Math.max(2, Math.ceil(travelTimeMin / 60));

    let price = Math.max(PRICING.minimumJobCost, vehicle.basePrice + totalMiles * 1.2);
    if (hours > 2) price += (hours - 2) * PRICING.additionalTimeCharge;
    if (hasStairs) price += 20;
    if (helpers > 0) price += helpers * 25;
    if (deliveryType === 'shared') price *= 0.7;

    const hour = new Date().getHours();
    const surgeMultiplier = (hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19) ? 1.3 : 1.0;
    price *= surgeMultiplier;

    setQuoteData({
      distance: totalMiles,
      duration: `${Math.floor(travelTimeMin / 60)}h ${travelTimeMin % 60}m`,
      basePrice: Math.round(price),
      surgeMultiplier,
      vehicle: vehicle.name,
      vehicleId: selectedVehicle,
      isSurge: surgeMultiplier > 1,
    });
    setShowQuote(true);
    setIsCalculating(false);
  };

  const confirmBooking = async (paymentMethod: PaymentMethod) => {
    if (!quoteData) return;
    setIsBooking(true);
    setBookingError(null);

    const { data, error } = await createBooking({
      collection_address: collectionAddress,
      delivery_address: deliveryAddress,
      stop_addresses: addStops ? stopAddresses.filter(s => s.trim()) : [],
      has_stairs: hasStairs,
      vehicle_type: quoteData.vehicleId,
      delivery_type: deliveryType,
      helpers,
      distance_miles: quoteData.distance,
      duration: quoteData.duration,
      estimated_price: quoteData.basePrice,
      surge_multiplier: quoteData.surgeMultiplier,
      payment_method: paymentMethod,
      customer_id: user?.id,
      scheduled_at: scheduleForLater && scheduledAt ? new Date(scheduledAt).toISOString() : undefined,
      is_recurring: isRecurring,
      recurring_frequency: isRecurring ? recurringFrequency : null,
    });

    if (error) {
      setBookingError(error.message || 'Failed to save booking. Please try again.');
    } else if (data) {
      setBookingId(data.id);
      setBookingConfirmed(true);
    }

    setIsBooking(false);
  };

  const handleCardPayment = async () => {
    if (!quoteData) return;
    setIsRedirecting(true);
    setBookingError(null);

    const { data, error } = await createBooking({
      collection_address: collectionAddress,
      delivery_address: deliveryAddress,
      stop_addresses: addStops ? stopAddresses.filter(s => s.trim()) : [],
      has_stairs: hasStairs,
      vehicle_type: quoteData.vehicleId,
      delivery_type: deliveryType,
      helpers,
      distance_miles: quoteData.distance,
      duration: quoteData.duration,
      estimated_price: quoteData.basePrice,
      surge_multiplier: quoteData.surgeMultiplier,
      payment_method: 'card',
      customer_id: user?.id,
      scheduled_at: scheduleForLater && scheduledAt ? new Date(scheduledAt).toISOString() : undefined,
      is_recurring: isRecurring,
      recurring_frequency: isRecurring ? recurringFrequency : null,
    });

    if (error || !data) {
      setBookingError(error?.message ?? 'Failed to create booking. Please try again.');
      setIsRedirecting(false);
      return;
    }

    sessionStorage.setItem('pending_payment_booking_id', data.id);
    setIsRedirecting(false);
    if (onNavigate) onNavigate('payment');
  };

  const handleCashPayment = async () => {
    if (!quoteData) return;
    setIsBooking(true);
    setBookingError(null);

    const { data, error } = await createBooking({
      collection_address: collectionAddress,
      delivery_address: deliveryAddress,
      stop_addresses: addStops ? stopAddresses.filter(s => s.trim()) : [],
      has_stairs: hasStairs,
      vehicle_type: quoteData.vehicleId,
      delivery_type: deliveryType,
      helpers,
      distance_miles: quoteData.distance,
      duration: quoteData.duration,
      estimated_price: quoteData.basePrice,
      surge_multiplier: quoteData.surgeMultiplier,
      payment_method: 'cash',
      customer_id: user?.id,
      scheduled_at: scheduleForLater && scheduledAt ? new Date(scheduledAt).toISOString() : undefined,
      is_recurring: isRecurring,
      recurring_frequency: isRecurring ? recurringFrequency : null,
    });

    if (error || !data) {
      setBookingError(error?.message ?? 'Failed to create booking. Please try again.');
      setIsBooking(false);
      return;
    }

    sessionStorage.setItem('pending_payment_booking_id', data.id);
    setIsBooking(false);
    if (onNavigate) onNavigate('payment');
  };

  return (
    <>
    <section ref={bookingRef} className="relative -mt-20 z-20 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-2xl shadow-black/15 overflow-hidden border border-gray-100/80">

          {/* Header */}
          <div className="relative bg-gradient-to-r from-[#061539] via-[#0A2463] to-[#1B3A8C] px-6 sm:px-8 py-7 overflow-hidden">
            <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'radial-gradient(circle at 80% 50%, #D4AF37 0%, transparent 55%)' }} />
            <div className="relative flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Instant Van Quote</h2>
                <p className="text-white/55 mt-1 text-sm">Real-time pricing · No hidden fees · Verified drivers</p>
              </div>
              <div className="hidden sm:flex items-center gap-4 shrink-0">
                {[
                  { icon: Shield, label: 'Insured' },
                  { icon: Star, label: '4.9★' },
                  { icon: Clock, label: '60 sec' },
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <div className="w-9 h-9 bg-white/8 rounded-xl flex items-center justify-center border border-white/10">
                      <item.icon className="w-4 h-4 text-[#D4AF37]" />
                    </div>
                    <span className="text-white/40 text-[10px] font-semibold tracking-wide">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">

            {/* Address Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black text-gray-500 tracking-widest uppercase mb-2">Collection Address</label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-7 h-7 bg-green-50 rounded-lg flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-green-500" />
                  </div>
                  <input
                    type="text"
                    value={collectionAddress}
                    onChange={(e) => setCollectionAddress(e.target.value)}
                    placeholder="Pickup postcode or address"
                    className="w-full pl-13 pr-4 py-3.5 border-2 border-gray-150 rounded-2xl focus:border-[#0A2463] focus:ring-4 focus:ring-[#0A2463]/8 outline-none transition-all text-gray-800 placeholder:text-gray-350 text-sm font-medium bg-gray-50/50 focus:bg-white"
                    style={{ paddingLeft: '3.25rem' }}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-black text-gray-500 tracking-widest uppercase mb-2">Delivery Address</label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-7 h-7 bg-red-50 rounded-lg flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-red-500" />
                  </div>
                  <input
                    type="text"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Destination postcode or address"
                    className="w-full pr-4 py-3.5 border-2 border-gray-150 rounded-2xl focus:border-[#0A2463] focus:ring-4 focus:ring-[#0A2463]/8 outline-none transition-all text-gray-800 placeholder:text-gray-350 text-sm font-medium bg-gray-50/50 focus:bg-white"
                    style={{ paddingLeft: '3.25rem' }}
                  />
                </div>
              </div>
            </div>

            {/* Stop Points */}
            {addStops && (
              <div className="space-y-3 bg-amber-50/60 border border-amber-100 rounded-2xl p-4">
                <p className="text-xs font-black text-amber-700 tracking-widest uppercase">Additional Stop Points</p>
                {stopAddresses.map((stop, idx) => (
                  <div key={idx} className="flex gap-2">
                    <div className="relative flex-1">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D4AF37]" />
                      <input
                        type="text"
                        value={stop}
                        onChange={(e) => updateStop(idx, e.target.value)}
                        placeholder={`Stop ${idx + 1} address...`}
                        className="w-full pl-10 pr-4 py-3 border-2 border-amber-200 rounded-xl focus:border-[#0A2463] outline-none text-sm bg-white"
                      />
                    </div>
                    <button onClick={() => removeStop(idx)} className="p-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button onClick={addStop} className="flex items-center gap-2 text-[#0A2463] text-sm font-bold hover:text-[#1B3A8C] transition-colors">
                  <Plus className="w-4 h-4" /> Add another stop
                </button>
              </div>
            )}

            {/* Options Row */}
            <div className="flex flex-wrap gap-3">
              {[
                { label: 'Stairs at location', checked: hasStairs, onChange: (v: boolean) => setHasStairs(v) },
                { label: 'Add stop points', checked: addStops, onChange: (v: boolean) => setAddStops(v) },
              ].map((opt, i) => (
                <label key={i} className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border-2 cursor-pointer transition-all select-none ${opt.checked ? 'border-[#0A2463] bg-[#0A2463]/5 text-[#0A2463]' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                  <input type="checkbox" checked={opt.checked} onChange={(e) => opt.onChange(e.target.checked)} className="sr-only" />
                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${opt.checked ? 'bg-[#0A2463] border-[#0A2463]' : 'border-gray-300'}`}>
                    {opt.checked && <CheckCircle2 className="w-3 h-3 text-white" />}
                  </div>
                  <span className="text-sm font-semibold">{opt.label}</span>
                </label>
              ))}
            </div>

            {/* Vehicle Selection */}
            <div>
              <label className="block text-xs font-black text-gray-500 tracking-widest uppercase mb-3">Vehicle Type</label>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {VEHICLE_TYPES.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVehicle(v.id)}
                    className={`group relative p-4 rounded-2xl border-2 text-left transition-all ${
                      selectedVehicle === v.id
                        ? 'border-[#0A2463] bg-[#0A2463] shadow-lg shadow-[#0A2463]/20'
                        : 'border-gray-200 hover:border-[#0A2463]/40 hover:bg-gray-50'
                    }`}
                  >
                    {selectedVehicle === v.id && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-[#D4AF37] rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-3 h-3 text-[#061539]" />
                      </div>
                    )}
                    <Truck className={`w-7 h-7 mb-2.5 transition-colors ${selectedVehicle === v.id ? 'text-[#D4AF37]' : 'text-gray-400 group-hover:text-[#0A2463]'}`} />
                    <p className={`font-black text-sm transition-colors ${selectedVehicle === v.id ? 'text-white' : 'text-gray-800'}`}>{v.name}</p>
                    <p className={`text-xs mt-0.5 transition-colors ${selectedVehicle === v.id ? 'text-white/60' : 'text-gray-400'}`}>{v.capacity}</p>
                    <p className={`font-black text-sm mt-1.5 transition-colors ${selectedVehicle === v.id ? 'text-[#D4AF37]' : 'text-[#D4AF37]'}`}>From £{v.basePrice}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Delivery Type & Helpers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black text-gray-500 tracking-widest uppercase mb-3">Delivery Type</label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setDeliveryType('dedicated')}
                    className={`flex-1 p-3.5 rounded-2xl border-2 text-center transition-all ${deliveryType === 'dedicated' ? 'border-[#0A2463] bg-[#0A2463]/5' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <Truck className={`w-5 h-5 mx-auto mb-1.5 ${deliveryType === 'dedicated' ? 'text-[#0A2463]' : 'text-gray-400'}`} />
                    <p className={`text-sm font-black ${deliveryType === 'dedicated' ? 'text-[#0A2463]' : 'text-gray-700'}`}>Dedicated</p>
                    <p className="text-xs text-gray-400 mt-0.5">Full vehicle</p>
                  </button>
                  <button
                    onClick={() => setDeliveryType('shared')}
                    className={`flex-1 p-3.5 rounded-2xl border-2 text-center transition-all ${deliveryType === 'shared' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <Building2 className={`w-5 h-5 mx-auto mb-1.5 ${deliveryType === 'shared' ? 'text-green-600' : 'text-gray-400'}`} />
                    <p className={`text-sm font-black ${deliveryType === 'shared' ? 'text-green-700' : 'text-gray-700'}`}>Shared</p>
                    <p className="text-xs text-green-600 font-bold mt-0.5">Save 30%</p>
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-black text-gray-500 tracking-widest uppercase mb-3">Additional Helpers</label>
                <div className="flex items-center gap-3 bg-gray-50 rounded-2xl p-4 border border-gray-100">
                  <button
                    onClick={() => setHelpers(Math.max(0, helpers - 1))}
                    className="w-10 h-10 rounded-xl bg-white border-2 border-gray-200 flex items-center justify-center text-gray-600 hover:border-[#0A2463] hover:text-[#0A2463] transition-all font-black text-lg"
                  >−</button>
                  <div className="flex-1 text-center">
                    <p className="text-3xl font-black text-[#0A2463]">{helpers}</p>
                    <p className="text-xs text-gray-400 font-semibold">helpers</p>
                  </div>
                  <button
                    onClick={() => setHelpers(Math.min(3, helpers + 1))}
                    className="w-10 h-10 rounded-xl bg-white border-2 border-gray-200 flex items-center justify-center text-gray-600 hover:border-[#0A2463] hover:text-[#0A2463] transition-all font-black text-lg"
                  >+</button>
                  <div className="text-center ml-1">
                    <p className="text-[#D4AF37] font-black text-sm">£25</p>
                    <p className="text-gray-400 text-xs">each</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Geocode error */}
            {geocodeError && (
              <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-2xl px-4 py-3.5">
                <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
                <p className="text-red-700 text-sm font-medium">{geocodeError}</p>
              </div>
            )}

            {/* Get Quote Button */}
            <button
              onClick={calculateQuote}
              disabled={!collectionAddress || !deliveryAddress || isCalculating}
              className="w-full bg-[#D4AF37] hover:bg-[#C5A028] disabled:bg-gray-200 disabled:cursor-not-allowed text-[#061539] py-4.5 rounded-2xl font-black text-lg transition-all hover:shadow-2xl hover:shadow-[#D4AF37]/30 hover:-translate-y-0.5 flex items-center justify-center gap-3 disabled:text-gray-400"
              style={{ paddingTop: '1.1rem', paddingBottom: '1.1rem' }}
            >
              {isCalculating ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Calculating best route…</>
              ) : (
                <>Get Instant Quote <ArrowRight className="w-5 h-5" /></>
              )}
            </button>

            {/* Quote Result */}
            {showQuote && quoteData && !bookingConfirmed && (
              <div className="relative rounded-3xl overflow-hidden animate-in slide-in-from-bottom-4">
                <div className="absolute inset-0 bg-gradient-to-br from-[#061539] via-[#0A2463] to-[#1B3A8C]" />
                <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle at 90% 10%, #D4AF37 0%, transparent 50%)' }} />
                <div className="relative p-6">
                  {quoteData.isSurge && (
                    <div className="flex items-center gap-2.5 bg-orange-500/15 border border-orange-400/20 rounded-xl px-4 py-2.5 mb-5">
                      <AlertTriangle className="w-4 h-4 text-orange-400 shrink-0" />
                      <span className="text-orange-300 text-sm font-semibold">Surge pricing active ({quoteData.surgeMultiplier}×) — peak demand period</span>
                    </div>
                  )}

                  {/* Quote stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                    {[
                      { label: 'Distance', value: `${quoteData.distance} mi` },
                      { label: 'Est. Duration', value: quoteData.duration },
                      { label: 'Vehicle', value: quoteData.vehicle },
                      { label: 'Your Price', value: `£${quoteData.basePrice}`, highlight: true },
                    ].map((stat, i) => (
                      <div key={i} className={`rounded-2xl p-3.5 text-center ${stat.highlight ? 'bg-[#D4AF37]/15 border border-[#D4AF37]/25' : 'bg-white/5 border border-white/8'}`}>
                        <p className="text-white/45 text-xs uppercase tracking-wider mb-1">{stat.label}</p>
                        <p className={`font-black text-xl ${stat.highlight ? 'text-[#D4AF37]' : 'text-white'}`}>{stat.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Schedule / Recurring options */}
                  <div className="bg-white/5 border border-white/8 rounded-2xl p-4 mb-4 space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${scheduleForLater ? 'bg-[#D4AF37] border-[#D4AF37]' : 'border-white/30'}`}>
                        {scheduleForLater && <CheckCircle2 className="w-3.5 h-3.5 text-[#061539]" />}
                      </div>
                      <input type="checkbox" checked={scheduleForLater} onChange={e => { setScheduleForLater(e.target.checked); if (!e.target.checked) setIsRecurring(false); }} className="sr-only" />
                      <Calendar className="w-4 h-4 text-white/60" />
                      <span className="text-white/85 text-sm font-semibold">Schedule for a specific date & time</span>
                    </label>
                    {scheduleForLater && (
                      <>
                        <input
                          type="datetime-local"
                          value={scheduledAt}
                          onChange={e => setScheduledAt(e.target.value)}
                          min={new Date().toISOString().slice(0, 16)}
                          className="w-full bg-white/8 border border-white/15 text-white rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#D4AF37] transition-colors"
                        />
                        <label className="flex items-center gap-3 cursor-pointer">
                          <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${isRecurring ? 'bg-[#D4AF37] border-[#D4AF37]' : 'border-white/30'}`}>
                            {isRecurring && <CheckCircle2 className="w-3.5 h-3.5 text-[#061539]" />}
                          </div>
                          <input type="checkbox" checked={isRecurring} onChange={e => setIsRecurring(e.target.checked)} className="sr-only" />
                          <Repeat className="w-4 h-4 text-white/60" />
                          <span className="text-white/85 text-sm font-semibold">Repeat this booking</span>
                        </label>
                        {isRecurring && (
                          <div className="flex gap-2 pl-8">
                            {(['weekly', 'biweekly', 'monthly'] as const).map(freq => (
                              <button
                                key={freq}
                                type="button"
                                onClick={() => setRecurringFrequency(freq)}
                                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all capitalize ${
                                  recurringFrequency === freq
                                    ? 'bg-[#D4AF37] text-[#0A2463]'
                                    : 'bg-white/8 text-white/60 hover:bg-white/15'
                                }`}
                              >
                                {freq === 'biweekly' ? 'Bi-weekly' : freq.charAt(0).toUpperCase() + freq.slice(1)}
                              </button>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {bookingError && (
                    <div className="flex items-center gap-2.5 bg-red-500/15 border border-red-400/20 rounded-xl px-4 py-3 mb-4">
                      <AlertTriangle className="w-4 h-4 text-red-300 shrink-0" />
                      <span className="text-red-200 text-sm">{bookingError}</span>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={handleCardPayment}
                      disabled={isRedirecting || isBooking}
                      className="flex-1 bg-[#D4AF37] hover:bg-[#C5A028] disabled:opacity-60 disabled:cursor-not-allowed text-[#061539] py-4 rounded-2xl font-black transition-all hover:shadow-xl hover:shadow-[#D4AF37]/25 flex items-center justify-center gap-2.5"
                    >
                      {isRedirecting ? <Loader2 className="w-5 h-5 animate-spin" /> : <CreditCard className="w-5 h-5" />}
                      {isRedirecting ? 'Preparing…' : `Pay by Card — £${quoteData.basePrice}`}
                    </button>
                    <button
                      onClick={handleCashPayment}
                      disabled={isBooking || isRedirecting}
                      className="sm:w-40 px-6 py-4 bg-white/8 hover:bg-white/15 disabled:opacity-60 rounded-2xl font-bold transition-all border border-white/15 flex items-center justify-center gap-2"
                    >
                      {isBooking ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                      Cash
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Booking Confirmed */}
            {bookingConfirmed && (
              <div className="relative rounded-3xl overflow-hidden animate-in slide-in-from-bottom-4">
                <div className="absolute inset-0 bg-gradient-to-br from-green-600 to-green-700" />
                <div className="relative p-8 text-center">
                  <div className="w-16 h-16 bg-white/15 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-9 h-9 text-white" />
                  </div>
                  <h3 className="text-2xl font-black text-white mb-2">Booking Confirmed!</h3>
                  <p className="text-white/75 text-sm mb-4">Your booking is saved — a driver will be assigned shortly.</p>
                  {bookingId && (
                    <div className="inline-block bg-white/10 border border-white/20 rounded-xl px-5 py-2.5 mb-6">
                      <p className="text-white/60 text-xs uppercase tracking-widest mb-0.5">Booking Reference</p>
                      <p className="text-white font-black font-mono tracking-widest">{bookingId.slice(0, 8).toUpperCase()}</p>
                    </div>
                  )}
                  <div>
                    <button
                      onClick={() => { setShowQuote(false); setBookingConfirmed(false); setCollectionAddress(''); setDeliveryAddress(''); setQuoteData(null); }}
                      className="text-white/80 font-semibold text-sm hover:text-white transition-colors border border-white/20 hover:border-white/40 rounded-xl px-6 py-2.5"
                    >
                      Make another booking
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  </>
  );
};

export default BookingWidget;
