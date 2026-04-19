import React, { useState, useEffect } from 'react';
import { Truck, Menu, X, ChevronDown, User, Shield, BarChart3, LogOut, Zap } from 'lucide-react';
import { BRAND, NAV_LINKS } from '@/lib/constants';
import { useAppContext } from '@/contexts/AppContext';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountDropdown, setAccountDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, role, isAuthenticated, signOut } = useAppContext();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
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

  const isHome = currentPage === 'home';

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled || !isHome
        ? 'bg-[#0A2463]/98 backdrop-blur-md shadow-lg shadow-black/20 border-b border-white/8'
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">

          {/* Logo */}
          <button onClick={() => onNavigate('home')} className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 bg-[#D4AF37] rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform shadow-lg shadow-[#D4AF37]/30">
              <Truck className="w-5 h-5 text-[#0A2463]" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-white font-black text-base leading-tight tracking-wide">FAST MAN & VAN</h1>
              <p className="text-[#D4AF37]/70 text-[9px] font-semibold tracking-[0.2em] uppercase">Reliable Transport · UK Wide</p>
            </div>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <button
                key={link.label}
                onClick={() => onNavigate(link.page)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  currentPage === link.page && link.page !== 'home'
                    ? 'bg-[#D4AF37] text-[#0A2463]'
                    : 'text-white/75 hover:text-white hover:bg-white/10'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setAccountDropdown(!accountDropdown)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-white/90 hover:text-white hover:bg-white/10 transition-all text-sm"
                >
                  <div className="w-7 h-7 bg-[#D4AF37] rounded-full flex items-center justify-center text-[#0A2463] text-xs font-black">
                    {initials}
                  </div>
                  <span className="hidden md:inline max-w-[120px] truncate text-sm">
                    {user?.full_name?.split(' ')[0] || user?.email}
                  </span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${accountDropdown ? 'rotate-180' : ''}`} />
                </button>

                {accountDropdown && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                    <div className="px-4 py-3.5 border-b border-gray-100 bg-gray-50/50">
                      <p className="text-xs text-gray-400 mb-0.5">Signed in as</p>
                      <p className="text-sm font-semibold text-gray-900 truncate">{user?.email}</p>
                      <span className={`inline-block mt-1.5 text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                        role === 'admin' ? 'bg-red-100 text-red-700' :
                        role === 'driver' ? 'bg-[#D4AF37]/15 text-[#8B6914]' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {role === 'admin' ? '⚡ Admin' : role === 'driver' ? '🚛 Driver' : '👤 Customer'}
                      </span>
                    </div>
                    <div className="p-2">
                      {role === 'driver' && (
                        <button onClick={() => { onNavigate('driver-marketplace'); setAccountDropdown(false); }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 text-gray-700 text-sm transition-colors">
                          <Truck className="w-4 h-4 text-[#0A2463]" />My Marketplace
                        </button>
                      )}
                      {role === 'customer' && (
                        <button onClick={() => { onNavigate('customer-dashboard'); setAccountDropdown(false); }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 text-gray-700 text-sm transition-colors">
                          <User className="w-4 h-4 text-[#0A2463]" />My Bookings
                        </button>
                      )}
                      {role === 'admin' && (
                        <button onClick={() => { onNavigate('admin'); setAccountDropdown(false); }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 text-gray-700 text-sm transition-colors">
                          <Shield className="w-4 h-4 text-red-500" />Admin Dashboard
                        </button>
                      )}
                      <div className="border-t border-gray-100 my-1.5" />
                      <button onClick={handleSignOut}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-50 text-red-600 text-sm transition-colors">
                        <LogOut className="w-4 h-4" />Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setAccountDropdown(!accountDropdown)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-white/75 hover:text-white hover:bg-white/10 transition-all text-sm"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden md:inline">Account</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${accountDropdown ? 'rotate-180' : ''}`} />
                </button>

                {accountDropdown && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                    <div className="p-2">
                      <button onClick={() => { onNavigate('login'); setAccountDropdown(false); }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 text-gray-700 text-sm transition-colors">
                        <User className="w-4 h-4 text-[#0A2463]" />Sign In
                      </button>
                      <button onClick={() => { onNavigate('driver-register'); setAccountDropdown(false); }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 text-gray-700 text-sm transition-colors">
                        <Truck className="w-4 h-4 text-[#D4AF37]" />Become a Driver
                      </button>
                      <div className="border-t border-gray-100 my-1.5" />
                      <button onClick={() => { onNavigate('corporate'); setAccountDropdown(false); }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 text-gray-700 text-sm transition-colors">
                        <BarChart3 className="w-4 h-4 text-[#0A2463]" />Corporate Portal
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={() => onNavigate('home')}
              className="hidden sm:flex items-center gap-2 bg-[#D4AF37] hover:bg-[#C5A028] text-[#061539] px-5 py-2.5 rounded-xl font-bold text-sm transition-all hover:shadow-lg hover:shadow-[#D4AF37]/25 hover:-translate-y-0.5"
            >
              <Zap className="w-3.5 h-3.5" />
              Get Quote
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-white hover:bg-white/10 rounded-xl transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0A2463]/98 backdrop-blur-md border-t border-white/10">
          <div className="px-4 py-4 space-y-1">
            {NAV_LINKS.map((link) => (
              <button
                key={link.label}
                onClick={() => { onNavigate(link.page); setMobileMenuOpen(false); }}
                className="w-full text-left px-4 py-3 rounded-xl text-white/75 hover:text-white hover:bg-white/10 text-sm font-medium transition-colors"
              >
                {link.label}
              </button>
            ))}
            <div className="border-t border-white/10 pt-3 mt-3 space-y-1">
              {isAuthenticated ? (
                <>
                  <div className="px-4 py-2 text-white/40 text-xs">{user?.email}</div>
                  {role === 'driver' && (
                    <button onClick={() => { onNavigate('driver-marketplace'); setMobileMenuOpen(false); }}
                      className="w-full text-left px-4 py-3 rounded-xl text-[#D4AF37] hover:bg-white/10 text-sm font-medium transition-colors">
                      My Marketplace
                    </button>
                  )}
                  {role === 'customer' && (
                    <button onClick={() => { onNavigate('customer-dashboard'); setMobileMenuOpen(false); }}
                      className="w-full text-left px-4 py-3 rounded-xl text-white/80 hover:bg-white/10 text-sm font-medium transition-colors">
                      My Bookings
                    </button>
                  )}
                  {role === 'admin' && (
                    <button onClick={() => { onNavigate('admin'); setMobileMenuOpen(false); }}
                      className="w-full text-left px-4 py-3 rounded-xl text-red-400 hover:bg-white/10 text-sm font-medium transition-colors">
                      Admin Dashboard
                    </button>
                  )}
                  <button onClick={() => { handleSignOut(); setMobileMenuOpen(false); }}
                    className="w-full text-left px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 text-sm font-medium transition-colors">
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => { onNavigate('driver-register'); setMobileMenuOpen(false); }}
                    className="w-full text-left px-4 py-3 rounded-xl text-[#D4AF37] hover:bg-white/10 text-sm font-medium transition-colors">
                    Become a Driver
                  </button>
                  <button onClick={() => { onNavigate('login'); setMobileMenuOpen(false); }}
                    className="w-full text-left px-4 py-3 rounded-xl text-white/60 hover:bg-white/10 text-sm font-medium transition-colors">
                    Sign In
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
