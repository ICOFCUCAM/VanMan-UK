import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { BRAND } from '@/lib/constants';

const WhatsAppButton: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  const whatsappUrl = `https://wa.me/${BRAND.whatsapp.replace(/\+/g, '')}?text=Hi%20Fast%20Man%20%26%20Van%2C%20I%20need%20help%20with%20a%20booking.`;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {showTooltip && (
        <div className="absolute bottom-16 right-0 bg-white rounded-2xl shadow-2xl p-4 w-72 border border-gray-100 animate-in slide-in-from-bottom-2">
          <button onClick={() => setShowTooltip(false)} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600">
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">Fast Man & Van</p>
              <p className="text-green-500 text-xs">Online now</p>
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-3">Need help? Chat with us on WhatsApp for instant support!</p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-green-500 hover:bg-green-600 text-white text-center py-2.5 rounded-lg font-semibold text-sm transition-colors"
          >
            Start Chat
          </a>
        </div>
      )}
      <button
        onClick={() => setShowTooltip(!showTooltip)}
        className="w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 transition-all hover:scale-105"
      >
        <MessageCircle className="w-7 h-7 text-white" />
      </button>
    </div>
  );
};

export default WhatsAppButton;
