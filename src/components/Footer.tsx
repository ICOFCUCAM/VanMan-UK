import React from 'react';
import { Truck } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

type FooterLink = { label: string; page: string; soon?: boolean };

const COLUMNS: { title: string; links: FooterLink[] }[] = [
  {
    title: 'Customers',
    links: [
      { label: 'Book a Van',       page: 'home' },
      { label: 'Services',         page: 'services' },
      { label: 'Track Order',      page: 'tracking' },
      { label: 'Coverage Areas',   page: 'services' },
    ],
  },
  {
    title: 'Business',
    links: [
      { label: 'Enterprise Logistics', page: 'enterprise' },
      { label: 'Corporate Accounts',   page: 'corporate' },
      { label: 'Bulk Deliveries',      page: 'enterprise' },
      { label: 'API Access',           page: 'home', soon: true },
    ],
  },
  {
    title: 'Drivers',
    links: [
      { label: 'Apply to Drive',       page: 'driver-register' },
      { label: 'Driver Requirements',  page: 'drivers' },
      { label: 'Driver Earnings',      page: 'drivers' },
      { label: 'Driver Support',       page: 'contact' },
    ],
  },
  {
    title: 'Technology',
    links: [
      { label: 'Routing Engine',    page: 'technology' },
      { label: 'Live Tracking',     page: 'tracking' },
      { label: 'Insurance Coverage', page: 'terms' },
      { label: 'Safety Standards',  page: 'terms' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About',    page: 'about' },
      { label: 'Careers',  page: 'home' },
      { label: 'Contact',  page: 'contact' },
      { label: 'Support',  page: 'contact' },
    ],
  },
];

const COVERAGE = ['London', 'Manchester', 'Birmingham', 'Leeds', 'Glasgow', 'Edinburgh', 'Bristol', 'Liverpool'];

const LEGAL: FooterLink[] = [
  { label: 'Terms',            page: 'terms' },
  { label: 'Privacy',          page: 'privacy' },
  { label: 'Cookies',          page: 'cookies' },
  { label: 'Insurance Policy', page: 'terms' },
];

const Footer: React.FC<FooterProps> = ({ onNavigate }) => (
  <footer className="bg-[#071A2F] text-white">

    {/* Main grid */}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-5">

        {/* Brand column */}
        <div className="col-span-2 sm:col-span-3 lg:col-span-1 lg:pr-4">
          <button onClick={() => onNavigate('home')} className="flex items-center gap-2.5 mb-4 group">
            <div className="w-8 h-8 bg-[#F5B400] rounded-lg flex items-center justify-center shadow-md shadow-[#F5B400]/20 group-hover:scale-105 transition-transform">
              <Truck className="w-4 h-4 text-[#071A2F]" />
            </div>
            <div>
              <span className="text-white font-black text-[13px] tracking-wide block leading-tight">FAST MAN & VAN</span>
              <span className="text-[#F5B400]/40 text-[8px] font-semibold tracking-[0.2em] uppercase block">UK Transport Network</span>
            </div>
          </button>
          <p className="text-white/28 text-[12.5px] leading-relaxed">
            Reliable UK-wide transport network connecting customers with verified professional drivers in minutes.
          </p>
        </div>

        {/* Link columns */}
        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h4 className="text-white/50 text-[10.5px] font-bold tracking-[0.18em] uppercase mb-4">{col.title}</h4>
            <ul className="space-y-2.5">
              {col.links.map((link) => (
                <li key={link.label}>
                  {link.soon ? (
                    <span className="text-[12.5px] text-white/18 flex items-center gap-2">
                      {link.label}
                      <span className="text-[9px] text-[#F5B400]/25 font-bold tracking-widest uppercase">Soon</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => onNavigate(link.page)}
                      className="text-[12.5px] text-white/35 hover:text-[#F5B400] transition-colors text-left"
                    >
                      {link.label}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>

    {/* Coverage strip */}
    <div className="border-t border-white/[0.05]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <p className="text-center text-[11px] text-white/22 font-medium tracking-wide">
          <span className="text-white/32 font-semibold">Operating across</span>
          {' '}
          {COVERAGE.map((city, i) => (
            <React.Fragment key={city}>
              <span>{city}</span>
              {i < COVERAGE.length - 1 && <span className="mx-2 text-white/14">•</span>}
            </React.Fragment>
          ))}
        </p>
      </div>
    </div>

    {/* Legal + bottom line */}
    <div className="border-t border-white/[0.04]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/20 text-[11.5px]">
            &copy; Fast Man &amp; Van &nbsp;&middot;&nbsp; Nationwide UK transport network
          </p>
          <div className="flex items-center gap-5 flex-wrap justify-center">
            {LEGAL.map((link) => (
              <button
                key={link.label}
                onClick={() => onNavigate(link.page)}
                className="text-white/22 hover:text-white/50 text-[11px] transition-colors"
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
