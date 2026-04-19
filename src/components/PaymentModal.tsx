import React, { useState, useEffect } from 'react';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { X, Lock, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';
import { stripePromise } from '@/lib/stripe';
import { createPaymentIntent } from '@/services/payments';

interface PaymentModalProps {
  amount: number;
  onSuccess: () => void;
  onClose: () => void;
}

const stripeAppearance = {
  theme: 'stripe' as const,
  variables: {
    colorPrimary: '#0E2A47',
    colorBackground: '#ffffff',
    colorText: '#1f2937',
    colorDanger: '#ef4444',
    borderRadius: '12px',
    fontSizeBase: '15px',
  },
};

const PaymentForm: React.FC<{ amount: number; onSuccess: () => void; onClose: () => void }> = ({
  amount, onSuccess, onClose,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setIsSubmitting(true);
    setError(null);

    const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: window.location.href },
      redirect: 'if_required',
    });

    if (confirmError) {
      setError(confirmError.message ?? 'Payment failed. Please try again.');
      setIsSubmitting(false);
      return;
    }

    if (paymentIntent?.status === 'succeeded') {
      onSuccess();
    } else {
      setError('Payment was not completed. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <PaymentElement options={{ layout: 'tabs' }} />

      {error && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <div className="flex gap-3 pt-1">
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="flex-1 py-3 border-2 border-gray-200 rounded-xl text-gray-600 font-semibold hover:border-gray-300 hover:bg-gray-50 transition-all disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || isSubmitting}
          className="flex-1 bg-[#0E2A47] hover:bg-[#0F3558] disabled:opacity-60 disabled:cursor-not-allowed text-white py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <><Loader2 className="w-5 h-5 animate-spin" /> Processing…</>
          ) : (
            <><Lock className="w-4 h-4" /> Pay £{amount}</>
          )}
        </button>
      </div>

      <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1">
        <Lock className="w-3 h-3" /> Secured by Stripe · 256-bit SSL encryption
      </p>
    </form>
  );
};

const PaymentModal: React.FC<PaymentModalProps> = ({ amount, onSuccess, onClose }) => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    createPaymentIntent(amount).then(({ clientSecret: cs, error }) => {
      if (error) setLoadError(error.message);
      else setClientSecret(cs);
    });
  }, [amount]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0E2A47] to-[#0F3558] px-6 py-5 flex items-center justify-between">
          <div>
            <h2 className="text-white font-bold text-lg">Secure Payment</h2>
            <p className="text-white/70 text-sm mt-0.5">FAST MAN & VAN</p>
          </div>
          <div className="text-right">
            <p className="text-white/60 text-xs">Amount due</p>
            <p className="text-[#F5B400] font-bold text-2xl">£{amount}</p>
          </div>
        </div>

        <div className="p-6">
          {loadError ? (
            <div className="text-center py-6">
              <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
              <p className="text-gray-700 font-semibold mb-1">Payment unavailable</p>
              <p className="text-gray-500 text-sm mb-4">{loadError}</p>
              <button onClick={onClose} className="text-[#0E2A47] font-semibold text-sm hover:underline">
                Go back
              </button>
            </div>
          ) : !clientSecret ? (
            <div className="flex flex-col items-center justify-center py-10 gap-3">
              <Loader2 className="w-8 h-8 text-[#0E2A47] animate-spin" />
              <p className="text-gray-500 text-sm">Setting up secure payment…</p>
            </div>
          ) : (
            <Elements stripe={stripePromise} options={{ clientSecret, appearance: stripeAppearance }}>
              <PaymentForm amount={amount} onSuccess={onSuccess} onClose={onClose} />
            </Elements>
          )}
        </div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default PaymentModal;
