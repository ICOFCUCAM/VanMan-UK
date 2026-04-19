import React, { useState } from 'react';
import { X, ArrowRight } from 'lucide-react';
import { BRAND } from '@/lib/constants';

const WhatsAppButton: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  const whatsappUrl = `https://wa.me/${BRAND.whatsapp.replace(/\+/g, '')}?text=Hi%20Fast%20Man%20%26%20Van%2C%20I%20need%20help%20with%20a%20booking.`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Tooltip card */}
      {showTooltip && (
        <div className="w-72 rounded-2xl overflow-hidden shadow-2xl shadow-black/25 animate-in slide-in-from-bottom-3 fade-in duration-200">
          {/* Card background */}
          <div className="bg-white border border-gray-100">
            {/* Top green band */}
            <div className="bg-[#075E54] px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <div className="w-9 h-9 bg-white/15 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-[#075E54]" />
                </div>
                <div>
                  <p className="font-bold text-white text-sm">Fast Man & Van</p>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                    <p className="text-green-300 text-xs font-medium">Online now · Fast replies</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowTooltip(false)}
                className="w-6 h-6 text-white/60 hover:text-white transition-colors flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Message bubble */}
            <div className="px-4 py-4 bg-[#ECE5DD]">
              <div className="bg-white rounded-tl-none rounded-2xl px-3.5 py-2.5 shadow-sm inline-block max-w-[90%]">
                <p className="text-gray-800 text-sm leading-relaxed">👋 Hi! Need a quote or have a question? We're here to help.</p>
                <p className="text-gray-400 text-[10px] mt-1 text-right">Just now</p>
              </div>
            </div>

            {/* CTA */}
            <div className="px-4 pb-4 bg-[#ECE5DD]">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#20BC5A] text-white py-3 rounded-xl font-bold text-sm transition-all hover:shadow-lg hover:shadow-[#25D366]/30"
              >
                Open WhatsApp <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Main button */}
      <button
        onClick={() => setShowTooltip(!showTooltip)}
        className="relative w-14 h-14 bg-[#25D366] hover:bg-[#20BC5A] rounded-full flex items-center justify-center shadow-xl shadow-[#25D366]/40 hover:shadow-2xl hover:shadow-[#25D366]/50 transition-all hover:scale-105 active:scale-95"
      >
        {/* Ping ring */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20" />

        <svg className="w-7 h-7 text-white relative z-10" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>

        {/* Unread badge */}
        {!showTooltip && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center border-2 border-white">
            <span className="text-white text-[9px] font-black">1</span>
          </span>
        )}
      </button>
    </div>
  );
};

export default WhatsAppButton;
