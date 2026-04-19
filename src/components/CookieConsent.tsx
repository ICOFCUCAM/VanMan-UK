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
        <div className="bg-white border border-[#0E2A47]/15 rounded-2xl shadow-2xl shadow-[#0E2A47]/15 overflow-hidden">

          {!showSettings ? (
            <div>
              {/* Branded top bar */}
              <div className="bg-[#0E2A47] px-5 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cookie className="w-4 h-4 text-[#F5B400]" />
                  <span className="font-black text-white text-sm">Cookie Preferences</span>
                  <div className="flex items-center gap-1 bg-green-500/20 border border-green-400/30 rounded-full px-2 py-0.5 ml-1">
                    <Shield className="w-2.5 h-2.5 text-green-400" />
                    <span className="text-green-400 text-[9px] font-bold tracking-wide">GDPR</span>
                  </div>
                </div>
                <button
                  onClick={rejectAll}
                  className="w-6 h-6 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center text-white/60 hover:text-white transition-all"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-5">
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  We use cookies to enhance your experience, serve personalised content, and analyse traffic.{' '}
                  <button className="text-[#0E2A47] font-semibold hover:text-[#F5B400] transition-colors underline">
                    Cookie Policy
                  </button>
                </p>
                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    onClick={acceptAll}
                    className="bg-[#F5B400] hover:bg-[#E5A000] text-[#071A2F] px-5 py-2 rounded-xl font-black text-sm transition-all hover:shadow-md"
                  >
                    Accept All
                  </button>
                  <button
                    onClick={rejectAll}
                    className="border border-[#0E2A47]/25 hover:border-[#0E2A47]/50 text-[#0E2A47] hover:bg-[#0E2A47]/5 px-5 py-2 rounded-xl font-semibold text-sm transition-all"
                  >
                    Reject All
                  </button>
                  <button
                    onClick={() => setShowSettings(true)}
                    className="flex items-center gap-1.5 text-gray-500 hover:text-[#0E2A47] text-sm font-medium transition-colors px-3 py-2"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    Manage
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="bg-[#0E2A47] px-5 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Settings className="w-4 h-4 text-[#F5B400]" />
                  <span className="font-black text-white text-sm">Cookie Settings</span>
                </div>
                <button onClick={() => setShowSettings(false)} className="text-white/50 hover:text-white text-xs font-semibold transition-colors">
                  ← Back
                </button>
              </div>

              <div className="p-5 space-y-3">
                {[
                  { key: 'necessary', label: 'Necessary', desc: 'Required for the website to function. Always active.', locked: true },
                  { key: 'analytics', label: 'Analytics', desc: 'Help us understand how visitors interact with the site.', locked: false },
                  { key: 'marketing', label: 'Marketing', desc: 'Used to deliver personalised advertisements.', locked: false },
                ].map(cookie => (
                  <div key={cookie.key} className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
                    <div>
                      <p className="font-bold text-[#0B2239] text-sm">{cookie.label}</p>
                      <p className="text-gray-500 text-xs mt-0.5">{cookie.desc}</p>
                    </div>
                    {cookie.locked ? (
                      <div className="w-10 rounded-full flex items-center justify-end pr-0.5 bg-[#F5B400]/30 shrink-0 ml-4" style={{ height: '1.375rem' }}>
                        <div className="w-4 h-4 bg-[#F5B400] rounded-full" />
                      </div>
                    ) : (
                      <button
                        onClick={() => setPreferences(p => ({ ...p, [cookie.key]: !p[cookie.key as keyof typeof p] }))}
                        className={`shrink-0 ml-4 w-10 rounded-full transition-all flex items-center px-0.5 ${
                          preferences[cookie.key as keyof typeof preferences]
                            ? 'bg-[#0E2A47] justify-end'
                            : 'bg-gray-300 justify-start'
                        }`}
                        style={{ height: '1.375rem' }}
                      >
                        <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
                      </button>
                    )}
                  </div>
                ))}

                <div className="flex gap-3 pt-1">
                  <button
                    onClick={savePreferences}
                    className="flex-1 bg-[#F5B400] hover:bg-[#E5A000] text-[#071A2F] py-2.5 rounded-xl font-black text-sm transition-all"
                  >
                    Save Preferences
                  </button>
                  <button
                    onClick={acceptAll}
                    className="px-5 border border-[#0E2A47]/25 hover:border-[#0E2A47] text-[#0E2A47] hover:bg-[#0E2A47]/5 py-2.5 rounded-xl font-semibold text-sm transition-all"
                  >
                    Accept All
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
