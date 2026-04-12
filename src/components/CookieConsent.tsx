import React, { useState, useEffect } from 'react';
import { Cookie, X, Settings } from 'lucide-react';

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
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
        {!showSettings ? (
          <div className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-[#0A2463]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Cookie className="w-5 h-5 text-[#0A2463]" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 mb-1">We value your privacy</h3>
                <p className="text-gray-600 text-sm">We use cookies to enhance your browsing experience, serve personalised content, and analyse our traffic. By clicking "Accept All", you consent to our use of cookies in accordance with our Cookie Policy and GDPR regulations.</p>
              </div>
              <button onClick={rejectAll} className="text-gray-400 hover:text-gray-600 flex-shrink-0">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-wrap gap-3 mt-4 ml-14">
              <button onClick={acceptAll} className="bg-[#0A2463] hover:bg-[#1B3A8C] text-white px-6 py-2.5 rounded-lg font-semibold text-sm transition-colors">Accept All</button>
              <button onClick={rejectAll} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2.5 rounded-lg font-semibold text-sm transition-colors">Reject All</button>
              <button onClick={() => setShowSettings(true)} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 px-4 py-2.5 text-sm font-medium transition-colors">
                <Settings className="w-4 h-4" /> Manage Preferences
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6">
            <h3 className="font-bold text-gray-900 mb-4">Cookie Preferences</h3>
            <div className="space-y-4">
              <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Necessary Cookies</p>
                  <p className="text-gray-500 text-xs">Required for the website to function. Cannot be disabled.</p>
                </div>
                <input type="checkbox" checked disabled className="w-5 h-5 rounded" />
              </label>
              <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer">
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Analytics Cookies</p>
                  <p className="text-gray-500 text-xs">Help us understand how visitors interact with our website.</p>
                </div>
                <input type="checkbox" checked={preferences.analytics} onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })} className="w-5 h-5 rounded text-[#0A2463]" />
              </label>
              <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer">
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Marketing Cookies</p>
                  <p className="text-gray-500 text-xs">Used to track visitors across websites for advertising purposes.</p>
                </div>
                <input type="checkbox" checked={preferences.marketing} onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })} className="w-5 h-5 rounded text-[#0A2463]" />
              </label>
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={savePreferences} className="bg-[#0A2463] hover:bg-[#1B3A8C] text-white px-6 py-2.5 rounded-lg font-semibold text-sm transition-colors">Save Preferences</button>
              <button onClick={() => setShowSettings(false)} className="text-gray-500 hover:text-gray-700 px-4 py-2.5 text-sm font-medium transition-colors">Back</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CookieConsent;
