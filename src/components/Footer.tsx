import React, { useState } from 'react';
import { Truck, Mail, Phone, MapPin, ArrowRight, CheckCircle } from 'lucide-react';
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
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-[#061539] text-white">
      {/* Newsletter */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold mb-2">Stay Updated</h3>
              <p className="text-white/60">Get the latest offers, driver opportunities, and platform updates.</p>
            </div>
            <form onSubmit={handleSubscribe} className="flex gap-2 w-full md:w-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 md:w-72 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-[#D4AF37]"
                required
              />
              <button type="submit" className="bg-[#D4AF37] hover:bg-[#C5A028] text-[#0A2463] px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors whitespace-nowrap">
                {subscribed ? <><CheckCircle className="w-4 h-4" /> Subscribed!</> : <><ArrowRight className="w-4 h-4" /> Subscribe</>}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-[#D4AF37] rounded-lg flex items-center justify-center">
                <Truck className="w-6 h-6 text-[#0A2463]" />
              </div>
              <div>
                <h4 className="font-bold text-lg">FAST MAN & VAN</h4>
              </div>
            </div>
            <p className="text-white/50 text-sm mb-4 leading-relaxed">{BRAND.tagline}. Connecting customers with professional drivers across the UK.</p>
            <div className="space-y-2 text-sm text-white/50">
              <div className="flex items-center gap-2"><Phone className="w-4 h-4" /> {BRAND.whatsappDisplay}</div>
              <div className="flex items-center gap-2"><Mail className="w-4 h-4" /> {BRAND.email}</div>
              <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /> United Kingdom</div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-white mb-4">Services</h4>
            <ul className="space-y-2 text-sm text-white/50">
              <li><button onClick={() => onNavigate('home')} className="hover:text-[#D4AF37] transition-colors">Man and Van</button></li>
              <li><button onClick={() => onNavigate('home')} className="hover:text-[#D4AF37] transition-colors">House Moving</button></li>
              <li><button onClick={() => onNavigate('home')} className="hover:text-[#D4AF37] transition-colors">Office Relocation</button></li>
              <li><button onClick={() => onNavigate('home')} className="hover:text-[#D4AF37] transition-colors">Furniture Delivery</button></li>
              <li><button onClick={() => onNavigate('home')} className="hover:text-[#D4AF37] transition-colors">Student Moves</button></li>
              <li><button onClick={() => onNavigate('home')} className="hover:text-[#D4AF37] transition-colors">Same Day Delivery</button></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-white/50">
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
            <h4 className="font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-white/50">
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

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-white/40 text-sm">&copy; {new Date().getFullYear()} Fast Man & Van. All rights reserved. Independent contractor marketplace.</p>
            <div className="flex items-center gap-4 text-white/40 text-sm">
              <span>GDPR Compliant</span>
              <span className="w-1 h-1 bg-white/20 rounded-full" />
              <span>ICO Registered</span>
              <span className="w-1 h-1 bg-white/20 rounded-full" />
              <span>Fully Insured</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
