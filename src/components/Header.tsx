import React, { useState, useEffect } from 'react';
import { Truck, Menu, X, User, Shield, LogOut, Zap, ChevronDown } from 'lucide-react';
import { NAV_LINKS } from '@/lib/constants';
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
    const onScroll = () => setScrolled(window.scrollY > 10);
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

      {/* Status strip */}
      <div className="bg-[#040f1f] border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-8 gap-2.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-400" />
            </span>
            <span className="text-white/40 text-[11px] font-medium tracking-wide">
              Drivers available now across the UK
            </span>
            <span className="text-white/18 text-[11px]">•</span>
            <span className="text-white/40 text-[11px] font-medium tracking-wide hidden sm:inline">
              Avg dispatch under 15 minutes
            </span>
          </div>
        </div>
      </div>

      {/* Navbar */}
      <div className={`transition-all duration-200 ${
        scrolled || currentPage !== 'home'
          ? 'bg-[#0E2A47]/98 backdrop-blur-md shadow-lg shadow-black/25 border-b border-white/[0.08]'
          : 'bg-[#071A2F]/96 backdrop-blur-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-14 gap-6">

            {/* Logo */}
            <button onClick={() => onNavigate('home')} className="flex items-center gap-2.5 group shrink-0">
              <div className="w-8 h-8 bg-[#F5B400] rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform shadow-md shadow-[#F5B400]/25">
                <Truck className="w-4 h-4 text-[#0E2A47]" />
              </div>
              <div className="hidden sm:block">
                <span className="text-white font-black text-[13px] tracking-wide block leading-tight">FAST MAN & VAN</span>
                <span className="text-[#F5B400]/45 text-[8px] font-semibold tracking-[0.2em] uppercase block">UK Transport Network</span>
              </div>
            </button>

            {/* Desktop nav — left-aligned */}
            <nav className="hidden lg:flex items-center gap-0.5 flex-1">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.label}
                  onClick={() => onNavigate(link.page)}
                  className={`px-3.5 py-1.5 rounded-lg text-[13px] font-medium transition-all ${
                    currentPage === link.page
                      ? 'text-white bg-white/10'
                      : 'text-white/50 hover:text-white/90 hover:bg-white/[0.06]'
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
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-white/65 hover:text-white hover:bg-white/[0.07] transition-all text-[13px]"
                  >
                    <div className="w-6 h-6 bg-[#F5B400] rounded-full flex items-center justify-center text-[#0E2A47] text-[10px] font-black">
                      {initials}
                    </div>
                    <span className="hidden md:inline max-w-[100px] truncate">
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
                <button
                  onClick={() => onNavigate('login')}
                  className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-white/50 hover:text-white/90 hover:bg-white/[0.06] transition-all text-[13px] font-medium"
                >
                  <User className="w-3.5 h-3.5" />
                  Sign In
                </button>
              )}

              <button
                onClick={() => onNavigate('home')}
                className="flex items-center gap-1.5 bg-[#F5B400] hover:bg-[#E5A000] text-[#071A2F] px-4 py-2 rounded-lg font-bold text-[13px] transition-all hover:shadow-lg hover:shadow-[#F5B400]/25"
              >
                <Zap className="w-3.5 h-3.5" />
                Get Quote
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-white/60 hover:text-white hover:bg-white/[0.07] rounded-lg transition-colors"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#071a45]/99 backdrop-blur-md border-t border-white/[0.07]">
          <div className="px-4 py-3 space-y-0.5">
            {NAV_LINKS.map((link) => (
              <button
                key={link.label}
                onClick={() => { onNavigate(link.page); setMobileMenuOpen(false); }}
                className={`w-full text-left px-4 py-3 rounded-xl text-[13px] font-medium transition-colors ${
                  currentPage === link.page
                    ? 'text-white bg-white/10'
                    : 'text-white/55 hover:text-white hover:bg-white/[0.07]'
                }`}
              >
                {link.label}
              </button>
            ))}
            <div className="border-t border-white/[0.07] pt-3 mt-2 space-y-0.5">
              {isAuthenticated ? (
                <>
                  <div className="px-4 py-1.5 text-white/30 text-[11px]">{user?.email}</div>
                  {role === 'driver' && (
                    <button onClick={() => { onNavigate('driver-marketplace'); setMobileMenuOpen(false); }}
                      className="w-full text-left px-4 py-3 rounded-xl text-[#F5B400] hover:bg-white/[0.07] text-[13px] font-medium transition-colors">
                      My Marketplace
                    </button>
                  )}
                  {role === 'customer' && (
                    <button onClick={() => { onNavigate('customer-dashboard'); setMobileMenuOpen(false); }}
                      className="w-full text-left px-4 py-3 rounded-xl text-white/70 hover:bg-white/[0.07] text-[13px] font-medium transition-colors">
                      My Bookings
                    </button>
                  )}
                  {role === 'admin' && (
                    <button onClick={() => { onNavigate('admin'); setMobileMenuOpen(false); }}
                      className="w-full text-left px-4 py-3 rounded-xl text-red-400 hover:bg-white/[0.07] text-[13px] font-medium transition-colors">
                      Admin Dashboard
                    </button>
                  )}
                  <button onClick={() => { handleSignOut(); setMobileMenuOpen(false); }}
                    className="w-full text-left px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 text-[13px] font-medium transition-colors">
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => { onNavigate('login'); setMobileMenuOpen(false); }}
                    className="w-full text-left px-4 py-3 rounded-xl text-white/55 hover:bg-white/[0.07] text-[13px] font-medium transition-colors">
                    Sign In
                  </button>
                  <button onClick={() => { onNavigate('driver-register'); setMobileMenuOpen(false); }}
                    className="w-full text-left px-4 py-3 rounded-xl text-[#F5B400]/70 hover:bg-white/[0.07] text-[13px] font-medium transition-colors">
                    Become a Driver
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
