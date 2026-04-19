import React from 'react';
import StudentDiscount from '@/components/StudentDiscount';
import FinalCTA from '@/components/FinalCTA';

interface StudentsPageProps {
  onNavigate: (page: string) => void;
  onScrollToBooking: () => void;
}

const StudentsPage: React.FC<StudentsPageProps> = ({ onNavigate, onScrollToBooking }) => {
  return (
    <>
      {/* Page header */}
      <div className="bg-[#071A2F] pt-24 pb-10 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-[#F5B400] text-xs font-bold tracking-[0.2em] uppercase mb-3 block">Student Offer</span>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">10% off every booking for students</h1>
          <p className="text-white/45 text-sm max-w-lg leading-relaxed">
            Moving to university or relocating between terms? Verify your student ID once and save on every future booking.
          </p>
        </div>
      </div>

      <StudentDiscount />
      <FinalCTA onScrollToBooking={onScrollToBooking} onNavigate={onNavigate} />
    </>
  );
};

export default StudentsPage;
