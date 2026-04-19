import React, { useState } from 'react';
import { Truck, Mail, Phone, MapPin, ArrowRight, CheckCircle, Twitter, Linkedin, Instagram, Facebook } from 'lucide-react';
import { BRAND } from '@/lib/constants';

interface FooterProps {
  onNavigate: (page: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="bg-[#040e27] text-white">

      {/* Newsletter band */}
      <div className="border-b border-white/6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-sm">
              <h3 className="text-xl font-black text-white mb-2">Stay in the loop</h3>
              <p className="text-white/40 text-sm">Latest offers, driver opportunities, and platform updates.</p>
            </div>
            <form onSubmit={handleSubscribe} className="flex gap-2 w-full md:w-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 md:w-72 px-4 py-3 rounded-xl bg-white/6 border border-white/10 text-white placeholder:text-white/25 focus:outline-none focus:border-[#D4AF37]/50 transition-colors text-sm"
                required
              />
              <button type="submit" className="bg-[#D4AF37] hover:bg-[#C5A028] text-[#061539] px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors whitespace-nowrap text-sm">
                {subscribed ? <><CheckCircle className="w-4 h-4" /> Done!</> : <><ArrowRight className="w-4 h-4" /> Subscribe</>}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10">

          {/* Brand */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-[#D4AF37] rounded-xl flex items-center justify-center shadow-lg shadow-[#D4AF37]/20">
                <Truck className="w-5 h-5 text-[#061539]" />
              </div>
              <div>
                <h4 className="font-black text-white text-sm tracking-wide">FAST MAN & VAN</h4>
                <p className="text-white/30 text-[9px] tracking-widest uppercase">Reliable Transport · UK Wide</p>
              </div>
            </div>
            <p className="text-white/35 text-sm mb-6 leading-relaxed">Connecting customers with professional independent drivers across the United Kingdom.</p>
            <div className="space-y-2.5 text-sm text-white/35 mb-6">
              <div className="flex items-center gap-2.5"><Phone className="w-3.5 h-3.5 text-[#D4AF37]/60" />{BRAND.whatsappDisplay}</div>
              <div className="flex items-center gap-2.5"><Mail className="w-3.5 h-3.5 text-[#D4AF37]/60" />{BRAND.email}</div>
              <div className="flex items-center gap-2.5"><MapPin className="w-3.5 h-3.5 text-[#D4AF37]/60" />United Kingdom</div>
            </div>
            {/* Social links */}
            <div className="flex gap-2">
              {[Twitter, Linkedin, Instagram, Facebook].map((Icon, i) => (
                <button key={i} className="w-8 h-8 bg-white/5 hover:bg-[#D4AF37]/15 border border-white/8 hover:border-[#D4AF37]/30 rounded-lg flex items-center justify-center text-white/30 hover:text-[#D4AF37] transition-all">
                  <Icon className="w-3.5 h-3.5" />
                </button>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-black text-white/80 text-xs tracking-widest uppercase mb-5">Services</h4>
            <ul className="space-y-3 text-sm text-white/35">
              {['Man and Van', 'House Moving', 'Office Relocation', 'Furniture Delivery', 'Student Moves', 'Same Day Delivery'].map((s, i) => (
                <li key={i}><button onClick={() => onNavigate('home')} className="hover:text-[#D4AF37] transition-colors text-left">{s}</button></li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-black text-white/80 text-xs tracking-widest uppercase mb-5">Company</h4>
            <ul className="space-y-3 text-sm text-white/35">
              <li><button onClick={() => onNavigate('about')} className="hover:text-[#D4AF37] transition-colors">About Us</button></li>
              <li><button onClick={() => onNavigate('driver-register')} className="hover:text-[#D4AF37] transition-colors">Become a Driver</button></li>
              <li><button onClick={() => onNavigate('corporate')} className="hover:text-[#D4AF37] transition-colors">Corporate Accounts</button></li>
              <li><button onClick={() => onNavigate('home')} className="hover:text-[#D4AF37] transition-colors">Careers</button></li>
              <li><button onClick={() => onNavigate('home')} className="hover:text-[#D4AF37] transition-colors">Press</button></li>
              <li><button onClick={() => onNavigate('contact')} className="hover:text-[#D4AF37] transition-colors">Contact</button></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-black text-white/80 text-xs tracking-widest uppercase mb-5">Legal</h4>
            <ul className="space-y-3 text-sm text-white/35">
              <li><button onClick={() => onNavigate('terms')} className="hover:text-[#D4AF37] transition-colors">Terms & Conditions</button></li>
              <li><button onClick={() => onNavigate('privacy')} className="hover:text-[#D4AF37] transition-colors">Privacy Policy</button></li>
              <li><button onClick={() => onNavigate('cookies')} className="hover:text-[#D4AF37] transition-colors">Cookie Policy</button></li>
              <li><button onClick={() => onNavigate('driver-agreement')} className="hover:text-[#D4AF37] transition-colors">Driver Agreement</button></li>
              <li><button onClick={() => onNavigate('cancellation')} className="hover:text-[#D4AF37] transition-colors">Cancellation Policy</button></li>
              <li><button onClick={() => onNavigate('home')} className="hover:text-[#D4AF37] transition-colors">GDPR Compliance</button></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-white/25 text-xs">&copy; {new Date().getFullYear()} Fast Man & Van Ltd. All rights reserved. Independent contractor marketplace.</p>
            <div className="flex items-center gap-4 text-white/20 text-xs">
              <span>GDPR Compliant</span>
              <span className="w-1 h-1 bg-white/15 rounded-full" />
              <span>ICO Registered</span>
              <span className="w-1 h-1 bg-white/15 rounded-full" />
              <span>Fully Insured</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
