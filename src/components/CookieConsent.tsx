import React, { useState, useEffect } from 'react';
import { Cookie, X, Settings, Shield, ChevronRight } from 'lucide-react';

const CookieConsent: React.FC = () => {
  const [show, setShow] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem('fmv_cookie_consent');
    if (!consent) {
      setTimeout(() => setShow(true), 2000);
    }
  }, []);

  const acceptAll = () => {
    localStorage.setItem('fmv_cookie_consent', JSON.stringify({ necessary: true, analytics: true, marketing: true }));
    setShow(false);
  };

  const savePreferences = () => {
    localStorage.setItem('fmv_cookie_consent', JSON.stringify(preferences));
    setShow(false);
  };

  const rejectAll = () => {
    localStorage.setItem('fmv_cookie_consent', JSON.stringify({ necessary: true, analytics: false, marketing: false }));
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-5">
      <div className="max-w-3xl mx-auto">
        <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-black/30">
          {/* Dark glassmorphism background */}
          <div className="absolute inset-0 bg-[#071A2F]/96 backdrop-blur-xl" />
          <div className="absolute inset-0 border border-white/8 rounded-2xl pointer-events-none" />
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#F5B400]/5 rounded-full blur-3xl pointer-events-none" />

          {!showSettings ? (
            <div className="relative p-5 sm:p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-[#F5B400]/15 border border-[#F5B400]/20 rounded-xl flex items-center justify-center shrink-0">
                  <Cookie className="w-5 h-5 text-[#F5B400]" />
                </div>
                <div className="flex-1 min-w-0 pr-8">
                  <div className="flex items-center gap-2 mb-1.5">
                    <h3 className="font-black text-white text-sm">We use cookies</h3>
                    <div className="flex items-center gap-1 bg-green-500/15 border border-green-500/20 rounded-full px-2 py-0.5">
                      <Shield className="w-2.5 h-2.5 text-green-400" />
                      <span className="text-green-400 text-[9px] font-bold tracking-wide uppercase">GDPR</span>
                    </div>
                  </div>
                  <p className="text-white/45 text-xs leading-relaxed">We use cookies to enhance your experience, serve personalised content, and analyse traffic. See our <button className="text-[#F5B400]/80 hover:text-[#F5B400] underline transition-colors" onClick={() => {}}>Cookie Policy</button> for details.</p>
                </div>
                <button onClick={rejectAll} className="absolute top-4 right-4 w-7 h-7 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg flex items-center justify-center text-white/40 hover:text-white/70 transition-all">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 mt-4 ml-14">
                <button
                  onClick={acceptAll}
                  className="bg-[#F5B400] hover:bg-[#E5A000] text-[#071A2F] px-5 py-2 rounded-xl font-black text-xs transition-all hover:shadow-lg hover:shadow-[#F5B400]/25"
                >
                  Accept All
                </button>
                <button
                  onClick={rejectAll}
                  className="bg-white/8 hover:bg-white/12 text-white/70 hover:text-white px-5 py-2 rounded-xl font-semibold text-xs transition-all border border-white/10"
                >
                  Reject All
                </button>
                <button
                  onClick={() => setShowSettings(true)}
                  className="flex items-center gap-1.5 text-white/40 hover:text-white/70 text-xs font-medium transition-colors px-3 py-2"
                >
                  <Settings className="w-3.5 h-3.5" /> Manage Preferences <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ) : (
            <div className="relative p-5 sm:p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#F5B400]/15 border border-[#F5B400]/20 rounded-lg flex items-center justify-center">
                    <Settings className="w-4 h-4 text-[#F5B400]" />
                  </div>
                  <h3 className="font-black text-white text-sm">Cookie Preferences</h3>
                </div>
                <button onClick={() => setShowSettings(false)} className="text-white/30 hover:text-white/60 transition-colors text-xs font-medium">
                  ← Back
                </button>
              </div>

              <div className="space-y-2.5">
                {[
                  { key: 'necessary', label: 'Necessary', desc: 'Required for the website to function. Always active.', locked: true },
                  { key: 'analytics', label: 'Analytics', desc: 'Help us understand how visitors interact with our site.', locked: false },
                  { key: 'marketing', label: 'Marketing', desc: 'Used to deliver personalised advertisements.', locked: false },
                ].map((cookie) => (
                  <div key={cookie.key} className="flex items-center justify-between bg-white/5 border border-white/8 rounded-xl px-4 py-3">
                    <div>
                      <p className="font-bold text-white text-xs">{cookie.label}</p>
                      <p className="text-white/35 text-xs mt-0.5 leading-snug">{cookie.desc}</p>
                    </div>
                    {cookie.locked ? (
                      <div className="w-10 h-5.5 bg-[#F5B400]/30 rounded-full flex items-center justify-end pr-0.5 shrink-0 ml-4" style={{ height: '1.375rem' }}>
                        <div className="w-4 h-4 bg-[#F5B400] rounded-full" />
                      </div>
                    ) : (
                      <button
                        onClick={() => setPreferences(p => ({ ...p, [cookie.key]: !p[cookie.key as keyof typeof p] }))}
                        className={`shrink-0 ml-4 w-10 rounded-full transition-all flex items-center px-0.5 ${
                          preferences[cookie.key as keyof typeof preferences]
                            ? 'bg-[#F5B400] justify-end'
                            : 'bg-white/15 justify-start'
                        }`}
                        style={{ height: '1.375rem' }}
                      >
                        <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={savePreferences}
                  className="flex-1 bg-[#F5B400] hover:bg-[#E5A000] text-[#071A2F] py-2.5 rounded-xl font-black text-xs transition-all"
                >
                  Save Preferences
                </button>
                <button
                  onClick={acceptAll}
                  className="px-5 bg-white/8 hover:bg-white/12 text-white/70 hover:text-white py-2.5 rounded-xl font-semibold text-xs transition-all border border-white/10"
                >
                  Accept All
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
