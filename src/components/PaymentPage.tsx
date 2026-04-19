import React, { useState, useEffect } from 'react';
import {
  Lock, Shield, CheckCircle2, AlertCircle, Loader2, CreditCard,
  Building2, ArrowLeft, MapPin, Clock, Package, ChevronRight, Wallet, Banknote,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAppContext } from '@/contexts/AppContext';
import { createCheckoutSession } from '@/services/payments';
import { activateEscrowFallback } from '@/services/escrow';
import { COMMISSION } from '@/lib/constants';
import type { Booking } from '@/types';

interface PaymentPageProps {
  onNavigate: (page: string) => void;
}

const STEPS = [
  { label: 'Driver assigned within minutes', icon: Package },
  { label: 'Track your delivery in real time', icon: MapPin },
  { label: 'Confirm delivery when complete', icon: CheckCircle2 },
  { label: 'Funds released to driver', icon: Wallet },
];

const CASH_STEPS = [
  { label: 'Driver assigned within minutes', icon: Package },
  { label: 'Track your delivery in real time', icon: MapPin },
  { label: 'Pay remaining 70% in cash to your driver', icon: Banknote },
  { label: 'Confirm delivery once complete', icon: CheckCircle2 },
];

const PaymentPage: React.FC<PaymentPageProps> = ({ onNavigate }) => {
  const { user } = useAppContext();

  const [booking, setBooking]         = useState<Booking | null>(null);
  const [isLoading, setIsLoading]     = useState(true);
  const [isProcessing, setProcessing] = useState(false);
  const [error, setError]             = useState<string | null>(null);
  const [isSuccess, setIsSuccess]     = useState(false);
  const [method, setMethod]           = useState<'card' | 'invoice'>('card');

  useEffect(() => {
    const params        = new URLSearchParams(window.location.search);
    const urlBookingId  = params.get('booking_id');
    const storedId      = urlBookingId ?? sessionStorage.getItem('pending_payment_booking_id');

    if (params.get('payment') === 'success') {
      setIsSuccess(true);
      window.history.replaceState({}, '', window.location.pathname);
    }

    if (!storedId) {
      if (!user) { setIsLoading(false); return; }
      supabase
        .from('bookings')
        .select('*')
        .eq('customer_id', user.id)
        .eq('payment_status', 'pending')
        .in('payment_method', ['card', 'cash'])
        .order('created_at', { ascending: false })
        .limit(1)
        .single()
        .then(({ data }) => {
          if (data) setBooking(data as Booking);
          setIsLoading(false);
        });
      return;
    }

    supabase
      .from('bookings')
      .select('*')
      .eq('id', storedId)
      .single()
      .then(({ data }) => {
        if (data) {
          setBooking(data as Booking);
          if (data.payment_status === 'escrow' || data.payment_status === 'released') {
            setIsSuccess(true);
          }
        }
        setIsLoading(false);
      });
  }, [user]);

  const handlePay = async () => {
    if (!booking) return;
    setProcessing(true);
    setError(null);

    const isCash     = booking.payment_method === 'cash';
    const fullPrice  = booking.estimated_price;
    const chargeAmt  = isCash ? Math.round(fullPrice * COMMISSION.cashDeposit) : fullPrice;

    if (method === 'invoice') {
      const { error: err } = await supabase
        .from('bookings')
        .update({ payment_status: 'invoice_pending', payment_provider: 'invoice' })
        .eq('id', booking.id);
      if (err) { setError(err.message); setProcessing(false); return; }
      setIsSuccess(true);
      setProcessing(false);
      return;
    }

    const origin     = window.location.origin;
    const successUrl = `${origin}?payment=success&booking_id=${booking.id}`;
    const cancelUrl  = `${origin}?payment=cancelled&booking_id=${booking.id}`;

    const { url, error: payErr } = await createCheckoutSession(
      chargeAmt,
      isCash
        ? `30% deposit — Man & Van — ${booking.collection_address.split(',')[0]} → ${booking.delivery_address.split(',')[0]}`
        : `Man & Van — ${booking.collection_address.split(',')[0]} → ${booking.delivery_address.split(',')[0]}`,
      successUrl,
      cancelUrl,
      user?.email,
      booking.id,
    );

    if (payErr || !url) {
      // Dev fallback
      const { error: escrowErr } = await activateEscrowFallback(booking.id, chargeAmt);
      if (escrowErr) {
        setError(escrowErr.message || 'Payment could not be started. Please try again.');
        setProcessing(false);
        return;
      }
      sessionStorage.removeItem('pending_payment_booking_id');
      setIsSuccess(true);
      setProcessing(false);
      return;
    }

    sessionStorage.removeItem('pending_payment_booking_id');
    window.location.href = url;
  };

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20">
        <Loader2 className="w-8 h-8 text-[#0A2463] animate-spin" />
      </div>
    );
  }

  // ── Success ──────────────────────────────────────────────────────────────────
  if (isSuccess && booking) {
    const isCash     = booking.payment_method === 'cash';
    const isInvoice  = method === 'invoice' || booking.payment_status === 'invoice_pending';
    const fullPrice  = booking.estimated_price;
    const depositAmt = Math.round(fullPrice * COMMISSION.cashDeposit);
    const cashAmt    = fullPrice - depositAmt;
    const earning    = booking.driver_earning ?? fullPrice * 0.80;

    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A2463] via-[#1B3A8C] to-[#0A2463] flex items-center justify-center p-4 pt-24">
        <div className="w-full max-w-lg">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-8 text-center">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                {isCash ? <Banknote className="w-10 h-10 text-white" /> : <CheckCircle2 className="w-10 h-10 text-white" />}
              </div>
              <h1 className="text-white font-bold text-2xl mb-1">
                {isInvoice ? 'Invoice Confirmed' : isCash ? 'Deposit Secured' : 'Payment Secured'}
              </h1>
              <p className="text-white/80 text-sm">
                {isInvoice
                  ? 'Added to your monthly invoice'
                  : isCash
                  ? '30% deposit held securely · Pay 70% cash to driver'
                  : 'Your funds are held securely in escrow'}
              </p>
            </div>

            <div className="p-8">
              {isCash ? (
                <div className="mb-6 space-y-3">
                  <div className="flex items-center justify-between bg-green-50 rounded-xl px-4 py-3">
                    <div>
                      <p className="text-xs text-green-600 font-medium">Deposit paid online</p>
                      <p className="text-sm text-green-700">30% platform fee — secured</p>
                    </div>
                    <p className="text-xl font-bold text-green-700">£{depositAmt}</p>
                  </div>
                  <div className="flex items-center justify-between bg-blue-50 rounded-xl px-4 py-3">
                    <div>
                      <p className="text-xs text-blue-600 font-medium">Due to driver in cash</p>
                      <p className="text-sm text-blue-700">70% — pay on delivery</p>
                    </div>
                    <p className="text-xl font-bold text-blue-700">£{cashAmt}</p>
                  </div>
                  <div className="flex items-center justify-between border border-gray-100 rounded-xl px-4 py-3">
                    <p className="text-sm font-semibold text-gray-600">Total job value</p>
                    <p className="text-xl font-bold text-[#0A2463]">£{fullPrice}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center mb-6">
                  <p className="text-gray-500 text-sm mb-1">
                    {isInvoice ? 'Amount due on invoice' : 'Amount secured in escrow'}
                  </p>
                  <p className="text-4xl font-bold text-[#0A2463]">£{fullPrice.toLocaleString()}</p>
                  {!isInvoice && (
                    <p className="text-gray-400 text-xs mt-1">
                      Driver will receive £{earning.toFixed(2)} on confirmed delivery
                    </p>
                  )}
                </div>
              )}

              <div className="bg-gray-50 rounded-xl p-4 mb-6 text-center">
                <p className="text-gray-500 text-xs mb-1">Booking Reference</p>
                <p className="font-mono font-bold text-gray-900 text-lg">
                  {booking.booking_ref ?? booking.id.slice(0, 8).toUpperCase()}
                </p>
              </div>

              <div className="mb-6">
                <p className="text-sm font-semibold text-gray-700 mb-3">What happens next</p>
                <div className="space-y-3">
                  {(isCash ? CASH_STEPS : STEPS).map((step, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#0A2463]/10 rounded-full flex items-center justify-center shrink-0">
                        <step.icon className="w-4 h-4 text-[#0A2463]" />
                      </div>
                      <p className="text-sm text-gray-600">{step.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => onNavigate('tracking')}
                  className="flex-1 bg-[#0A2463] hover:bg-[#1B3A8C] text-white py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <MapPin className="w-4 h-4" /> Track Delivery
                </button>
                <button
                  onClick={() => onNavigate('customer-dashboard')}
                  className="flex-1 border-2 border-gray-200 hover:border-gray-300 text-gray-700 py-3 rounded-xl font-semibold transition-colors text-sm"
                >
                  My Bookings
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── No booking found ──────────────────────────────────────────────────────────
  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center p-4">
        <div className="text-center max-w-sm">
          <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">No pending payment</h2>
          <p className="text-gray-500 text-sm mb-6">We couldn't find a booking awaiting payment.</p>
          <button onClick={() => onNavigate('home')} className="bg-[#0A2463] text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#1B3A8C] transition-colors">
            Book a Van
          </button>
        </div>
      </div>
    );
  }

  // ── Payment form ─────────────────────────────────────────────────────────────
  const isCash      = booking.payment_method === 'cash';
  const fullPrice   = booking.estimated_price;
  const depositAmt  = Math.round(fullPrice * COMMISSION.cashDeposit);
  const cashAmt     = fullPrice - depositAmt;
  const chargeLabel = isCash ? depositAmt : fullPrice;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A2463] via-[#1B3A8C] to-[#061539] flex items-center justify-center p-4 pt-24">
      <div className="w-full max-w-lg">
        <button
          onClick={() => onNavigate('customer-dashboard')}
          className="flex items-center gap-2 text-white/60 hover:text-white mb-6 text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to bookings
        </button>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#0A2463] to-[#1B3A8C] px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                  <Lock className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <div>
                  <p className="text-white font-bold text-lg leading-none">
                    {isCash ? 'Cash Booking Deposit' : 'Secure Checkout'}
                  </p>
                  <p className="text-white/50 text-xs mt-0.5">FAST MAN & VAN</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white/50 text-xs">{isCash ? 'Deposit due now' : 'Total due'}</p>
                <p className="text-[#D4AF37] font-bold text-2xl">£{chargeLabel.toLocaleString()}</p>
                {isCash && (
                  <p className="text-white/40 text-xs">of £{fullPrice} total</p>
                )}
              </div>
            </div>
          </div>

          <div className="p-6 space-y-5">
            {/* Booking Summary */}
            <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Booking Summary</p>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 shrink-0" />
                <p className="text-sm text-gray-700 leading-snug">{booking.collection_address}</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-1.5 shrink-0" />
                <p className="text-sm text-gray-700 leading-snug">{booking.delivery_address}</p>
              </div>
              <div className="flex items-center gap-4 pt-1">
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <Package className="w-3.5 h-3.5" /> {booking.vehicle_type}
                </span>
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <MapPin className="w-3.5 h-3.5" /> {booking.distance_miles} mi
                </span>
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="w-3.5 h-3.5" /> {booking.duration}
                </span>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="rounded-2xl border border-gray-100 overflow-hidden">
              <div className="divide-y divide-gray-50">
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="text-sm text-gray-600">Total service price</span>
                  <span className="font-semibold text-gray-900">£{fullPrice.toLocaleString()}</span>
                </div>
                {isCash ? (
                  <>
                    <div className="flex items-center justify-between px-4 py-3">
                      <span className="text-sm text-gray-600 flex items-center gap-1.5">
                        <Shield className="w-3.5 h-3.5 text-[#0A2463]" />
                        Platform deposit (30% — due now)
                      </span>
                      <span className="font-semibold text-[#0A2463]">£{depositAmt}</span>
                    </div>
                    <div className="flex items-center justify-between px-4 py-3">
                      <span className="text-sm text-gray-600 flex items-center gap-1.5">
                        <Banknote className="w-3.5 h-3.5 text-green-600" />
                        Cash to driver on delivery (70%)
                      </span>
                      <span className="font-semibold text-green-700">£{cashAmt}</span>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-between px-4 py-3">
                    <span className="text-sm text-gray-600 flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-green-500" />
                      Escrow protection
                    </span>
                    <span className="text-sm font-medium text-green-600">Included</span>
                  </div>
                )}
              </div>
              <div className="bg-[#0A2463] px-4 py-3 flex items-center justify-between">
                <span className="text-white font-semibold">
                  {isCash ? 'Due online now' : 'Total'}
                </span>
                <span className="text-[#D4AF37] font-bold text-lg">£{chargeLabel.toLocaleString()}</span>
              </div>
            </div>

            {/* Cash info banner */}
            {isCash && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-start gap-3">
                <Banknote className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                <p className="text-amber-800 text-xs leading-relaxed">
                  <strong>Cash booking:</strong> Pay the £{depositAmt} deposit online now to confirm your booking.
                  Your driver will collect the remaining <strong>£{cashAmt} in cash</strong> upon delivery.
                </p>
              </div>
            )}

            {/* Payment Method — only show for non-cash or if corporate invoice available */}
            {(!isCash || booking.corporate_account_id) && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Payment Method</p>
                {!isCash && (
                  <button
                    onClick={() => setMethod('card')}
                    className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                      method === 'card' ? 'border-[#0A2463] bg-[#0A2463]/5' : 'border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${method === 'card' ? 'bg-[#0A2463]' : 'bg-gray-100'}`}>
                      <CreditCard className={`w-5 h-5 ${method === 'card' ? 'text-white' : 'text-gray-400'}`} />
                    </div>
                    <div className="text-left flex-1">
                      <p className={`font-semibold text-sm ${method === 'card' ? 'text-[#0A2463]' : 'text-gray-700'}`}>
                        Card / Google Pay / Apple Pay
                      </p>
                      <p className="text-gray-400 text-xs">Powered by Stripe · All cards accepted</p>
                    </div>
                    {method === 'card' && <CheckCircle2 className="w-5 h-5 text-[#0A2463] shrink-0" />}
                  </button>
                )}

                {booking.corporate_account_id && (
                  <button
                    onClick={() => setMethod('invoice')}
                    className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                      method === 'invoice' ? 'border-[#D4AF37] bg-[#D4AF37]/5' : 'border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${method === 'invoice' ? 'bg-[#D4AF37]' : 'bg-gray-100'}`}>
                      <Building2 className={`w-5 h-5 ${method === 'invoice' ? 'text-[#0A2463]' : 'text-gray-400'}`} />
                    </div>
                    <div className="text-left flex-1">
                      <p className={`font-semibold text-sm ${method === 'invoice' ? 'text-[#0A2463]' : 'text-gray-700'}`}>
                        Corporate Invoice
                      </p>
                      <p className="text-gray-400 text-xs">Added to your monthly consolidated invoice</p>
                    </div>
                    {method === 'invoice' && <CheckCircle2 className="w-5 h-5 text-[#D4AF37] shrink-0" />}
                  </button>
                )}
              </div>
            )}

            {error && (
              <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {/* Pay button */}
            <button
              onClick={handlePay}
              disabled={isProcessing}
              className="w-full bg-[#D4AF37] hover:bg-[#C5A028] disabled:opacity-60 disabled:cursor-not-allowed text-[#0A2463] py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3 shadow-lg shadow-[#D4AF37]/20"
            >
              {isProcessing ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Processing…</>
              ) : isCash ? (
                <><Lock className="w-5 h-5" /> Pay deposit £{depositAmt}<ChevronRight className="w-5 h-5" /></>
              ) : (
                <><Lock className="w-5 h-5" /> Pay £{fullPrice.toLocaleString()}<ChevronRight className="w-5 h-5" /></>
              )}
            </button>

            {/* Trust signals */}
            <div className="text-center space-y-1.5 pt-1">
              <p className="text-xs text-gray-400 flex items-center justify-center gap-1.5">
                <Lock className="w-3 h-3" /> 256-bit SSL encryption · Secured by Stripe
              </p>
              <p className="text-xs text-gray-400 flex items-center justify-center gap-1.5">
                <Shield className="w-3 h-3 text-green-500" />
                {isCash
                  ? '30% deposit held securely · 70% paid to driver in cash'
                  : 'Payment held in escrow until delivery is confirmed'}
              </p>
            </div>
          </div>
        </div>

        <p className="text-center text-white/30 text-xs mt-4">
          Ref: {booking.booking_ref ?? booking.id.slice(0, 8).toUpperCase()}
        </p>
      </div>
    </div>
  );
};

export default PaymentPage;
