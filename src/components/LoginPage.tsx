import React, { useState } from 'react';
import { User, Truck, Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, GraduationCap } from 'lucide-react';

interface LoginPageProps {
  type: 'customer' | 'driver';
  onNavigate: (page: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ type, onNavigate }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isStudent, setIsStudent] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      setLoginSuccess(true);
      setTimeout(() => {
        if (type === 'driver') {
          onNavigate('driver-marketplace');
        } else {
          onNavigate('home');
        }
      }, 1500);
    }
  };

  if (loginSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
            {type === 'driver' ? <Truck className="w-8 h-8 text-green-500" /> : <User className="w-8 h-8 text-green-500" />}
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back!</h2>
          <p className="text-gray-600">Redirecting to your {type === 'driver' ? 'marketplace' : 'dashboard'}...</p>
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
          <div className="text-center mb-6">
            <div className={`w-14 h-14 ${type === 'driver' ? 'bg-[#D4AF37]' : 'bg-[#0A2463]'} rounded-2xl flex items-center justify-center mx-auto mb-3`}>
              {type === 'driver' ? <Truck className="w-7 h-7 text-[#0A2463]" /> : <User className="w-7 h-7 text-white" />}
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isSignup ? 'Create Account' : 'Welcome Back'}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {type === 'driver' ? 'Driver Portal' : 'Customer Account'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignup && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Smith" className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0A2463] outline-none" />
                </div>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0A2463] outline-none" />
              </div>
            </div>
            {isSignup && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+44 7xxx xxx xxx" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0A2463] outline-none" />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Enter password" className="w-full pl-10 pr-10 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0A2463] outline-none" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {isSignup && type === 'customer' && (
              <label className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl cursor-pointer">
                <input type="checkbox" checked={isStudent} onChange={(e) => setIsStudent(e.target.checked)} className="w-5 h-5 rounded text-purple-600" />
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-purple-600" />
                  <span className="text-sm text-gray-700">I'm a student (10% discount on all bookings)</span>
                </div>
              </label>
            )}

            <button type="submit" className={`w-full ${type === 'driver' ? 'bg-[#D4AF37] hover:bg-[#C5A028] text-[#0A2463]' : 'bg-[#0A2463] hover:bg-[#1B3A8C] text-white'} py-3.5 rounded-xl font-bold text-lg transition-colors flex items-center justify-center gap-2`}>
              {isSignup ? 'Create Account' : 'Sign In'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          <div className="mt-6 text-center">
            <button onClick={() => setIsSignup(!isSignup)} className="text-[#0A2463] text-sm font-medium hover:underline">
              {isSignup ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
          </div>

          {type === 'customer' && !isSignup && (
            <button onClick={() => onNavigate('driver-login')} className="w-full mt-3 text-gray-500 text-sm hover:text-gray-700 text-center">
              Are you a driver? Sign in here
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
