import React, { useState, useEffect } from 'react';
import { MapPin, Plus, X, Truck, ArrowRight, CheckCircle2, AlertTriangle, Building2, Loader2, CreditCard, Calendar, Repeat } from 'lucide-react';
import { PRICING, VEHICLE_TYPES } from '@/lib/constants';
import { geocodeUK, haversineMiles } from '@/lib/geocoding';
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
    const baseMiles = haversineMiles(fromCoords[0], fromCoords[1], toCoords[0], toCoords[1]);
    const extraStopMiles = addStops ? stopAddresses.filter(s => s).length * 8 : 0;
    const totalMiles = Math.max(1, Math.round((baseMiles + extraStopMiles) * 10) / 10);
    const travelTimeMin = Math.round(totalMiles * 2.2);
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
    <section ref={bookingRef} className="relative -mt-20 z-20 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-2xl shadow-black/10 overflow-hidden border border-gray-100">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#0A2463] to-[#1B3A8C] px-6 sm:px-8 py-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Man and Van Quotes</h2>
            <p className="text-white/70 mt-1">Get free quotes for man and van services in under one minute.</p>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* Address Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Collection Address</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                  <input
                    type="text"
                    value={collectionAddress}
                    onChange={(e) => setCollectionAddress(e.target.value)}
                    placeholder="Enter pickup address..."
                    className="w-full pl-11 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-[#0A2463] focus:ring-2 focus:ring-[#0A2463]/20 outline-none transition-all text-gray-800 placeholder:text-gray-400"
                  />
                </div>
              </div>
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Delivery Address</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" />
                  <input
                    type="text"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Enter delivery address..."
                    className="w-full pl-11 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-[#0A2463] focus:ring-2 focus:ring-[#0A2463]/20 outline-none transition-all text-gray-800 placeholder:text-gray-400"
                  />
                </div>
              </div>
            </div>

            {/* Stop Points */}
            {addStops && (
              <div className="space-y-3 bg-gray-50 rounded-xl p-4">
                <p className="text-sm font-semibold text-gray-700">Additional Stop Points</p>
                {stopAddresses.map((stop, idx) => (
                  <div key={idx} className="flex gap-2">
                    <div className="relative flex-1">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D4AF37]" />
                      <input
                        type="text"
                        value={stop}
                        onChange={(e) => updateStop(idx, e.target.value)}
                        placeholder={`Stop ${idx + 1} address...`}
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#0A2463] outline-none text-sm"
                      />
                    </div>
                    <button onClick={() => removeStop(idx)} className="p-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button onClick={addStop} className="flex items-center gap-2 text-[#0A2463] text-sm font-medium hover:underline">
                  <Plus className="w-4 h-4" /> Add another stop
                </button>
              </div>
            )}

            {/* Options Row */}
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" checked={hasStairs} onChange={(e) => setHasStairs(e.target.checked)} className="w-5 h-5 rounded border-gray-300 text-[#0A2463] focus:ring-[#0A2463]" />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">There are stairs at the location</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" checked={addStops} onChange={(e) => setAddStops(e.target.checked)} className="w-5 h-5 rounded border-gray-300 text-[#0A2463] focus:ring-[#0A2463]" />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">Add stop points</span>
              </label>
            </div>

            {/* Vehicle Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Select Vehicle Type</label>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {VEHICLE_TYPES.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVehicle(v.id)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      selectedVehicle === v.id
                        ? 'border-[#0A2463] bg-[#0A2463]/5 shadow-md'
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                    }`}
                  >
                    <Truck className={`w-8 h-8 mb-2 ${selectedVehicle === v.id ? 'text-[#0A2463]' : 'text-gray-400'}`} />
                    <p className="font-semibold text-gray-800 text-sm">{v.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{v.capacity}</p>
                    <p className="text-[#D4AF37] font-bold text-sm mt-1">From £{v.basePrice}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Delivery Type & Helpers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Delivery Type</label>
                <div className="flex gap-3">
                  <button onClick={() => setDeliveryType('dedicated')} className={`flex-1 p-3 rounded-xl border-2 text-center transition-all ${deliveryType === 'dedicated' ? 'border-[#0A2463] bg-[#0A2463]/5' : 'border-gray-200'}`}>
                    <Truck className="w-5 h-5 mx-auto mb-1 text-[#0A2463]" />
                    <p className="text-sm font-semibold">Dedicated Van</p>
                    <p className="text-xs text-gray-500">Full vehicle for you</p>
                  </button>
                  <button onClick={() => setDeliveryType('shared')} className={`flex-1 p-3 rounded-xl border-2 text-center transition-all ${deliveryType === 'shared' ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
                    <Building2 className="w-5 h-5 mx-auto mb-1 text-green-600" />
                    <p className="text-sm font-semibold">Shared Delivery</p>
                    <p className="text-xs text-green-600 font-medium">Save 30% - Eco option</p>
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Additional Helpers</label>
                <div className="flex items-center gap-4 bg-gray-50 rounded-xl p-4">
                  <button onClick={() => setHelpers(Math.max(0, helpers - 1))} className="w-10 h-10 rounded-lg bg-white border-2 border-gray-200 flex items-center justify-center text-gray-600 hover:border-[#0A2463] transition-colors font-bold">-</button>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-[#0A2463]">{helpers}</p>
                    <p className="text-xs text-gray-500">helpers</p>
                  </div>
                  <button onClick={() => setHelpers(Math.min(3, helpers + 1))} className="w-10 h-10 rounded-lg bg-white border-2 border-gray-200 flex items-center justify-center text-gray-600 hover:border-[#0A2463] transition-colors font-bold">+</button>
                  <p className="text-sm text-gray-500 ml-2">£25/helper</p>
                </div>
              </div>
            </div>

            {/* Geocode error */}
            {geocodeError && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                <p className="text-red-700 text-sm">{geocodeError}</p>
              </div>
            )}

            {/* Get Quote Button */}
            <button
              onClick={calculateQuote}
              disabled={!collectionAddress || !deliveryAddress || isCalculating}
              className="w-full bg-[#D4AF37] hover:bg-[#C5A028] disabled:bg-gray-300 disabled:cursor-not-allowed text-[#0A2463] py-4 rounded-xl font-bold text-lg transition-all hover:shadow-xl hover:shadow-[#D4AF37]/20 flex items-center justify-center gap-2"
            >
              {isCalculating ? (
                <><div className="w-5 h-5 border-2 border-[#0A2463]/30 border-t-[#0A2463] rounded-full animate-spin" /> Calculating Route...</>
              ) : (
                <>Get Instant Quote <ArrowRight className="w-5 h-5" /></>
              )}
            </button>

            {/* Quote Result */}
            {showQuote && quoteData && !bookingConfirmed && (
              <div className="bg-gradient-to-br from-[#0A2463] to-[#1B3A8C] rounded-2xl p-6 text-white animate-in slide-in-from-bottom-4">
                {quoteData.isSurge && (
                  <div className="flex items-center gap-2 bg-[#D4AF37]/20 rounded-lg px-4 py-2 mb-4">
                    <AlertTriangle className="w-4 h-4 text-[#D4AF37]" />
                    <span className="text-[#D4AF37] text-sm font-medium">Surge pricing active ({quoteData.surgeMultiplier}x) - High demand period</span>
                  </div>
                )}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div>
                    <p className="text-white/60 text-xs uppercase tracking-wider">Distance</p>
                    <p className="text-xl font-bold">{quoteData.distance} miles</p>
                  </div>
                  <div>
                    <p className="text-white/60 text-xs uppercase tracking-wider">Est. Duration</p>
                    <p className="text-xl font-bold">{quoteData.duration}</p>
                  </div>
                  <div>
                    <p className="text-white/60 text-xs uppercase tracking-wider">Vehicle</p>
                    <p className="text-xl font-bold">{quoteData.vehicle}</p>
                  </div>
                  <div>
                    <p className="text-white/60 text-xs uppercase tracking-wider">Estimated Price</p>
                    <p className="text-3xl font-bold text-[#D4AF37]">£{quoteData.basePrice}</p>
                  </div>
                </div>
                {/* Schedule / Recurring options */}
                <div className="bg-white/5 rounded-xl p-4 mb-4 space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={scheduleForLater}
                      onChange={e => { setScheduleForLater(e.target.checked); if (!e.target.checked) { setIsRecurring(false); } }}
                      className="w-4 h-4 rounded"
                    />
                    <Calendar className="w-4 h-4 text-white/70" />
                    <span className="text-white/90 text-sm font-medium">Schedule for a specific date & time</span>
                  </label>
                  {scheduleForLater && (
                    <>
                      <input
                        type="datetime-local"
                        value={scheduledAt}
                        onChange={e => setScheduledAt(e.target.value)}
                        min={new Date().toISOString().slice(0, 16)}
                        className="w-full bg-white/10 border border-white/20 text-white rounded-lg px-3 py-2 text-sm outline-none focus:border-[#D4AF37]"
                      />
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isRecurring}
                          onChange={e => setIsRecurring(e.target.checked)}
                          className="w-4 h-4 rounded"
                        />
                        <Repeat className="w-4 h-4 text-white/70" />
                        <span className="text-white/90 text-sm font-medium">Repeat this booking</span>
                      </label>
                      {isRecurring && (
                        <div className="flex gap-2 pl-7">
                          {(['weekly', 'biweekly', 'monthly'] as const).map(freq => (
                            <button
                              key={freq}
                              type="button"
                              onClick={() => setRecurringFrequency(freq)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${
                                recurringFrequency === freq
                                  ? 'bg-[#D4AF37] text-[#0A2463]'
                                  : 'bg-white/10 text-white/70 hover:bg-white/20'
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
                  <div className="flex items-center gap-2 bg-red-500/20 rounded-lg px-4 py-2 mb-4">
                    <AlertTriangle className="w-4 h-4 text-red-300" />
                    <span className="text-red-200 text-sm">{bookingError}</span>
                  </div>
                )}
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleCardPayment}
                    disabled={isRedirecting || isBooking}
                    className="flex-1 bg-[#D4AF37] hover:bg-[#C5A028] disabled:opacity-60 text-[#0A2463] py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                  >
                    {isRedirecting ? <Loader2 className="w-5 h-5 animate-spin" /> : <CreditCard className="w-5 h-5" />}
                    {isRedirecting ? 'Preparing Payment…' : `Pay by Card £${quoteData.basePrice}`}
                  </button>
                  <button
                    onClick={handleCashPayment}
                    disabled={isBooking || isRedirecting}
                    className="px-6 py-3 bg-white/10 hover:bg-white/20 disabled:opacity-60 rounded-xl font-semibold transition-all border border-white/20 flex items-center gap-2"
                  >
                    {isBooking ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                    Pay with Cash
                  </button>
                </div>
              </div>
            )}

            {/* Booking Confirmed */}
            {bookingConfirmed && (
              <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6 text-center animate-in slide-in-from-bottom-4">
                <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-green-800 mb-1">Booking Confirmed!</h3>
                <p className="text-green-600 text-sm mb-2">Your booking has been saved and a driver will be assigned shortly.</p>
                {bookingId && <p className="text-green-500 text-xs font-mono bg-green-100 inline-block px-3 py-1 rounded-full">Ref: {bookingId.slice(0, 8).toUpperCase()}</p>}
                <div className="mt-4">
                  <button
                    onClick={() => { setShowQuote(false); setBookingConfirmed(false); setCollectionAddress(''); setDeliveryAddress(''); setQuoteData(null); }}
                    className="text-green-700 font-semibold text-sm hover:underline"
                  >
                    Make another booking
                  </button>
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
