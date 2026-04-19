import React, { useState } from 'react';
import { Truck, Phone, Mail, MapPin, Twitter, Facebook, Linkedin, Instagram } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

type FooterLink = { label: string; page: string; soon?: boolean };

const SERVICES: FooterLink[] = [
  { label: 'House Moving',        page: 'services' },
  { label: 'Furniture Transport', page: 'services' },
  { label: 'Office Relocation',   page: 'services' },
  { label: 'Student Moving',      page: 'students' },
  { label: 'Same-Day Delivery',   page: 'services' },
  { label: 'Van Size Guide',      page: 'van-guide' },
];

const CITIES: FooterLink[] = [
  { label: 'Moving help London',      page: 'home' },
  { label: 'Moving help Manchester',  page: 'home' },
  { label: 'Moving help Birmingham',  page: 'home' },
  { label: 'Moving help Leeds',       page: 'home' },
  { label: 'Moving help Glasgow',     page: 'home' },
  { label: 'Moving help Edinburgh',   page: 'home' },
];

const COMPANY: FooterLink[] = [
  { label: 'Book a Move',           page: 'home' },
  { label: 'Careers',               page: 'home' },
  { label: 'Press & Media',         page: 'home' },
  { label: 'Sustainability',        page: 'home' },
  { label: 'Become a Driver',       page: 'driver-register' },
  { label: 'Moving Tools',          page: 'moving-checklist' },
];

const RESOURCES: FooterLink[] = [
  { label: 'Help Centre',         page: 'contact' },
  { label: 'FAQ',                 page: 'contact' },
  { label: 'Safety & Insurance',  page: 'terms' },
  { label: 'Moving Checklist',    page: 'moving-checklist' },
  { label: 'Van Size Guide',      page: 'van-guide' },
  { label: 'Get in Touch',        page: 'contact' },
];

const CORPORATE: FooterLink[] = [
  { label: 'Corporate Logistics Portal', page: 'corporate' },
  { label: 'Bulk Booking',               page: 'enterprise' },
  { label: 'Recurring Deliveries',       page: 'enterprise' },
  { label: 'Invoice',                    page: 'enterprise' },
  { label: 'API Access',                 page: 'technology', soon: true },
  { label: 'Corporate Dashboard',        page: 'corporate' },
];

const LEGAL: FooterLink[] = [
  { label: 'Privacy Policy',  page: 'privacy' },
  { label: 'Terms of Service', page: 'terms' },
  { label: 'Liability',        page: 'terms' },
  { label: 'Cookie Policy',    page: 'cookies' },
  { label: 'Safety',           page: 'terms' },
  { label: 'Contact',          page: 'contact' },
];

