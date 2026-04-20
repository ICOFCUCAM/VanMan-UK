import React, { useState, useEffect } from 'react';
import { Truck, Menu, X, User, Shield, LogOut, ChevronDown, ArrowRight } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import { BRAND } from '@/lib/constants';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onOpenModal: (step: 'select' | 'signin') => void;
}

const NAV = [
  { label: 'Home',            page: 'home' },
  { label: 'Services',        page: 'services' },
  { label: 'Moving Tools',    page: 'van-guide' },
  { label: 'Become a Driver', page: 'drivers' },
  { label: 'Track Order',     page: 'tracking' },
  { label: 'Enterprise',      page: 'enterprise' },
];

const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate, onOpenModal }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountDropdown, setAccountDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, role, isAuthenticated, signOut } = useAppContext();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSignOut = async () => {
    setAccountDropdown(false);
    await signOut();
    onNavigate('home');
  };

  const initials = user?.full_name
    ? user.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : user?.email?.[0]?.toUpperCase() ?? '?';

  return (
    <header className="fixed top-0 left-0 right-0 z-50">

      {/* ── TOP STRIP ─────────────────────────────────────────────────────── */}
      <div className="bg-[#0E2A47]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-8">
            <div className="flex items-center gap-2 text-white/60 text-[11px] font-medium">
              <svg className="w-3 h-3 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span className="hidden sm:inline">{BRAND.whatsappDisplay}</span>
              <span className="text-white/25 hidden sm:inline mx-1">|</span>
              <span className="hidden sm:inline">Smart Moving &amp; Transport Services</span>
              <span className="sm:hidden">Fast Man &amp; Van UK</span>
            </div>
            <div className="flex items-center gap-1.5 text-white/50 text-[11px]">
              <span>🇬🇧</span>
              <span className="font-medium">EN</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN NAVBAR ───────────────────────────────────────────────────── */}
      <div className={`bg-white transition-shadow duration-200 ${scrolled ? 'shadow-md' : 'shadow-sm border-b border-gray-100'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-14 gap-6">

            {/* Logo */}
            <button onClick={() => onNavigate('home')} className="flex items-center gap-2.5 group shrink-0">
              <div className="w-8 h-8 bg-[#F5B400] rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm">
                <Truck className="w-4 h-4 text-[#0E2A47]" />
              </div>
              <div className="hidden sm:block">
                <span className="text-[#0B2239] font-black text-[13px] tracking-wide block leading-tight">FAST MAN &amp; VAN</span>
                <span className="text-[#0E2A47]/40 text-[8px] font-semibold tracking-[0.2em] uppercase block">UK Transport Network</span>
              </div>
            </button>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-0.5 flex-1">
              {NAV.map(link => (
                <button
                  key={link.label}
                  onClick={() => onNavigate(link.page)}
                  className={`px-3.5 py-1.5 rounded-lg text-[13px] font-medium transition-all ${
                    currentPage === link.page
                      ? 'text-[#0E2A47] bg-[#0E2A47]/6 font-bold'
                      : 'text-gray-600 hover:text-[#0B2239] hover:bg-gray-100'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-2 ml-auto">
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setAccountDropdown(!accountDropdown)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-gray-600 hover:text-[#0B2239] hover:bg-gray-100 transition-all text-[13px]"
                  >
                    <div className="w-6 h-6 bg-[#0E2A47] rounded-full flex items-center justify-center text-white text-[10px] font-black">
                      {initials}
                    </div>
                    <span className="hidden md:inline max-w-[100px] truncate font-medium">
                      {user?.full_name?.split(' ')[0] || user?.email}
                    </span>
                    <ChevronDown className={`w-3 h-3 transition-transform ${accountDropdown ? 'rotate-180' : ''}`} />
                  </button>

                  {accountDropdown && (
                    <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                        <p className="text-[11px] text-gray-400 mb-0.5">Signed in as</p>
                        <p className="text-sm font-semibold text-gray-900 truncate">{user?.email}</p>
                        <span className={`inline-block mt-1.5 text-[11px] px-2 py-0.5 rounded-full font-semibold ${
                          role === 'admin'  ? 'bg-red-100 text-red-700' :
                          role === 'driver' ? 'bg-[#F5B400]/15 text-[#8A6E00]' :
                                             'bg-blue-100 text-blue-700'
                        }`}>
                          {role === 'admin' ? '⚡ Admin' : role === 'driver' ? '🚛 Driver' : '👤 Customer'}
                        </span>
                      </div>
                      <div className="p-1.5">
                        {role === 'driver' && (
                          <button onClick={() => { onNavigate('driver-marketplace'); setAccountDropdown(false); }}
                            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-gray-50 text-gray-700 text-sm transition-colors">
                            <Truck className="w-4 h-4 text-[#0E2A47]" />My Marketplace
                          </button>
                        )}
                        {role === 'customer' && (
                          <button onClick={() => { onNavigate('customer-dashboard'); setAccountDropdown(false); }}
                            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-gray-50 text-gray-700 text-sm transition-colors">
                            <User className="w-4 h-4 text-[#0E2A47]" />My Bookings
                          </button>
                        )}
                        {role === 'admin' && (
                          <button onClick={() => { onNavigate('admin'); setAccountDropdown(false); }}
                            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-gray-50 text-gray-700 text-sm transition-colors">
                            <Shield className="w-4 h-4 text-red-500" />Admin Dashboard
                          </button>
                        )}
                        <div className="border-t border-gray-100 my-1" />
                        <button onClick={handleSignOut}
                          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-red-50 text-red-600 text-sm transition-colors">
                          <LogOut className="w-4 h-4" />Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <button
                    onClick={() => onNavigate('login')}
                    className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-gray-600 hover:text-[#0B2239] hover:bg-gray-100 transition-all text-[13px] font-medium"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                    Sign In
                  </button>
                  <button
                    onClick={() => onOpenModal('select')}
                    className="hidden sm:flex items-center border border-[#0E2A47] text-[#0E2A47] hover:bg-[#0E2A47] hover:text-white px-4 py-1.5 rounded-lg text-[13px] font-semibold transition-all"
                  >
                    Sign Up
                  </button>
                </>
              )}

              <button
                onClick={() => onNavigate('home')}
                className="flex items-center gap-1.5 bg-[#F5B400] hover:bg-[#E5A000] text-[#071A2F] px-4 py-2 rounded-lg font-bold text-[13px] transition-all hover:shadow-md"
              >
                Book Now
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-gray-600 hover:text-[#0B2239] hover:bg-gray-100 rounded-lg transition-colors"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── MOBILE MENU ───────────────────────────────────────────────────── */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="px-4 py-3 space-y-0.5">
            {NAV.map(link => (
              <button
                key={link.label}
                onClick={() => { onNavigate(link.page); setMobileMenuOpen(false); }}
                className={`w-full text-left px-4 py-3 rounded-xl text-[13px] font-medium transition-colors ${
                  currentPage === link.page
                    ? 'text-[#0E2A47] bg-[#0E2A47]/6 font-bold'
                    : 'text-gray-600 hover:text-[#0B2239] hover:bg-gray-50'
                }`}
              >
                {link.label}
              </button>
            ))}
            <div className="border-t border-gray-100 pt-3 mt-2 space-y-0.5">
              {isAuthenticated ? (
                <>
                  <div className="px-4 py-1.5 text-gray-400 text-[11px]">{user?.email}</div>
                  {role === 'driver' && (
                    <button onClick={() => { onNavigate('driver-marketplace'); setMobileMenuOpen(false); }}
                      className="w-full text-left px-4 py-3 rounded-xl text-[#0E2A47] hover:bg-gray-50 text-[13px] font-medium transition-colors">
                      My Marketplace
                    </button>
                  )}
                  {role === 'customer' && (
                    <button onClick={() => { onNavigate('customer-dashboard'); setMobileMenuOpen(false); }}
                      className="w-full text-left px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 text-[13px] font-medium transition-colors">
                      My Bookings
                    </button>
                  )}
                  {role === 'admin' && (
                    <button onClick={() => { onNavigate('admin'); setMobileMenuOpen(false); }}
                      className="w-full text-left px-4 py-3 rounded-xl text-red-600 hover:bg-gray-50 text-[13px] font-medium transition-colors">
                      Admin Dashboard
                    </button>
                  )}
                  <button onClick={() => { handleSignOut(); setMobileMenuOpen(false); }}
                    className="w-full text-left px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 text-[13px] font-medium transition-colors">
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => { onNavigate('login'); setMobileMenuOpen(false); }}
                    className="w-full text-left px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 text-[13px] font-medium transition-colors">
                    Sign In
                  </button>
                  <button onClick={() => { onOpenModal('select'); setMobileMenuOpen(false); }}
                    className="w-full text-left px-4 py-3 rounded-xl text-[#0E2A47] font-semibold hover:bg-gray-50 text-[13px] transition-colors">
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {accountDropdown && (
        <div className="fixed inset-0 z-40" onClick={() => setAccountDropdown(false)} />
      )}
    </header>
  );
};

export default Header;
