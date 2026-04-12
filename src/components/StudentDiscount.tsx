import React from 'react';
import { GraduationCap, Upload, CheckCircle, AlertTriangle } from 'lucide-react';

const StudentDiscount: React.FC = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
                <GraduationCap className="w-4 h-4" />
                STUDENT OFFER
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Students Get <span className="text-purple-600">10% Off</span> Every Booking
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Moving to uni? Relocating between term addresses? We've got you covered with our exclusive student discount on all bookings.
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">Create a student account with your university email</span>
                </div>
                <div className="flex items-center gap-3">
                  <Upload className="w-5 h-5 text-blue-500 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">Upload a valid student ID for verification</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">10% discount automatically applied to all bookings</span>
                </div>
              </div>
              <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6">
                <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <p className="text-amber-700 text-xs">Student ID must be presented to the driver at pickup. If ID cannot be presented, the discount will be removed and the full fare charged.</p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl p-8 text-white text-center">
              <GraduationCap className="w-16 h-16 mx-auto mb-4 opacity-80" />
              <p className="text-5xl font-bold mb-2">10%</p>
              <p className="text-xl font-semibold mb-1">Student Discount</p>
              <p className="text-white/70 text-sm mb-6">On every booking, every time</p>
              <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/20">
                <p className="text-white/80 text-sm">Average student saving</p>
                <p className="text-3xl font-bold text-[#D4AF37]">£12-£35</p>
                <p className="text-white/60 text-xs">per booking</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StudentDiscount;