const PAYMENT_BADGES = ['Visa', 'Mastercard', 'Amex', 'Apple Pay', 'Google Pay', 'Invoice'];

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.includes('@')) setSubscribed(true);
  };

  return (
    <footer className="bg-[#071A2F] text-white">

      {/* ── Newsletter strip ─────────────────────────────────────────── */}
      <div className="border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-black text-white mb-1">Stay in the loop</h3>
            <p className="text-white/40 text-sm">Monthly moving tips, seasonal discounts, and new-city launches.</p>
          </div>
          {subscribed ? (
            <p className="text-[#F5B400] font-semibold text-sm">Thanks! You're subscribed.</p>
          ) : (
            <form onSubmit={handleSubscribe} className="flex gap-2 w-full sm:w-auto">
              <input
                type="email"
                value={newsletterEmail}
                onChange={e => setNewsletterEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="flex-1 sm:w-64 bg-white/8 border border-white/12 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-[#F5B400]/40 transition-colors"
              />
              <button type="submit" className="bg-[#F5B400] hover:bg-[#FFD24A] text-[#071A2F] font-black text-sm px-5 py-2.5 rounded-lg transition-colors whitespace-nowrap">
                Subscribe
              </button>
            </form>
          )}
        </div>
      </div>

      {/* ── Main grid ────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-6">

          {/* Brand column */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-1 lg:pr-4">
            <button onClick={() => onNavigate('home')} className="flex items-center gap-2.5 mb-4 group">
              <div className="w-9 h-9 bg-[#F5B400] rounded-xl flex items-center justify-center shadow-md shadow-[#F5B400]/20 group-hover:scale-105 transition-transform">
                <Truck className="w-4.5 h-4.5 text-[#071A2F]" />
              </div>
              <div>
                <span className="text-white font-black text-[13px] tracking-wide block leading-tight">FAST MAN & VAN</span>
                <span className="text-[#F5B400]/40 text-[8px] font-semibold tracking-[0.2em] uppercase block">UK Transport Network</span>
              </div>
            </button>
            <p className="text-white/30 text-[12px] leading-relaxed mb-5">
              UK's smart moving &amp; transport platform — connecting customers with verified professional drivers.
            </p>
            <div className="space-y-2 mb-6">
              <a href="tel:+447432112438" className="flex items-center gap-2 text-white/40 hover:text-white/70 text-[12px] transition-colors">
                <Phone className="w-3.5 h-3.5 text-[#F5B400]/50 shrink-0" /> +44 7432 112438
              </a>
              <a href="mailto:info@fastmanandvan.org" className="flex items-center gap-2 text-white/40 hover:text-white/70 text-[12px] transition-colors">
                <Mail className="w-3.5 h-3.5 text-[#F5B400]/50 shrink-0" /> info@fastmanandvan.org
              </a>
              <div className="flex items-start gap-2 text-white/30 text-[12px]">
                <MapPin className="w-3.5 h-3.5 text-[#F5B400]/50 shrink-0 mt-0.5" />
                <span>111 Royal Crescent, IG2 7JZ<br />London, United Kingdom</span>
              </div>
            </div>
            {/* Social icons */}
            <div className="flex items-center gap-2.5">
              {[
                { Icon: Twitter,   href: '#' },
                { Icon: Facebook,  href: '#' },
                { Icon: Linkedin,  href: '#' },
                { Icon: Instagram, href: '#' },
              ].map(({ Icon, href }, i) => (
                <a key={i} href={href} target="_blank" rel="noopener noreferrer"
                  className="w-8 h-8 bg-white/6 hover:bg-[#F5B400]/15 border border-white/8 hover:border-[#F5B400]/20 rounded-lg flex items-center justify-center transition-all">
                  <Icon className="w-3.5 h-3.5 text-white/45 hover:text-[#F5B400]" />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white/50 text-[10px] font-bold tracking-[0.18em] uppercase mb-4">Services</h4>
            <ul className="space-y-2.5">
              {SERVICES.map(link => (
                <li key={link.label}>
                  <button onClick={() => onNavigate(link.page)} className="text-[12px] text-white/35 hover:text-white/75 transition-colors text-left">
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Cities */}
          <div>
            <h4 className="text-white/50 text-[10px] font-bold tracking-[0.18em] uppercase mb-4">Cities</h4>
            <ul className="space-y-2.5">
              {CITIES.map(link => (
                <li key={link.label}>
                  <button onClick={() => onNavigate(link.page)} className="text-[12px] text-white/35 hover:text-white/75 transition-colors text-left">
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white/50 text-[10px] font-bold tracking-[0.18em] uppercase mb-4">Company</h4>
            <ul className="space-y-2.5">
              {COMPANY.map(link => (
                <li key={link.label}>
                  <button onClick={() => onNavigate(link.page)} className="text-[12px] text-white/35 hover:text-white/75 transition-colors text-left">
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white/50 text-[10px] font-bold tracking-[0.18em] uppercase mb-4">Resources</h4>
            <ul className="space-y-2.5">
              {RESOURCES.map(link => (
                <li key={link.label}>
                  <button onClick={() => onNavigate(link.page)} className="text-[12px] text-white/35 hover:text-white/75 transition-colors text-left">
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ── Corporate row ────────────────────────────────────────────── */}
      <div className="border-t border-white/[0.05]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <p className="text-white/30 text-[10px] font-bold tracking-[0.18em] uppercase mb-3">Corporate</p>
          <div className="flex flex-wrap gap-x-8 gap-y-2">
            {CORPORATE.map(link => (
              <button key={link.label} onClick={() => onNavigate(link.page)}
                className="text-[12px] text-white/35 hover:text-white/70 transition-colors flex items-center gap-1.5">
                {link.label}
                {link.soon && <span className="text-[9px] text-[#F5B400]/35 font-bold tracking-widest uppercase">Soon</span>}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Payments + App badges ─────────────────────────────────────── */}
      <div className="border-t border-white/[0.05]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row gap-8 sm:items-center justify-between">
          <div>
            <p className="text-white/30 text-[10px] font-bold tracking-[0.18em] uppercase mb-3">We Accept</p>
            <div className="flex flex-wrap gap-2">
              {PAYMENT_BADGES.map(badge => (
                <span key={badge} className="px-3 py-1 bg-white/6 border border-white/10 rounded-md text-white/45 text-[11px] font-semibold">
                  {badge}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-white/30 text-[10px] font-bold tracking-[0.18em] uppercase mb-3">Coming Soon on iOS &amp; Android</p>
            <div className="flex gap-3">
              {[
                { store: 'App Store', sub: 'Download on the' },
                { store: 'Google Play', sub: 'Get it on' },
              ].map(({ store, sub }) => (
                <div key={store} className="flex items-center gap-2.5 bg-white/6 border border-white/10 rounded-lg px-4 py-2.5 opacity-60 cursor-not-allowed">
                  <svg className="w-5 h-5 text-white/50" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
                  </svg>
                  <div>
                    <p className="text-white/30 text-[9px] leading-none">{sub}</p>
                    <p className="text-white/60 text-[12px] font-bold leading-tight">{store}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Company info bar ─────────────────────────────────────────── */}
      <div className="border-t border-white/[0.05]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-white/30 text-[9px] font-bold tracking-[0.2em] uppercase mb-2">Company</p>
            <p className="text-white/55 text-[12px] font-semibold">Golden Recruit LMT</p>
            <p className="text-white/28 text-[11px]">Trading as Fast Man &amp; Van</p>
            <p className="text-white/28 text-[11px]">Registered in England &amp; Wales</p>
          </div>
          <div>
            <p className="text-white/30 text-[9px] font-bold tracking-[0.2em] uppercase mb-2">VAT</p>
            <p className="text-white/55 text-[12px] font-semibold">VAT Registered</p>
            <p className="text-white/28 text-[11px]">United Kingdom</p>
          </div>
          <div>
            <p className="text-white/30 text-[9px] font-bold tracking-[0.2em] uppercase mb-2">Insurance</p>
            <p className="text-white/55 text-[12px] font-semibold">Goods-in-transit cover</p>
            <p className="text-white/28 text-[11px]">Up to £50,000 per booking</p>
          </div>
          <div>
            <p className="text-white/30 text-[9px] font-bold tracking-[0.2em] uppercase mb-2">Support</p>
            <p className="text-white/55 text-[12px] font-semibold">info@fastmanandvan.org</p>
            <p className="text-white/28 text-[11px]">Mon–Sun · 08:00–20:00</p>
          </div>
        </div>
      </div>

      {/* ── Legal bottom line ────────────────────────────────────────── */}
      <div className="border-t border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/20 text-[11px]">
            &copy; {new Date().getFullYear()} Fast Man &amp; Van — a trading name of Golden Recruit LMT. All rights reserved.
          </p>
          <div className="flex items-center gap-4 flex-wrap justify-center">
            {LEGAL.map(link => (
              <button key={link.label} onClick={() => onNavigate(link.page)}
                className="text-white/22 hover:text-white/50 text-[11px] transition-colors">
                {link.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
