import React, { useState, useEffect } from 'react';
import { Truck, Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, GraduationCap, AlertCircle, Loader2, Shield, Star, CheckCircle, Users } from 'lucide-react';
import { signIn, signUp, resetPassword, signInWithProvider, resendVerificationEmail } from '@/services/auth';
import { useAppContext } from '@/contexts/AppContext';

interface LoginPageProps {
  onNavigate: (page: string) => void;
  initialSignup?: boolean;
}

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const trustPoints = [
  { icon: Shield, text: 'Fully insured & GDPR compliant' },
  { icon: Star, text: '4.9★ rated by 12,000+ customers' },
  { icon: Users, text: '10,000+ verified drivers UK-wide' },
  { icon: CheckCircle, text: 'Secure encrypted payments' },
];

const LoginPage: React.FC<LoginPageProps> = ({ onNavigate, initialSignup = false }) => {
  const { user, role, isLoading: authLoading } = useAppContext();

  const [isSignup, setIsSignup] = useState(initialSignup);
  const [forgotMode, setForgotMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isStudent, setIsStudent] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [awaitingAuth, setAwaitingAuth] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);
  const [resendSent, setResendSent] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [socialLoading, setSocialLoading] = useState<'google' | 'apple' | null>(null);

  const redirectByRole = (r: typeof role) => {
    if (r === 'admin') onNavigate('admin');
    else if (r === 'driver') onNavigate('driver-marketplace');
    else onNavigate('home');
  };

  useEffect(() => {
    if (!awaitingAuth || authLoading) return;
    if (user) redirectByRole(role);
  }, [awaitingAuth, authLoading, user, role]);

  useEffect(() => {
    if (!authLoading && user) redirectByRole(role);
  }, []);

  const validate = () => {
    if (!validateEmail(email)) return 'Please enter a valid email address.';
    if (password.length < 8) return 'Password must be at least 8 characters.';
    if (isSignup && name.trim().length < 2) return 'Please enter your full name.';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const err = validate();
    if (err) { setError(err); return; }
    setIsSubmitting(true);

    if (isSignup) {
      const { error: err } = await signUp({ email, password, full_name: name, phone: phone || undefined, is_student: isStudent });
      if (err) { setError(err.message); setIsSubmitting(false); return; }
    } else {
      const { error: err } = await signIn({ email, password });
      if (err) {
        setError(err.message.includes('Invalid login') ? 'Incorrect email or password.' : err.message);
        setIsSubmitting(false);
        return;
      }
    }

    setIsSubmitting(false);
    setAwaitingAuth(true);
  };

  const handleSocialSignIn = async (provider: 'google' | 'apple') => {
    setError(null);
    setSocialLoading(provider);
    const { error: err } = await signInWithProvider(provider);
    if (err) { setError(err.message); setSocialLoading(null); }
  };

  const handleResendVerification = async () => {
    if (!email || isResending) return;
    setIsResending(true);
    const { error: err } = await resendVerificationEmail(email);
    setIsResending(false);
    if (err) { setError(err.message); return; }
    setResendSent(true);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!validateEmail(email)) { setError('Please enter a valid email address.'); return; }
    setIsSubmitting(true);
    const { error: err } = await resetPassword(email);
    setIsSubmitting(false);
    if (err) { setError(err.message); return; }
    setResetSent(true);
  };

  if (awaitingAuth && (isSubmitting || authLoading)) {
    return (
      <div className="min-h-screen bg-[#071A2F] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-white/8 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/10">
            <Loader2 className="w-8 h-8 text-[#F5B400] animate-spin" />
          </div>
          <h2 className="text-xl font-black text-white mb-1">Signing you in…</h2>
          <p className="text-white/40 text-sm">Just a moment</p>
        </div>
      </div>
    );
  }

  if (resetSent) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-10 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <Mail className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">Check your inbox</h2>
            <p className="text-gray-500 text-sm mb-8 leading-relaxed">We've sent a password reset link to <strong className="text-gray-700">{email}</strong>.</p>
            <button
              onClick={() => { setResetSent(false); setForgotMode(false); }}
              className="w-full bg-[#0E2A47] hover:bg-[#0F3558] text-white py-3.5 rounded-2xl font-bold transition-colors"
            >
              Back to sign in
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">

      {/* Left panel — brand / trust */}
      <div className="hidden lg:flex lg:w-[46%] xl:w-[42%] bg-[#071A2F] flex-col relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'radial-gradient(circle at 20% 80%, #F5B400 0%, transparent 55%), radial-gradient(circle at 80% 20%, #0E2A47 0%, transparent 50%)' }} />
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#0E2A47] rounded-full blur-3xl opacity-60 -translate-y-1/3 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#F5B400]/8 rounded-full blur-3xl" />

        {/* Mesh grid */}
        <div className="absolute inset-0 opacity-[0.035]" style={{ backgroundImage: 'linear-gradient(rgba(212,175,55,1) 1px,transparent 1px),linear-gradient(90deg,rgba(212,175,55,1) 1px,transparent 1px)', backgroundSize: '40px 40px' }} />

        <div className="relative z-10 flex flex-col h-full px-10 py-10">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-auto">
            <div className="w-11 h-11 bg-[#F5B400] rounded-xl flex items-center justify-center shadow-lg shadow-[#F5B400]/30">
              <Truck className="w-6 h-6 text-[#071A2F]" />
            </div>
            <div>
              <p className="font-black text-white text-sm tracking-wide">FAST MAN & VAN</p>
              <p className="text-white/30 text-[9px] tracking-widest uppercase">Reliable Transport · UK Wide</p>
            </div>
          </div>

          {/* Main copy */}
          <div className="my-auto">
            <h1 className="text-4xl xl:text-5xl font-black text-white leading-tight mb-6">
              Move anything,<br />
              <span className="text-[#F5B400]">anywhere.</span>
            </h1>
            <p className="text-white/50 text-lg leading-relaxed mb-10 max-w-sm">
              Join thousands of customers and independent drivers on the UK's fastest growing van logistics platform.
            </p>

            {/* Trust points */}
            <div className="space-y-4">
              {trustPoints.map((tp, i) => (
                <div key={i} className="flex items-center gap-3.5">
                  <div className="w-9 h-9 bg-[#F5B400]/10 border border-[#F5B400]/20 rounded-xl flex items-center justify-center shrink-0">
                    <tp.icon className="w-4 h-4 text-[#F5B400]" />
                  </div>
                  <span className="text-white/65 text-sm font-medium">{tp.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom testimonial */}
          <div className="bg-white/5 border border-white/8 rounded-2xl p-5 mt-auto">
            <div className="flex gap-0.5 mb-3">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 text-[#F5B400] fill-[#F5B400]" />)}
            </div>
            <p className="text-white/70 text-sm leading-relaxed italic mb-3">"Incredibly fast and professional. The driver arrived early and handled everything carefully. Would use again in a heartbeat."</p>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-[#F5B400] rounded-full flex items-center justify-center">
                <span className="text-[#071A2F] text-xs font-black">SH</span>
              </div>
              <div>
                <p className="text-white/80 text-xs font-bold">Sarah H.</p>
                <p className="text-white/35 text-xs">London, verified customer</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 bg-gray-50 flex flex-col">
        {/* Mobile back button */}
        <div className="lg:hidden px-6 pt-6">
          <button onClick={() => onNavigate('home')} className="flex items-center gap-2 text-[#0E2A47] font-semibold text-sm hover:text-[#0F3558] transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </button>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 py-10">
          <div className="w-full max-w-md">

            {/* Mobile logo */}
            <div className="lg:hidden flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-[#0E2A47] rounded-xl flex items-center justify-center">
                <Truck className="w-5 h-5 text-[#F5B400]" />
              </div>
              <p className="font-black text-[#0E2A47]">FAST MAN & VAN</p>
            </div>

            {/* Desktop back button */}
            <div className="hidden lg:block mb-8">
              <button onClick={() => onNavigate('home')} className="flex items-center gap-2 text-gray-400 font-medium text-sm hover:text-gray-600 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to Home
              </button>
            </div>

            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
              {/* Header */}
              <div className="mb-7">
                <h1 className="text-2xl font-black text-gray-900">
                  {forgotMode ? 'Reset Password' : isSignup ? 'Create Account' : 'Welcome back'}
                </h1>
                <p className="text-gray-400 text-sm mt-1.5">
                  {forgotMode ? 'Enter your email to receive a reset link' : isSignup ? 'Join Fast Man & Van for free' : 'Sign in to your account to continue'}
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3.5 mb-5">
                  <div className="flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                    <p className="text-red-700 text-sm font-medium">{error}</p>
                  </div>
                  {error.toLowerCase().includes('email') && error.toLowerCase().includes('confirm') && (
                    <div className="mt-2.5 pl-6">
                      {resendSent ? (
                        <p className="text-green-600 text-xs font-semibold flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" /> Verification email sent — check your inbox.
                        </p>
                      ) : (
                        <button
                          onClick={handleResendVerification}
                          disabled={isResending || !email}
                          className="text-xs font-bold text-[#0E2A47] underline underline-offset-2 hover:text-[#0F3558] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                        >
                          {isResending ? <><Loader2 className="w-3 h-3 animate-spin" /> Sending…</> : 'Resend verification email'}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Social sign-in */}
              {!forgotMode && (
                <>
                  <div className="grid grid-cols-2 gap-3 mb-5">
                    <button
                      type="button"
                      onClick={() => handleSocialSignIn('google')}
                      disabled={!!socialLoading}
                      className="flex items-center justify-center gap-2.5 px-4 py-3 border-2 border-gray-200 rounded-2xl hover:border-gray-300 hover:bg-gray-50 transition-all disabled:opacity-60 disabled:cursor-not-allowed font-semibold text-gray-700 text-sm"
                    >
                      {socialLoading === 'google' ? (
                        <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                      ) : (
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                      )}
                      Continue with Google
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSocialSignIn('apple')}
                      disabled={!!socialLoading}
                      className="flex items-center justify-center gap-2.5 px-4 py-3 border-2 border-gray-200 rounded-2xl hover:border-gray-300 hover:bg-gray-50 transition-all disabled:opacity-60 disabled:cursor-not-allowed font-semibold text-gray-700 text-sm"
                    >
                      {socialLoading === 'apple' ? (
                        <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                      ) : (
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.4c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.32 2.99-2.54 3.99zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                        </svg>
                      )}
                      Continue with Apple
                    </button>
                  </div>

                  <div className="flex items-center gap-3 mb-5">
                    <div className="flex-1 h-px bg-gray-100" />
                    <span className="text-xs text-gray-400 font-semibold">or with email</span>
                    <div className="flex-1 h-px bg-gray-100" />
                  </div>
                </>
              )}

              {/* Forgot password form */}
              {forgotMode ? (
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div>
                    <label className="block text-xs font-black text-gray-500 tracking-widest uppercase mb-2">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com"
                        className="w-full pl-10 pr-4 py-3.5 border-2 border-gray-200 rounded-2xl focus:border-[#0E2A47] focus:ring-4 focus:ring-[#0E2A47]/8 outline-none transition-all text-sm" />
                    </div>
                  </div>
                  <button type="submit" disabled={isSubmitting}
                    className="w-full bg-[#0E2A47] hover:bg-[#0F3558] disabled:opacity-60 text-white py-4 rounded-2xl font-black text-sm transition-colors flex items-center justify-center gap-2">
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send Reset Link'}
                  </button>
                  <button type="button" onClick={() => setForgotMode(false)} className="w-full text-center text-[#0E2A47] text-sm font-semibold hover:underline py-2">
                    Back to sign in
                  </button>
                </form>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {isSignup && (
                    <div>
                      <label className="block text-xs font-black text-gray-500 tracking-widest uppercase mb-2">Full Name</label>
                      <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="John Smith"
                        className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-2xl focus:border-[#0E2A47] focus:ring-4 focus:ring-[#0E2A47]/8 outline-none transition-all text-sm" />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-black text-gray-500 tracking-widest uppercase mb-2">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com"
                        className="w-full pl-10 pr-4 py-3.5 border-2 border-gray-200 rounded-2xl focus:border-[#0E2A47] focus:ring-4 focus:ring-[#0E2A47]/8 outline-none transition-all text-sm" />
                    </div>
                  </div>

                  {isSignup && (
                    <div>
                      <label className="block text-xs font-black text-gray-500 tracking-widest uppercase mb-2">Phone <span className="text-gray-350 normal-case font-normal">(optional)</span></label>
                      <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+44 7xxx xxx xxx"
                        className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-2xl focus:border-[#0E2A47] focus:ring-4 focus:ring-[#0E2A47]/8 outline-none transition-all text-sm" />
                    </div>
                  )}

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-xs font-black text-gray-500 tracking-widest uppercase">Password</label>
                      {!isSignup && (
                        <button type="button" onClick={() => setForgotMode(true)} className="text-xs text-[#0E2A47] font-semibold hover:underline">
                          Forgot password?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                        placeholder={isSignup ? 'Min. 8 characters' : 'Enter your password'}
                        className="w-full pl-10 pr-11 py-3.5 border-2 border-gray-200 rounded-2xl focus:border-[#0E2A47] focus:ring-4 focus:ring-[#0E2A47]/8 outline-none transition-all text-sm" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {isSignup && (
                    <label className="flex items-center gap-3 p-4 bg-[#0E2A47]/5 border-2 border-[#0E2A47]/10 rounded-2xl cursor-pointer hover:border-[#0E2A47]/25 transition-colors">
                      <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all ${isStudent ? 'bg-[#0E2A47] border-[#0E2A47]' : 'border-gray-300'}`}>
                        {isStudent && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                      </div>
                      <input type="checkbox" checked={isStudent} onChange={e => setIsStudent(e.target.checked)} className="sr-only" />
                      <GraduationCap className="w-4 h-4 text-[#0E2A47] shrink-0" />
                      <div>
                        <p className="text-sm font-bold text-gray-800">I'm a student</p>
                        <p className="text-xs text-[#F5B400] font-semibold">10% discount on all bookings</p>
                      </div>
                    </label>
                  )}

                  <button type="submit" disabled={isSubmitting}
                    className="w-full bg-[#0E2A47] hover:bg-[#0F3558] disabled:opacity-60 disabled:cursor-not-allowed text-white py-4 rounded-2xl font-black transition-all hover:shadow-xl hover:shadow-[#0E2A47]/25 flex items-center justify-center gap-2.5 text-base mt-2">
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <>{isSignup ? 'Create Account' : 'Sign In'} <ArrowRight className="w-5 h-5" /></>}
                  </button>
                </form>
              )}

              {!forgotMode && (
                <div className="mt-6 space-y-3 text-center border-t border-gray-100 pt-5">
                  <button onClick={() => { setIsSignup(!isSignup); setError(null); }} className="text-[#0E2A47] text-sm font-semibold hover:underline block w-full transition-colors">
                    {isSignup ? 'Already have an account? Sign in' : "Don't have an account? Sign up free"}
                  </button>
                  {!isSignup && (
                    <button onClick={() => onNavigate('driver-register')} className="flex items-center justify-center gap-2 w-full text-gray-400 hover:text-[#F5B400] text-sm font-medium transition-colors">
                      <Truck className="w-4 h-4" /> Want to become a driver?
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
