import React, { useState } from 'react';
import { Building2, Users, FileText, BarChart3, Repeat, Plus, CheckCircle, ArrowRight, Upload, Calendar, MapPin, Clock, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface CorporatePortalProps {
  onNavigate: (page: string) => void;
}

const deliveryData = [
  { week: 'W1', deliveries: 45, cost: 3200 },
  { week: 'W2', deliveries: 52, cost: 3800 },
  { week: 'W3', deliveries: 48, cost: 3500 },
  { week: 'W4', deliveries: 61, cost: 4200 },
];

const CorporatePortal: React.FC<CorporatePortalProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showSignup, setShowSignup] = useState(true);
  const [companyName, setCompanyName] = useState('');
  const [companyEmail, setCompanyEmail] = useState('');
  const [companyPhone, setCompanyPhone] = useState('');
  const [registered, setRegistered] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (companyName && companyEmail) {
      setRegistered(true);
      setShowSignup(false);
    }
  };

  if (showSignup && !registered) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#0A2463] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Corporate Logistics Portal</h1>
            <p className="text-gray-600 max-w-xl mx-auto">Streamline your business deliveries with bulk bookings, recurring schedules, and detailed analytics.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Create Corporate Account</h2>
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                  <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0A2463] outline-none" placeholder="Your Company Ltd" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Business Email</label>
                  <input type="email" value={companyEmail} onChange={(e) => setCompanyEmail(e.target.value)} required className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0A2463] outline-none" placeholder="logistics@company.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input type="tel" value={companyPhone} onChange={(e) => setCompanyPhone(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0A2463] outline-none" placeholder="+44 20 xxxx xxxx" />
                </div>
                <button type="submit" className="w-full bg-[#0A2463] hover:bg-[#1B3A8C] text-white py-3.5 rounded-xl font-bold text-lg transition-colors flex items-center justify-center gap-2">
                  Create Account <ArrowRight className="w-5 h-5" />
                </button>
              </form>
              <button onClick={() => { setShowSignup(false); }} className="w-full mt-3 text-[#0A2463] text-sm font-medium hover:underline text-center">
                View demo portal
              </button>
            </div>

            <div className="space-y-4">
              {[
                { icon: Repeat, title: 'Recurring Deliveries', desc: 'Set up automated delivery schedules that run daily, weekly, or monthly.' },
                { icon: FileText, title: 'Monthly Invoicing', desc: 'Consolidated invoices with full breakdowns for easy accounting.' },
                { icon: Users, title: 'Multi-User Access', desc: 'Add team members with role-based permissions and spending limits.' },
                { icon: BarChart3, title: 'Analytics Reports', desc: 'Real-time delivery analytics, cost reports, and performance metrics.' },
                { icon: Building2, title: 'Priority Dispatch', desc: 'Corporate bookings receive priority driver assignment.' },
                { icon: TrendingUp, title: 'Volume Discounts', desc: 'Save up to 25% with corporate volume pricing.' },
              ].map((f, idx) => (
                <div key={idx} className="flex gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 bg-[#0A2463]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <f.icon className="w-5 h-5 text-[#0A2463]" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{f.title}</p>
                    <p className="text-gray-500 text-sm">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Corporate Dashboard
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{companyName || 'TechFlow Ltd'} - Corporate Portal</h1>
            <p className="text-gray-500">Manage your business deliveries</p>
          </div>
          <button onClick={() => onNavigate('home')} className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">Back</button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {['dashboard', 'bookings', 'recurring', 'team', 'invoices'].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors capitalize ${
              activeTab === tab ? 'bg-[#0A2463] text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}>{tab}</button>
          ))}
        </div>

        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Deliveries', value: '206', icon: MapPin },
                { label: 'This Month Cost', value: '£14,700', icon: FileText },
                { label: 'Active Schedules', value: '8', icon: Repeat },
                { label: 'Team Members', value: '5', icon: Users },
              ].map((s, idx) => (
                <div key={idx} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                  <s.icon className="w-6 h-6 text-[#0A2463] mb-2" />
                  <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                  <p className="text-gray-500 text-sm">{s.label}</p>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4">Monthly Delivery Analytics</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={deliveryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="week" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="deliveries" fill="#0A2463" radius={[4, 4, 0, 0]} name="Deliveries" />
                  <Bar dataKey="cost" fill="#D4AF37" radius={[4, 4, 0, 0]} name="Cost (£)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">Bulk Booking</h3>
              <button className="flex items-center gap-2 bg-[#0A2463] hover:bg-[#1B3A8C] text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                <Upload className="w-4 h-4" /> Import CSV
              </button>
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="grid grid-cols-1 md:grid-cols-4 gap-3 p-4 bg-gray-50 rounded-xl">
                  <input type="text" placeholder="Pickup address" className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#0A2463]" />
                  <input type="text" placeholder="Delivery address" className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#0A2463]" />
                  <input type="date" className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#0A2463]" />
                  <select className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#0A2463]">
                    <option>Small Van</option>
                    <option>Medium Van</option>
                    <option>Large Van</option>
                    <option>Luton Van</option>
                  </select>
                </div>
              ))}
              <button className="flex items-center gap-2 text-[#0A2463] text-sm font-medium hover:underline">
                <Plus className="w-4 h-4" /> Add another delivery
              </button>
              <button className="w-full bg-[#D4AF37] hover:bg-[#C5A028] text-[#0A2463] py-3 rounded-xl font-bold transition-colors">
                Submit Bulk Booking
              </button>
            </div>
          </div>
        )}

        {activeTab === 'recurring' && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4">Recurring Delivery Schedules</h3>
            <div className="space-y-3">
              {[
                { route: 'Warehouse → Store A', freq: 'Daily', time: '08:00', vehicle: 'Large Van', active: true },
                { route: 'Office → Client HQ', freq: 'Weekly (Mon)', time: '10:00', vehicle: 'Small Van', active: true },
                { route: 'Supplier → Warehouse', freq: 'Bi-weekly', time: '14:00', vehicle: 'Luton Van', active: false },
              ].map((s, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-4">
                    <Repeat className={`w-5 h-5 ${s.active ? 'text-green-500' : 'text-gray-400'}`} />
                    <div>
                      <p className="font-semibold text-gray-900">{s.route}</p>
                      <p className="text-gray-500 text-sm">{s.freq} at {s.time} • {s.vehicle}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${s.active ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}>
                      {s.active ? 'Active' : 'Paused'}
                    </span>
                    <button className="text-[#0A2463] text-sm font-medium hover:underline">Edit</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'team' && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">Team Members</h3>
              <button className="flex items-center gap-2 bg-[#0A2463] hover:bg-[#1B3A8C] text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                <Plus className="w-4 h-4" /> Add Member
              </button>
            </div>
            <div className="space-y-3">
              {[
                { name: 'John Smith', email: 'john@company.com', role: 'Admin', bookings: 45 },
                { name: 'Sarah Jones', email: 'sarah@company.com', role: 'Manager', bookings: 32 },
                { name: 'Mike Wilson', email: 'mike@company.com', role: 'Booker', bookings: 28 },
                { name: 'Emma Brown', email: 'emma@company.com', role: 'Booker', bookings: 15 },
                { name: 'Tom Davis', email: 'tom@company.com', role: 'Viewer', bookings: 0 },
              ].map((m, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#0A2463] rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {m.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{m.name}</p>
                      <p className="text-gray-500 text-sm">{m.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500">{m.bookings} bookings</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      m.role === 'Admin' ? 'bg-purple-100 text-purple-700' :
                      m.role === 'Manager' ? 'bg-blue-100 text-blue-700' :
                      m.role === 'Booker' ? 'bg-green-100 text-green-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>{m.role}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'invoices' && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4">Monthly Invoices</h3>
            <div className="space-y-3">
              {[
                { month: 'March 2026', amount: '£14,700', deliveries: 206, status: 'current' },
                { month: 'February 2026', amount: '£12,350', deliveries: 178, status: 'paid' },
                { month: 'January 2026', amount: '£11,800', deliveries: 165, status: 'paid' },
                { month: 'December 2025', amount: '£15,200', deliveries: 220, status: 'paid' },
              ].map((inv, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-semibold text-gray-900">{inv.month}</p>
                    <p className="text-gray-500 text-sm">{inv.deliveries} deliveries</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="text-xl font-bold text-[#0A2463]">{inv.amount}</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      inv.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                    }`}>{inv.status}</span>
                    <button className="text-[#0A2463] text-sm font-medium hover:underline">Download</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CorporatePortal;
