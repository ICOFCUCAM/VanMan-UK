import React from 'react';
import { GraduationCap, CheckCircle, Info } from 'lucide-react';

const StudentDiscount: React.FC = () => {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #071A2F 0%, #0E2A47 60%, #0F3558 100%)' }}>
          {/* Decorative background */}
          <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #F5B400 0%, transparent 50%), radial-gradient(circle at 80% 20%, #F5B400 0%, transparent 40%)' }} />
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#F5B400]/5 rounded-full blur-3xl" />

          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-0 items-stretch">
            {/* Left: content */}
            <div className="p-8 sm:p-10">
              <div className="inline-flex items-center gap-2 bg-[#F5B400]/15 border border-[#F5B400]/20 text-[#F5B400] text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-5">
                <GraduationCap className="w-3.5 h-3.5" />
                Student Offer
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white mb-3 leading-tight">
                Students get <span className="text-[#F5B400]">10% off</span> every booking
              </h2>

              <p className="text-white/55 text-sm mb-6 leading-relaxed">
                Moving to uni, relocating between terms, or heading home? Discount applies to every booking — no minimum spend.
              </p>

              <div className="space-y-2.5 mb-6">
                {[
                  'Create an account with your university email',
                  'Upload a valid student ID for verification',
                  '10% discount applied automatically to all bookings',
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-400/15 border border-green-400/30 flex items-center justify-center shrink-0">
                      <CheckCircle className="w-3.5 h-3.5 text-green-400" />
                    </div>
                    <span className="text-white/70 text-sm">{step}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-start gap-2.5 bg-amber-500/8 border border-amber-400/15 rounded-xl p-4">
                <Info className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                <p className="text-amber-300/70 text-xs leading-relaxed">Student ID must be shown to the driver at pickup. If unavailable, the full fare applies.</p>
              </div>
            </div>

            {/* Right: visual */}
            <div className="relative flex items-center justify-center p-8 sm:p-10 border-t md:border-t-0 md:border-l border-white/8">
              <div className="text-center">
                <div className="w-18 h-18 bg-[#F5B400]/15 border border-[#F5B400]/20 rounded-2xl flex items-center justify-center mx-auto mb-4 p-4">
                  <GraduationCap className="w-10 h-10 text-[#F5B400]" />
                </div>
                <p className="text-7xl font-black text-white mb-1">10%</p>
                <p className="text-white/60 font-semibold text-sm mb-6">Student Discount</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Avg saving', value: '£12–£35' },
                    { label: 'Per booking', value: 'Always' },
                  ].map((s, i) => (
                    <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                      <p className="text-[#F5B400] font-black text-xl">{s.value}</p>
                      <p className="text-white/40 text-xs mt-0.5">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StudentDiscount;
