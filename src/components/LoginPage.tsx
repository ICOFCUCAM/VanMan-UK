import React, { useState, useEffect } from 'react';
import { Truck, Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, GraduationCap, AlertCircle, Loader2 } from 'lucide-react';
import { signIn, signUp, resetPassword, signInWithProvider } from '@/services/auth';
import { useAppContext } from '@/contexts/AppContext';

interface LoginPageProps {
  onNavigate: (page: string) => void;
}

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const { user, role, isLoading: authLoading } = useAppContext();

  const [isSignup, setIsSignup] = useState(false);
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
  const [socialLoading, setSocialLoading] = useState<'google' | 'apple' | null>(null);

  const redirectByRole = (r: typeof role) => {
    if (r === 'admin') onNavigate('admin');
    else if (r === 'driver') onNavigate('driver-marketplace');
    else onNavigate('home');
  };

  // Once login completes and auth state resolves, redirect by role
  useEffect(() => {
    if (!awaitingAuth || authLoading) return;
    if (user) redirectByRole(role);
  }, [awaitingAuth, authLoading, user, role]);

  // Already logged in — redirect immediately
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

  // Awaiting auth resolution
  if (awaitingAuth && (isSubmitting || authLoading)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-[#0A2463]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Loader2 className="w-8 h-8 text-[#0A2463] animate-spin" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">Signing you in…</h2>
          <p className="text-gray-500 text-sm">Just a moment</p>
        </div>
      </div>
    );
  }

  // Password reset sent
  if (resetSent) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-16 flex items-center justify-center">
        <div className="max-w-md w-full mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-6 h-6 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Check your inbox</h2>
            <p className="text-gray-500 text-sm mb-6">We've sent a password reset link to <strong>{email}</strong>.</p>
            <button onClick={() => { setResetSent(false); setForgotMode(false); }} className="text-[#0A2463] font-semibold text-sm hover:underline">
              Back to sign in
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-md mx-auto px-4">
        <button onClick={() => onNavigate('home')} className="flex items-center gap-2 text-[#0A2463] font-medium mb-6 hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>

        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-14 h-14 bg-[#0A2463] rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Truck className="w-7 h-7 text-[#D4AF37]" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              {forgotMode ? 'Reset Password' : isSignup ? 'Create Account' : 'Welcome Back'}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {forgotMode ? 'Enter your email to receive a reset link' : isSignup ? 'Join Fast Man & Van' : 'Sign in to your account'}
            </p>
          </div>

          {error && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4">
              <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Social sign-in */}
          {!forgotMode && (
            <>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <button
                  type="button"
                  onClick={() => handleSocialSignIn('google')}
                  disabled={!!socialLoading}
                  className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {socialLoading === 'google' ? (
                    <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                  ) : (
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  )}
                  <span className="text-sm font-semibold text-gray-700">Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSocialSignIn('apple')}
                  disabled={!!socialLoading}
                  className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {socialLoading === 'apple' ? (
                    <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                  ) : (
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.4c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.32 2.99-2.54 3.99zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                    </svg>
                  )}
                  <span className="text-sm font-semibold text-gray-700">Apple</span>
                </button>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400 font-medium">or continue with email</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>
            </>
          )}

          {/* Forgot password */}
          {forgotMode ? (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0A2463] focus:ring-2 focus:ring-[#0A2463]/10 outline-none transition-all" />
                </div>
              </div>
              <button type="submit" disabled={isSubmitting}
                className="w-full bg-[#0A2463] hover:bg-[#1B3A8C] disabled:opacity-60 text-white py-3.5 rounded-xl font-bold transition-colors flex items-center justify-center gap-2">
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send Reset Link'}
              </button>
              <button type="button" onClick={() => setForgotMode(false)} className="w-full text-center text-[#0A2463] text-sm font-medium hover:underline">
                Back to sign in
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignup && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="John Smith"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0A2463] focus:ring-2 focus:ring-[#0A2463]/10 outline-none transition-all" />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0A2463] focus:ring-2 focus:ring-[#0A2463]/10 outline-none transition-all" />
                </div>
              </div>

              {isSignup && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number <span className="text-gray-400 font-normal">(optional)</span></label>
                  <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+44 7xxx xxx xxx"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0A2463] focus:ring-2 focus:ring-[#0A2463]/10 outline-none transition-all" />
                </div>
              )}

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  {!isSignup && (
                    <button type="button" onClick={() => setForgotMode(true)} className="text-xs text-[#0A2463] hover:underline">
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                    placeholder={isSignup ? 'Min. 8 characters' : 'Enter your password'}
                    className="w-full pl-10 pr-10 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0A2463] focus:ring-2 focus:ring-[#0A2463]/10 outline-none transition-all" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {isSignup && (
                <label className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl cursor-pointer">
                  <input type="checkbox" checked={isStudent} onChange={e => setIsStudent(e.target.checked)} className="w-5 h-5 rounded text-purple-600" />
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-purple-600" />
                    <span className="text-sm text-gray-700">I'm a student (10% discount on all bookings)</span>
                  </div>
                </label>
              )}

              <button type="submit" disabled={isSubmitting}
                className="w-full bg-[#0A2463] hover:bg-[#1B3A8C] disabled:opacity-60 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-bold text-lg transition-colors flex items-center justify-center gap-2">
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <>{isSignup ? 'Create Account' : 'Sign In'} <ArrowRight className="w-5 h-5" /></>}
              </button>
            </form>
          )}

          {!forgotMode && (
            <div className="mt-6 space-y-3 text-center">
              <button onClick={() => { setIsSignup(!isSignup); setError(null); }} className="text-[#0A2463] text-sm font-medium hover:underline block w-full">
                {isSignup ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
              </button>
              {!isSignup && (
                <button onClick={() => onNavigate('driver-register')} className="flex items-center justify-center gap-2 w-full text-[#D4AF37] text-sm font-medium hover:underline">
                  <Truck className="w-4 h-4" /> Want to become a driver? Apply here
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
