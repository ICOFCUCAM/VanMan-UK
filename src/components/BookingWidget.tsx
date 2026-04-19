import React, { useState } from 'react';
import { MapPin, Plus, X, Truck, ArrowRight, CheckCircle2, AlertTriangle, Building2, Loader2, CreditCard, Calendar, Repeat } from 'lucide-react';
import { PRICING, VEHICLE_TYPES } from '@/lib/constants';
import { geocodeUK } from '@/lib/geocoding';
import { getRoute } from '@/lib/routing';
import { useAppContext } from '@/contexts/AppContext';
import { createBooking } from '@/services/bookings';
import type { PaymentMethod, QuoteData } from '@/types';

interface BookingWidgetProps {
  bookingRef: React.RefObject<HTMLDivElement | null>;
  onNavigate?: (page: string) => void;
  embedded?: boolean;
}

const STEPS = ['Route', 'Options', 'Quote'] as const;

const MOVE_TYPE_OPTIONS = [
  { value: 'single-item', label: 'Single item / boxes', vehicle: 'small' },
  { value: 'student', label: 'Student move', vehicle: 'small' },
  { value: 'apartment', label: '1–2 bed flat', vehicle: 'medium' },
  { value: 'house', label: '2–3 bed house', vehicle: 'large' },
  { value: 'large-house', label: '3+ bed house', vehicle: 'luton' },
  { value: 'office', label: 'Office move', vehicle: 'large' },
];

