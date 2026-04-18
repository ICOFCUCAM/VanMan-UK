import React, { useState, useEffect } from 'react';
import { Truck, Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, GraduationCap, AlertCircle, Loader2 } from 'lucide-react';
import { signIn, signUp, resetPassword } from '@/services/auth';
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
