import React from 'react';
import { GraduationCap, CheckCircle, Info } from 'lucide-react';

const StudentDiscount: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#0A2463] to-[#1a1065]">
          {/* Decorative background */}
          <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #D4AF37 0%, transparent 50%), radial-gradient(circle at 80% 20%, #7C3AED 0%, transparent 40%)' }} />
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />

          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-0 items-stretch">
            {/* Left: content */}
            <div className="p-8 sm:p-12">
              <div className="inline-flex items-center gap-2 bg-purple-500/15 border border-purple-400/20 text-purple-300 text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-7">
                <GraduationCap className="w-3.5 h-3.5" />
                Student Offer
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-white mb-4 leading-tight">
                Students get{' '}
                <span className="text-[#D4AF37]">10% off</span>{' '}
                every booking
              </h2>

              <p className="text-white/55 mb-8 leading-relaxed">
                Moving to uni, relocating between terms, or heading home? Our student discount applies to every booking — no minimum spend.
              </p>

              <div className="space-y-3 mb-8">
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
            <div className="relative flex items-center justify-center p-8 sm:p-12 border-t md:border-t-0 md:border-l border-white/8">
              <div className="text-center">
                <div className="w-24 h-24 bg-[#D4AF37]/15 border border-[#D4AF37]/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <GraduationCap className="w-12 h-12 text-[#D4AF37]" />
                </div>
                <p className="text-8xl font-black text-white mb-2">10%</p>
                <p className="text-white/60 font-semibold mb-8">Student Discount</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Avg saving', value: '£12–£35' },
                    { label: 'Per booking', value: 'Always' },
                  ].map((s, i) => (
                    <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                      <p className="text-[#D4AF37] font-black text-xl">{s.value}</p>
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
