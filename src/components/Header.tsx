import React, { useState } from 'react';
import { Truck, Menu, X, ChevronDown, User, Shield, BarChart3 } from 'lucide-react';
import { BRAND, NAV_LINKS } from '@/lib/constants';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountDropdown, setAccountDropdown] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0A2463]/95 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <button onClick={() => onNavigate('home')} className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-[#D4AF37] rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
              <Truck className="w-6 h-6 text-[#0A2463]" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-white font-bold text-lg leading-tight">FAST MAN & VAN</h1>
              <p className="text-[#D4AF37] text-[10px] font-medium tracking-wider uppercase">Reliable Transport</p>
            </div>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <button
                key={link.label}
                onClick={() => onNavigate(link.page)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  currentPage === link.page
                    ? 'bg-[#D4AF37] text-[#0A2463]'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Account Dropdown */}
            <div className="relative">
              <button
                onClick={() => setAccountDropdown(!accountDropdown)}
                className="flex items-center gap-1 px-3 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all text-sm"
              >
                <User className="w-4 h-4" />
                <span className="hidden md:inline">Account</span>
                <ChevronDown className="w-3 h-3" />
              </button>
              {accountDropdown && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                  <div className="p-2">
                    <button onClick={() => { onNavigate('login'); setAccountDropdown(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 text-gray-700 text-sm transition-colors">
                      <User className="w-4 h-4 text-[#0A2463]" />
                      Customer Login
                    </button>
                    <button onClick={() => { onNavigate('driver-login'); setAccountDropdown(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 text-gray-700 text-sm transition-colors">
                      <Truck className="w-4 h-4 text-[#0A2463]" />
                      Driver Login
                    </button>
                    <button onClick={() => { onNavigate('driver-register'); setAccountDropdown(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 text-gray-700 text-sm transition-colors">
                      <Truck className="w-4 h-4 text-[#D4AF37]" />
                      Become a Driver
                    </button>
                    <div className="border-t border-gray-100 my-1" />
                    <button onClick={() => { onNavigate('corporate'); setAccountDropdown(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 text-gray-700 text-sm transition-colors">
                      <BarChart3 className="w-4 h-4 text-[#0A2463]" />
                      Corporate Portal
                    </button>
                    <button onClick={() => { onNavigate('admin'); setAccountDropdown(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 text-gray-700 text-sm transition-colors">
                      <Shield className="w-4 h-4 text-red-500" />
                      Admin Dashboard
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => onNavigate('home')}
              className="hidden sm:flex bg-[#D4AF37] hover:bg-[#C5A028] text-[#0A2463] px-5 py-2.5 rounded-lg font-semibold text-sm transition-all hover:shadow-lg hover:shadow-[#D4AF37]/20"
            >
              Get Quote
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0A2463] border-t border-white/10">
          <div className="px-4 py-3 space-y-1">
            {NAV_LINKS.map((link) => (
              <button
                key={link.label}
                onClick={() => { onNavigate(link.page); setMobileMenuOpen(false); }}
                className="w-full text-left px-4 py-3 rounded-lg text-white/80 hover:text-white hover:bg-white/10 text-sm font-medium transition-colors"
              >
                {link.label}
              </button>
            ))}
            <div className="border-t border-white/10 pt-2 mt-2">
              <button onClick={() => { onNavigate('driver-register'); setMobileMenuOpen(false); }} className="w-full text-left px-4 py-3 rounded-lg text-[#D4AF37] hover:bg-white/10 text-sm font-medium transition-colors">
                Become a Driver
              </button>
              <button onClick={() => { onNavigate('admin'); setMobileMenuOpen(false); }} className="w-full text-left px-4 py-3 rounded-lg text-white/60 hover:bg-white/10 text-sm font-medium transition-colors">
                Admin Dashboard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close dropdown */}
      {accountDropdown && (
        <div className="fixed inset-0 z-40" onClick={() => setAccountDropdown(false)} />
      )}
    </header>
  );
};

export default Header;