const BookingWidget: React.FC<BookingWidgetProps> = ({ bookingRef, onNavigate, embedded = false }) => {
  const { user } = useAppContext();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [collectionAddress, setCollectionAddress] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [hasStairs, setHasStairs] = useState(false);
  const [addStops, setAddStops] = useState(false);
  const [stopAddresses, setStopAddresses] = useState<string[]>(['']);
  const [selectedVehicle, setSelectedVehicle] = useState('medium');
  const [helpers, setHelpers] = useState(0);
  const [deliveryType, setDeliveryType] = useState<'dedicated' | 'shared'>('dedicated');
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
  const [moveType, setMoveType] = useState('apartment');
  const [moveDate, setMoveDate] = useState('');

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
    setStep(3);
    setIsCalculating(false);
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

  const card = (
    <div className="bg-white rounded-2xl shadow-xl shadow-black/10 border border-gray-100">

      {/* Header with step indicator */}
      <div className="relative bg-gradient-to-r from-[#071A2F] via-[#0E2A47] to-[#0F3558] rounded-t-2xl px-6 sm:px-8 py-5 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'radial-gradient(circle at 85% 50%, #F5B400 0%, transparent 55%)' }} />
        <div className="relative flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-white text-xl font-bold">Get an instant quote</h2>
            <p className="text-white/60 text-sm mt-0.5">No hidden fees · Verified UK drivers · Fully insured</p>
          </div>
          <div className="hidden sm:flex items-center gap-5 text-sm text-white/70">
            {[
              { label: 'Fully insured', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
              { label: '2 hr minimum', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
              { label: 'VAT included', icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z' },
            ].map(({ label, icon }) => (
              <span key={label} className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-[#F5B400]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} /></svg>
                {label}
              </span>
            ))}
          </div>
          {/* Step progress pills (only visible in steps 2/3) */}
          {step > 1 && (
            <div className="flex items-center gap-1">
              {STEPS.map((label, i) => (
                <div key={label} className={`h-1.5 rounded-full transition-all duration-300 ${i + 1 === step ? 'w-7 bg-[#F5B400]' : i + 1 < step ? 'w-3 bg-[#F5B400]/55' : 'w-3 bg-white/20'}`} />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="px-6 sm:px-8 py-6">

        {/* ── STEP 1: Route ── */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Pickup */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Collection address</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 bg-green-50 rounded flex items-center justify-center pointer-events-none">
                    <MapPin className="w-3.5 h-3.5 text-green-500" />
                  </div>
                  <input
                    type="text"
                    value={collectionAddress}
                    onChange={(e) => setCollectionAddress(e.target.value)}
                    placeholder="Pickup postcode or address"
                    className="w-full pl-9 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0E2A47]/20 focus:border-[#0E2A47] outline-none text-sm transition-colors"
                  />
                </div>
              </div>
              {/* Delivery */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Delivery address</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 bg-red-50 rounded flex items-center justify-center pointer-events-none">
                    <MapPin className="w-3.5 h-3.5 text-red-500" />
                  </div>
                  <input
                    type="text"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Destination postcode or address"
                    className="w-full pl-9 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0E2A47]/20 focus:border-[#0E2A47] outline-none text-sm transition-colors"
                  />
                </div>
              </div>
              {/* Move type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Move type</label>
                <div className="relative">
                  <Truck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <select
                    value={moveType}
                    onChange={(e) => {
                      setMoveType(e.target.value);
                      const opt = MOVE_TYPE_OPTIONS.find(o => o.value === e.target.value);
                      if (opt) setSelectedVehicle(opt.vehicle);
                    }}
                    className="w-full pl-9 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0E2A47]/20 focus:border-[#0E2A47] outline-none text-sm bg-white appearance-none"
                  >
                    {MOVE_TYPE_OPTIONS.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Moving date</label>
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                  <input
                    type="date"
                    value={moveDate}
                    onChange={(e) => setMoveDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full pl-9 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0E2A47]/20 focus:border-[#0E2A47] outline-none text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Add stops toggle */}
            <label className={`inline-flex items-center gap-2.5 px-3.5 py-2 rounded-xl border cursor-pointer transition-all text-sm select-none ${addStops ? 'border-[#0E2A47] bg-[#0E2A47]/5 text-[#0E2A47]' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
              <input type="checkbox" checked={addStops} onChange={(e) => setAddStops(e.target.checked)} className="sr-only" />
              <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 ${addStops ? 'bg-[#0E2A47] border-[#0E2A47]' : 'border-gray-300'}`}>
                {addStops && <CheckCircle2 className="w-3 h-3 text-white" />}
              </div>
              <Plus className="w-3.5 h-3.5" />
              <span className="font-medium">Add stop points</span>
            </label>

            {addStops && (
              <div className="space-y-2 bg-amber-50/60 border border-amber-100 rounded-xl p-3">
                {stopAddresses.map((stop, idx) => (
                  <div key={idx} className="flex gap-2">
                    <div className="relative flex-1">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#F5B400]" />
                      <input type="text" value={stop} onChange={(e) => updateStop(idx, e.target.value)} placeholder={`Stop ${idx + 1}`} className="w-full pl-9 pr-3 py-2.5 border border-amber-200 rounded-lg focus:border-[#0E2A47] outline-none text-sm bg-white" />
                    </div>
                    <button onClick={() => removeStop(idx)} className="p-2 text-red-400 hover:text-red-600 rounded-lg transition-colors"><X className="w-4 h-4" /></button>
                  </div>
                ))}
                <button onClick={addStop} className="flex items-center gap-1.5 text-[#0E2A47] text-xs font-bold hover:text-[#0F3558]"><Plus className="w-3.5 h-3.5" /> Add stop</button>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
              <div className="text-xs text-gray-400 min-h-[20px]" />
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={() => setStep(2)}
                  disabled={!collectionAddress || !deliveryAddress}
                  className="flex-1 sm:flex-none px-5 py-3 bg-[#0E2A47] hover:bg-[#0F3558] disabled:bg-gray-100 disabled:cursor-not-allowed text-white disabled:text-gray-400 rounded-xl font-semibold text-sm transition-all"
                >
                  Get Estimate
                </button>
                <button
                  onClick={() => setStep(2)}
                  disabled={!collectionAddress || !deliveryAddress}
                  className="group flex-1 sm:flex-none px-6 py-3 bg-[#F5B400] hover:bg-[#FFD24A] disabled:opacity-40 disabled:cursor-not-allowed text-[#0B2239] rounded-xl font-black text-sm transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#F5B400]/25 flex items-center justify-center gap-2"
                >
                  Book Now
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 2: Options ── */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-gray-400 tracking-[0.18em] uppercase mb-2">Vehicle</label>
              <div className="grid grid-cols-2 gap-2">
                {VEHICLE_TYPES.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVehicle(v.id)}
                    className={`relative p-3 rounded-xl border-2 text-left transition-all ${selectedVehicle === v.id ? 'border-[#0E2A47] bg-[#0E2A47]' : 'border-gray-200 hover:border-[#0E2A47]/30'}`}
                  >
                    {selectedVehicle === v.id && (
                      <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#F5B400] rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-2.5 h-2.5 text-[#071A2F]" />
                      </div>
                    )}
                    <Truck className={`w-5 h-5 mb-1.5 ${selectedVehicle === v.id ? 'text-[#F5B400]' : 'text-gray-400'}`} />
                    <p className={`font-black text-xs ${selectedVehicle === v.id ? 'text-white' : 'text-gray-800'}`}>{v.name}</p>
                    <p className={`text-[11px] ${selectedVehicle === v.id ? 'text-white/50' : 'text-gray-400'}`}>{v.capacity}</p>
                    <p className="font-black text-xs text-[#F5B400] mt-1">From £{v.basePrice}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-400 tracking-[0.18em] uppercase mb-2">Delivery type</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setDeliveryType('dedicated')}
                  className={`p-3 rounded-xl border-2 text-center transition-all ${deliveryType === 'dedicated' ? 'border-[#0E2A47] bg-[#0E2A47]/5' : 'border-gray-200 hover:border-gray-300'}`}
                >
                  <Truck className={`w-4 h-4 mx-auto mb-1 ${deliveryType === 'dedicated' ? 'text-[#0E2A47]' : 'text-gray-400'}`} />
                  <p className={`text-xs font-black ${deliveryType === 'dedicated' ? 'text-[#0E2A47]' : 'text-gray-700'}`}>Dedicated</p>
                  <p className="text-[11px] text-gray-400">Full van</p>
                </button>
                <button
                  onClick={() => setDeliveryType('shared')}
                  className={`p-3 rounded-xl border-2 text-center transition-all ${deliveryType === 'shared' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}
                >
                  <Building2 className={`w-4 h-4 mx-auto mb-1 ${deliveryType === 'shared' ? 'text-green-600' : 'text-gray-400'}`} />
                  <p className={`text-xs font-black ${deliveryType === 'shared' ? 'text-green-700' : 'text-gray-700'}`}>Shared</p>
                  <p className="text-[11px] text-green-600 font-bold">Save 30%</p>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <label className={`flex-1 flex items-center gap-2 px-3 py-2.5 rounded-xl border cursor-pointer text-xs transition-all ${hasStairs ? 'border-[#0E2A47] bg-[#0E2A47]/5 text-[#0E2A47]' : 'border-gray-200 text-gray-500'}`}>
                <input type="checkbox" checked={hasStairs} onChange={(e) => setHasStairs(e.target.checked)} className="sr-only" />
                <div className={`w-3.5 h-3.5 rounded border-2 flex items-center justify-center shrink-0 ${hasStairs ? 'bg-[#0E2A47] border-[#0E2A47]' : 'border-gray-300'}`}>
                  {hasStairs && <CheckCircle2 className="w-2.5 h-2.5 text-white" />}
                </div>
                <span className="font-medium">Stairs (+£20)</span>
              </label>
              <div className="flex items-center gap-2 bg-gray-50 rounded-xl border border-gray-100 px-3 py-2">
                <button onClick={() => setHelpers(Math.max(0, helpers - 1))} className="w-6 h-6 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-600 font-black hover:border-[#0E2A47] transition-colors">−</button>
                <div className="text-center w-10">
                  <p className="text-sm font-black text-[#0E2A47]">{helpers}</p>
                  <p className="text-[10px] text-gray-400">helper{helpers !== 1 ? 's' : ''}</p>
                </div>
                <button onClick={() => setHelpers(Math.min(3, helpers + 1))} className="w-6 h-6 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-600 font-black hover:border-[#0E2A47] transition-colors">+</button>
              </div>
            </div>

            {geocodeError && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3.5 py-3">
                <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                <p className="text-red-700 text-xs">{geocodeError}</p>
              </div>
            )}

            <div className="flex gap-2">
              <button onClick={() => setStep(1)} className="px-4 py-3.5 rounded-xl border border-gray-200 text-gray-500 font-semibold text-sm hover:bg-gray-50 transition-all">← Back</button>
              <button
                onClick={calculateQuote}
                disabled={isCalculating}
                className="flex-1 bg-[#F5B400] hover:bg-[#E5A000] disabled:bg-gray-100 disabled:cursor-not-allowed text-[#071A2F] disabled:text-gray-400 py-3.5 rounded-xl font-black text-sm transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                {isCalculating ? <><Loader2 className="w-4 h-4 animate-spin" /> Calculating…</> : <>Get Quote <ArrowRight className="w-4 h-4" /></>}
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: Quote ── */}
        {step === 3 && quoteData && !bookingConfirmed && (
          <div className="space-y-4">
            <div className="relative rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#071A2F] via-[#0E2A47] to-[#0F3558]" />
              <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle at 90% 10%, #F5B400 0%, transparent 50%)' }} />
              <div className="relative p-4">
                {quoteData.isSurge && (
                  <div className="flex items-center gap-2 bg-orange-500/15 border border-orange-400/20 rounded-lg px-3 py-2 mb-3">
                    <AlertTriangle className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                    <span className="text-orange-300 text-xs font-semibold">Surge pricing ({quoteData.surgeMultiplier}×) — peak demand</span>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'Distance', value: `${quoteData.distance} mi` },
                    { label: 'Duration', value: quoteData.duration },
                    { label: 'Vehicle', value: quoteData.vehicle },
                    { label: 'Total', value: `£${quoteData.basePrice}`, highlight: true },
                  ].map((stat, i) => (
                    <div key={i} className={`rounded-xl p-3 text-center ${stat.highlight ? 'bg-[#F5B400]/15 border border-[#F5B400]/25' : 'bg-white/5 border border-white/8'}`}>
                      <p className="text-white/45 text-[10px] uppercase tracking-wider mb-0.5">{stat.label}</p>
                      <p className={`font-black text-lg ${stat.highlight ? 'text-[#F5B400]' : 'text-white'}`}>{stat.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-100 rounded-xl p-3.5 space-y-3">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 ${scheduleForLater ? 'bg-[#F5B400] border-[#F5B400]' : 'border-gray-300'}`}>
                  {scheduleForLater && <CheckCircle2 className="w-2.5 h-2.5 text-[#071A2F]" />}
                </div>
                <input type="checkbox" checked={scheduleForLater} onChange={e => { setScheduleForLater(e.target.checked); if (!e.target.checked) setIsRecurring(false); }} className="sr-only" />
                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-gray-700 text-xs font-semibold">Schedule for a later date</span>
              </label>
              {scheduleForLater && (
                <>
                  <input
                    type="datetime-local"
                    value={scheduledAt}
                    onChange={e => setScheduledAt(e.target.value)}
                    min={new Date().toISOString().slice(0, 16)}
                    className="w-full bg-white border border-gray-200 text-gray-700 rounded-lg px-3 py-2 text-xs outline-none focus:border-[#0E2A47]"
                  />
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 ${isRecurring ? 'bg-[#F5B400] border-[#F5B400]' : 'border-gray-300'}`}>
                      {isRecurring && <CheckCircle2 className="w-2.5 h-2.5 text-[#071A2F]" />}
                    </div>
                    <input type="checkbox" checked={isRecurring} onChange={e => setIsRecurring(e.target.checked)} className="sr-only" />
                    <Repeat className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-gray-700 text-xs font-semibold">Repeat this booking</span>
                  </label>
                  {isRecurring && (
                    <div className="flex gap-1.5 pl-6">
                      {(['weekly', 'biweekly', 'monthly'] as const).map(freq => (
                        <button
                          key={freq}
                          type="button"
                          onClick={() => setRecurringFrequency(freq)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold ${recurringFrequency === freq ? 'bg-[#F5B400] text-[#0E2A47]' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
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
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3.5 py-3">
                <AlertTriangle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                <span className="text-red-700 text-xs">{bookingError}</span>
              </div>
            )}

            <div className="flex gap-2">
              <button onClick={() => setStep(2)} className="px-4 py-3.5 rounded-xl border border-gray-200 text-gray-500 font-semibold text-sm hover:bg-gray-50 transition-all shrink-0">← Back</button>
              <button
                onClick={handleCardPayment}
                disabled={isRedirecting || isBooking}
                className="flex-1 bg-[#F5B400] hover:bg-[#E5A000] disabled:opacity-60 text-[#071A2F] py-3.5 rounded-xl font-black text-sm transition-all flex items-center justify-center gap-2"
              >
                {isRedirecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
                {isRedirecting ? 'Preparing…' : `Pay £${quoteData.basePrice}`}
              </button>
              <button
                onClick={handleCashPayment}
                disabled={isBooking || isRedirecting}
                className="px-4 py-3.5 bg-gray-100 hover:bg-gray-200 disabled:opacity-60 rounded-xl font-bold text-sm text-gray-700 transition-all shrink-0 flex items-center gap-1.5"
              >
                {isBooking ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                Cash
              </button>
            </div>
          </div>
        )}

        {/* ── Booking confirmed ── */}
        {step === 3 && bookingConfirmed && (
          <div className="relative rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-600 to-green-700" />
            <div className="relative p-6 text-center">
              <div className="w-12 h-12 bg-white/15 rounded-xl flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-black text-white mb-1.5">Booking Confirmed!</h3>
              <p className="text-white/70 text-xs mb-4">A driver will be assigned shortly.</p>
              {bookingId && (
                <div className="inline-block bg-white/10 border border-white/20 rounded-lg px-4 py-2 mb-5">
                  <p className="text-white/50 text-[10px] uppercase tracking-widest mb-0.5">Reference</p>
                  <p className="text-white font-black font-mono tracking-widest text-sm">{bookingId.slice(0, 8).toUpperCase()}</p>
                </div>
              )}
              <button
                onClick={() => { setStep(1); setBookingConfirmed(false); setCollectionAddress(''); setDeliveryAddress(''); setQuoteData(null); }}
                className="text-white/80 text-xs font-semibold border border-white/20 hover:border-white/40 rounded-lg px-5 py-2 transition-all"
              >
                New booking
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );

  if (embedded) {
    return <div ref={bookingRef} className="w-full">{card}</div>;
  }

  return (
    <section ref={bookingRef} className="relative -mt-20 z-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {card}
      </div>
    </section>
  );
};

export default BookingWidget;
