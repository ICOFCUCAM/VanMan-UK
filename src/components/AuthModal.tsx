import React, { useState, useEffect, useRef } from 'react';
import { X, Eye, EyeOff, ChevronRight, Truck, User, Building2, ArrowLeft, Loader2 } from 'lucide-react';
import { signUp, signIn, signInWithProvider, resetPassword } from '@/services/auth';

type AccountType = 'personal' | 'driver' | 'business';
type ModalStep = 'select' | 'signup' | 'signin' | 'forgot' | 'reset-sent';

interface AuthModalProps {
  open: boolean;
  initialStep?: ModalStep;
  onClose: () => void;
  onNavigate: (page: string) => void;
}

const ACCOUNT_TYPES = [
  {
    id: 'personal' as AccountType,
    Icon: User,
    title: 'Personal Account',
    subtitle: 'Move home, student or furniture delivery',
  },
  {
    id: 'driver' as AccountType,
    Icon: Truck,
    title: 'Driver Account',
    subtitle: 'Start earning as a verified driver',
  },
  {
    id: 'business' as AccountType,
    Icon: Building2,
    title: 'Business Account',
    subtitle: 'Set up a corporate transport account',
  },
];

const AuthModal: React.FC<AuthModalProps> = ({ open, initialStep = 'select', onClose, onNavigate }) => {
  const [step, setStep] = useState<ModalStep>(initialStep);
  const [accountType, setAccountType] = useState<AccountType>('personal');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName]   = useState('');
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [forgotEmail, setForgotEmail] = useState('');

  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setStep(initialStep);
      setError('');
    }
  }, [open, initialStep]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!open) return null;

  const selectType = (type: AccountType) => {
    setAccountType(type);
    setStep('signup');
    setError('');
  };

  const handleSocialSignIn = async (provider: 'google' | 'apple') => {
    setError('');
    await signInWithProvider(provider);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) { setError('Please enter your full name.'); return; }
    setLoading(true);
    setError('');
    const { error: err } = await signUp({
      email,
      password,
      full_name: `${firstName.trim()} ${lastName.trim()}`,
    });
    setLoading(false);
    if (err) { setError(err.message); return; }
    onClose();
    if (accountType === 'driver')   onNavigate('driver-register');
    if (accountType === 'business') onNavigate('corporate');
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error: err } = await signIn({ email, password });
    setLoading(false);
    if (err) { setError(err.message); return; }
    onClose();
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error: err } = await resetPassword(forgotEmail);
    setLoading(false);
    if (err) { setError(err.message); return; }
    setStep('reset-sent');
  };

  const selectedType = ACCOUNT_TYPES.find(t => t.id === accountType)!;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(7,26,47,0.65)', backdropFilter: 'blur(4px)' }}
      onClick={e => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden relative">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* ── STEP: SELECT ACCOUNT TYPE ─────────────────────────────────── */}
        {step === 'select' && (
          <div className="p-6 pt-8">
            <div className="mb-6 pr-6">
              <h2 className="text-xl font-black text-[#0B2239] mb-1">Create an Account</h2>
              <p className="text-gray-500 text-sm">Choose the account type that suits you best</p>
            </div>

            <div className="space-y-2.5 mb-6">
              {ACCOUNT_TYPES.map(({ id, Icon, title, subtitle }) => (
                <button
                  key={id}
                  onClick={() => selectType(id)}
                  className="w-full flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-[#0E2A47]/30 hover:bg-[#0E2A47]/[0.02] transition-all text-left group"
                >
                  <div className="w-10 h-10 bg-[#0E2A47]/8 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-[#0E2A47]/12 transition-colors">
                    <Icon className="w-5 h-5 text-[#0E2A47]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[#0B2239] text-sm">{title}</p>
                    <p className="text-gray-400 text-xs mt-0.5">{subtitle}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#0E2A47] transition-colors shrink-0" />
                </button>
              ))}
            </div>

            <p className="text-center text-sm text-gray-500">
              Already have an account?{' '}
              <button onClick={() => { setStep('signin'); setError(''); }} className="text-[#0E2A47] font-semibold hover:underline">
                Sign In
              </button>
            </p>
          </div>
        )}

        {/* ── STEP: SIGN UP ─────────────────────────────────────────────── */}
        {step === 'signup' && (
          <div className="p-6 pt-8">
            <button
              onClick={() => { setStep('select'); setError(''); }}
              className="flex items-center gap-1.5 text-gray-400 hover:text-gray-600 text-xs font-medium mb-5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back
            </button>

            <div className="flex items-center gap-3 mb-5 pr-6">
              <div className="w-9 h-9 bg-[#0E2A47]/8 rounded-xl flex items-center justify-center shrink-0">
                <selectedType.Icon className="w-4.5 h-4.5 text-[#0E2A47]" />
              </div>
              <div>
                <h2 className="text-lg font-black text-[#0B2239] leading-tight">
                  {accountType === 'driver' ? 'Start Earning' : accountType === 'business' ? 'Set Up Corporate Account' : 'Create Account'}
                </h2>
                <p className="text-gray-400 text-xs">{selectedType.subtitle}</p>
              </div>
            </div>

            <div className="space-y-2.5 mb-4">
              <button
                onClick={() => handleSocialSignIn('google')}
                className="w-full flex items-center justify-center gap-3 border border-gray-200 hover:border-gray-300 rounded-xl py-2.5 text-sm font-semibold text-gray-700 transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>
              <button
                onClick={() => handleSocialSignIn('apple')}
                className="w-full flex items-center justify-center gap-3 bg-black hover:bg-gray-900 rounded-xl py-2.5 text-sm font-semibold text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                Continue with Apple
              </button>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400 font-medium">or</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {error && (
              <div className="mb-3 px-3.5 py-2.5 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleSignUp} className="space-y-2.5">
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <input
                    type="text"
                    placeholder="First name"
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    required
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-[#0E2A47]/40 transition-colors placeholder:text-gray-400"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Last name"
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    required
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-[#0E2A47]/40 transition-colors placeholder:text-gray-400"
                  />
                </div>
              </div>
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-[#0E2A47]/40 transition-colors placeholder:text-gray-400"
              />
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 pr-10 text-sm outline-none focus:border-[#0E2A47]/40 transition-colors placeholder:text-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#0E2A47] hover:bg-[#0F3558] text-white py-2.5 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {accountType === 'driver' ? 'Start as a Driver' : accountType === 'business' ? 'Set Up Business Account' : 'Create Account'}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-4">
              Already have an account?{' '}
              <button onClick={() => { setStep('signin'); setError(''); }} className="text-[#0E2A47] font-semibold hover:underline">
                Sign In
              </button>
            </p>
          </div>
        )}

        {/* ── STEP: SIGN IN ─────────────────────────────────────────────── */}
        {step === 'signin' && (
          <div className="p-6 pt-8">
            <div className="mb-5 pr-6">
              <h2 className="text-xl font-black text-[#0B2239] mb-1">Welcome Back</h2>
              <p className="text-gray-500 text-sm">Sign in to your Fast Man &amp; Van account</p>
            </div>

            <div className="space-y-2.5 mb-4">
              <button
                onClick={() => handleSocialSignIn('google')}
                className="w-full flex items-center justify-center gap-3 border border-gray-200 hover:border-gray-300 rounded-xl py-2.5 text-sm font-semibold text-gray-700 transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>
              <button
                onClick={() => handleSocialSignIn('apple')}
                className="w-full flex items-center justify-center gap-3 bg-black hover:bg-gray-900 rounded-xl py-2.5 text-sm font-semibold text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                Continue with Apple
              </button>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400 font-medium">or</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {error && (
              <div className="mb-3 px-3.5 py-2.5 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleSignIn} className="space-y-2.5">
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-[#0E2A47]/40 transition-colors placeholder:text-gray-400"
              />
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 pr-10 text-sm outline-none focus:border-[#0E2A47]/40 transition-colors placeholder:text-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <div className="text-right">
                <button
                  type="button"
                  onClick={() => { setForgotEmail(email); setStep('forgot'); setError(''); }}
                  className="text-xs text-[#0E2A47]/60 hover:text-[#0E2A47] transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#0E2A47] hover:bg-[#0F3558] text-white py-2.5 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                Sign In
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-4">
              Don&apos;t have an account?{' '}
              <button onClick={() => { setStep('select'); setError(''); }} className="text-[#0E2A47] font-semibold hover:underline">
                Sign Up
              </button>
            </p>
          </div>
        )}

        {/* ── STEP: FORGOT PASSWORD ─────────────────────────────────────── */}
        {step === 'forgot' && (
          <div className="p-6 pt-8">
            <button
              onClick={() => { setStep('signin'); setError(''); }}
              className="flex items-center gap-1.5 text-gray-400 hover:text-gray-600 text-xs font-medium mb-5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Sign In
            </button>
            <h2 className="text-xl font-black text-[#0B2239] mb-1 pr-6">Reset Password</h2>
            <p className="text-gray-500 text-sm mb-5">Enter your email and we'll send a reset link.</p>

            {error && (
              <div className="mb-3 px-3.5 py-2.5 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleForgot} className="space-y-3">
              <input
                type="email"
                placeholder="Email address"
                value={forgotEmail}
                onChange={e => setForgotEmail(e.target.value)}
                required
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-[#0E2A47]/40 transition-colors placeholder:text-gray-400"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#0E2A47] hover:bg-[#0F3558] text-white py-2.5 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                Send Reset Link
              </button>
            </form>
          </div>
        )}

        {/* ── STEP: RESET SENT ─────────────────────────────────────────── */}
        {step === 'reset-sent' && (
          <div className="p-6 pt-8 text-center">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-black text-[#0B2239] mb-2">Check Your Email</h2>
            <p className="text-gray-500 text-sm mb-6">
              We've sent a password reset link to <strong>{forgotEmail}</strong>
            </p>
            <button
              onClick={() => { setStep('signin'); setError(''); }}
              className="text-[#0E2A47] font-semibold text-sm hover:underline"
            >
              Back to Sign In
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default AuthModal;
