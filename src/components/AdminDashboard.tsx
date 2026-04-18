import React, { useState, useEffect } from 'react';
import { BarChart3, Users, Truck, DollarSign, CheckCircle, XCircle, Clock, AlertTriangle, Star, Shield, Search, Eye, TrendingUp, Activity, Loader2, AlertCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { getAllDrivers, updateDriverStatus } from '@/services/drivers';
import { getAllBookings } from '@/services/bookings';
import type { Driver, Booking } from '@/types';

interface AdminDashboardProps {
  onNavigate: (page: string) => void;
}

const revenueData = [
  { month: 'Sep', revenue: 45000 }, { month: 'Oct', revenue: 52000 }, { month: 'Nov', revenue: 61000 },
  { month: 'Dec', revenue: 78000 }, { month: 'Jan', revenue: 65000 }, { month: 'Feb', revenue: 72000 }, { month: 'Mar', revenue: 85000 },
];
const bookingsData = [
  { day: 'Mon', bookings: 120 }, { day: 'Tue', bookings: 145 }, { day: 'Wed', bookings: 132 },
  { day: 'Thu', bookings: 168 }, { day: 'Fri', bookings: 195 }, { day: 'Sat', bookings: 210 }, { day: 'Sun', bookings: 88 },
];
const pieData = [
  { name: 'Small Van', value: 25, color: '#0A2463' },
  { name: 'Medium Van', value: 40, color: '#1B3A8C' },
  { name: 'Large Van', value: 25, color: '#D4AF37' },
  { name: 'Luton Van', value: 10, color: '#C5A028' },
];

const STATUS_COLOURS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  assigned: 'bg-indigo-100 text-indigo-700',
  in_progress: 'bg-purple-100 text-purple-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingDrivers, setLoadingDrivers] = useState(true);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    getAllDrivers().then(({ data }) => { setDrivers(data); setLoadingDrivers(false); });
    getAllBookings().then(({ data }) => { setBookings(data); setLoadingBookings(false); });
  }, []);

  const approveDriver = async (id: string) => {
    setActionError(null);
    const { error } = await updateDriverStatus(id, 'approved');
    if (error) { setActionError(error.message); return; }
    setDrivers(prev => prev.map(d => d.id === id ? { ...d, status: 'approved' } : d));
  };

  const rejectDriver = async (id: string) => {
    setActionError(null);
    const { error } = await updateDriverStatus(id, 'rejected');
    if (error) { setActionError(error.message); return; }
    setDrivers(prev => prev.map(d => d.id === id ? { ...d, status: 'rejected' } : d));
  };

  const pendingDrivers = drivers.filter(d => d.status === 'pending');
  const filteredDrivers = drivers.filter(d =>
    `${d.first_name} ${d.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'drivers', label: 'Driver Approvals', icon: Users },
    { id: 'bookings', label: 'Bookings', icon: Truck },
    { id: 'pricing', label: 'Pricing Rules', icon: DollarSign },
    { id: 'disputes', label: 'Disputes', icon: AlertTriangle },
  ];

  const stats = [
    { label: 'Total Revenue', value: `£${bookings.reduce((s, b) => s + b.estimated_price, 0).toLocaleString()}`, change: 'live', icon: DollarSign, color: 'bg-green-500' },
    { label: 'Total Drivers', value: drivers.length.toString(), change: `${drivers.filter(d => d.status === 'active' || d.status === 'approved').length} active`, icon: Truck, color: 'bg-blue-500' },
    { label: 'Total Bookings', value: bookings.length.toString(), change: `${bookings.filter(b => b.status === 'completed').length} completed`, icon: BarChart3, color: 'bg-purple-500' },
    { label: 'Avg Rating', value: drivers.length ? (drivers.reduce((s, d) => s + d.rating, 0) / drivers.length).toFixed(2) : '—', change: 'avg', icon: Star, color: 'bg-[#D4AF37]' },
    { label: 'In Progress', value: bookings.filter(b => b.status === 'in_progress').length.toString(), change: 'live', icon: Activity, color: 'bg-red-500' },
    { label: 'Pending Approvals', value: pendingDrivers.length.toString(), change: pendingDrivers.length > 0 ? 'action needed' : 'all clear', icon: Clock, color: 'bg-orange-500' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 pt-20">
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden lg:block w-64 bg-[#0A2463] min-h-screen p-4 fixed left-0 top-20">
          <div className="mb-6">
            <div className="flex items-center gap-2 px-3 py-2">
              <Shield className="w-5 h-5 text-[#D4AF37]" />
              <span className="text-white font-bold">Admin Panel</span>
            </div>
          </div>
          <nav className="space-y-1">
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}>
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {tab.id === 'drivers' && pendingDrivers.length > 0 && (
                  <span className="ml-auto bg-orange-400 text-white text-xs rounded-full px-1.5 py-0.5">{pendingDrivers.length}</span>
                )}
              </button>
            ))}
          </nav>
          <div className="mt-8 p-3 bg-white/5 rounded-xl">
            <p className="text-white/40 text-xs mb-1">System Status</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-green-400 text-sm font-medium">All Systems Operational</span>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-64 p-4 sm:p-6 lg:p-8">
          {/* Mobile Tabs */}
          <div className="lg:hidden flex gap-2 overflow-x-auto pb-4 mb-4">
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id ? 'bg-[#0A2463] text-white' : 'bg-white text-gray-600'
                }`}>
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {actionError && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
              <p className="text-red-700 text-sm">{actionError}</p>
            </div>
          )}

          {/* Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {stats.map((stat, idx) => (
                  <div key={idx} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className={`w-8 h-8 ${stat.color} rounded-lg flex items-center justify-center mb-3`}>
                      <stat.icon className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{stat.label}</p>
                    <span className="text-xs font-medium text-gray-400">{stat.change}</span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-4">Revenue Trend (placeholder)</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" fontSize={12} />
                      <YAxis fontSize={12} tickFormatter={v => `£${v / 1000}k`} />
                      <Tooltip formatter={(v: number) => [`£${v.toLocaleString()}`, 'Revenue']} />
                      <Bar dataKey="revenue" fill="#0A2463" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-4">Weekly Bookings (placeholder)</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={bookingsData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="day" fontSize={12} />
                      <YAxis fontSize={12} />
                      <Tooltip />
                      <Line type="monotone" dataKey="bookings" stroke="#D4AF37" strokeWidth={3} dot={{ fill: '#D4AF37', r: 5 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-4">Vehicle Distribution</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                        {pieData.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-4">Recent Bookings</h3>
                  {loadingBookings ? (
                    <div className="flex items-center justify-center py-8"><Loader2 className="w-6 h-6 text-[#0A2463] animate-spin" /></div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-left text-gray-500 border-b border-gray-100">
                            <th className="pb-2 font-medium">Ref</th>
                            <th className="pb-2 font-medium">Route</th>
                            <th className="pb-2 font-medium">Price</th>
                            <th className="pb-2 font-medium">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {bookings.slice(0, 6).map(b => (
                            <tr key={b.id} className="border-b border-gray-50 hover:bg-gray-50">
                              <td className="py-2.5 font-mono text-xs text-gray-400">{b.booking_ref ?? b.id.slice(0, 8).toUpperCase()}</td>
                              <td className="py-2.5 text-gray-600 text-xs">{b.collection_address.split(',')[0]} → {b.delivery_address.split(',')[0]}</td>
                              <td className="py-2.5 font-semibold text-gray-800">£{b.estimated_price}</td>
                              <td className="py-2.5">
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLOURS[b.status] ?? 'bg-gray-100 text-gray-600'}`}>{b.status}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {bookings.length === 0 && <p className="text-center text-gray-400 text-sm py-6">No bookings yet.</p>}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Driver Approvals */}
          {activeTab === 'drivers' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Driver Approvals</h2>
                <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 px-3 py-2">
                  <Search className="w-4 h-4 text-gray-400" />
                  <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search drivers…" className="bg-transparent outline-none text-sm w-48" />
                </div>
              </div>
              {loadingDrivers ? (
                <div className="flex items-center justify-center py-12"><Loader2 className="w-8 h-8 text-[#0A2463] animate-spin" /></div>
              ) : (
                <div className="space-y-3">
                  {filteredDrivers.map(driver => (
                    <div key={driver.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#0A2463]/10 rounded-full flex items-center justify-center">
                          <Users className="w-6 h-6 text-[#0A2463]" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{driver.first_name} {driver.last_name}</p>
                          <p className="text-gray-500 text-sm">{driver.vehicle_make} {driver.vehicle_model} • {driver.insurance_type}</p>
                          <p className="text-gray-400 text-xs">{driver.email} · Applied: {new Date(driver.created_at).toLocaleDateString('en-GB')}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {driver.status === 'pending' ? (
                          <>
                            <button onClick={() => approveDriver(driver.id)} className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                              <CheckCircle className="w-4 h-4" /> Approve
                            </button>
                            <button onClick={() => rejectDriver(driver.id)} className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                              <XCircle className="w-4 h-4" /> Reject
                            </button>
                          </>
                        ) : (
                          <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                            driver.status === 'approved' || driver.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {driver.status}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                  {filteredDrivers.length === 0 && <p className="text-center text-gray-400 py-12">No drivers found.</p>}
                </div>
              )}
            </div>
          )}

          {/* Bookings */}
          {activeTab === 'bookings' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">All Bookings</h2>
              {loadingBookings ? (
                <div className="flex items-center justify-center py-12"><Loader2 className="w-8 h-8 text-[#0A2463] animate-spin" /></div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr className="text-left text-gray-500">
                          <th className="px-4 py-3 font-medium">Ref</th>
                          <th className="px-4 py-3 font-medium">Route</th>
                          <th className="px-4 py-3 font-medium">Price</th>
                          <th className="px-4 py-3 font-medium">Payment</th>
                          <th className="px-4 py-3 font-medium">Status</th>
                          <th className="px-4 py-3 font-medium">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.map(b => (
                          <tr key={b.id} className="border-t border-gray-100 hover:bg-gray-50">
                            <td className="px-4 py-3 font-mono text-xs text-gray-400">{b.booking_ref ?? b.id.slice(0, 8).toUpperCase()}</td>
                            <td className="px-4 py-3 text-xs text-gray-600 max-w-[200px] truncate">{b.collection_address.split(',')[0]} → {b.delivery_address.split(',')[0]}</td>
                            <td className="px-4 py-3 font-semibold">£{b.estimated_price}</td>
                            <td className="px-4 py-3 capitalize text-gray-600">{b.payment_method}</td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLOURS[b.status] ?? 'bg-gray-100 text-gray-600'}`}>{b.status}</span>
                            </td>
                            <td className="px-4 py-3 text-xs text-gray-400">{new Date(b.created_at).toLocaleDateString('en-GB')}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {bookings.length === 0 && <p className="text-center text-gray-400 text-sm py-8">No bookings yet.</p>}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Pricing Rules */}
          {activeTab === 'pricing' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Pricing Rules</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { label: 'Minimum Booking Fee', value: '£50' }, { label: 'Minimum Job Cost', value: '£80' },
                  { label: 'Additional Time Charge', value: '£30 per 30 min' }, { label: 'Platform Commission', value: '20%' },
                  { label: 'Student Discount', value: '10%' }, { label: 'Max Surge Multiplier', value: '2.5x' },
                  { label: 'Stairs Surcharge', value: '£20' }, { label: 'Helper Charge', value: '£25/helper' },
                ].map((rule, idx) => (
                  <div key={idx} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">{rule.label}</p>
                      <p className="text-[#0A2463] text-xl font-bold mt-1">{rule.value}</p>
                    </div>
                    <button className="text-[#0A2463] hover:bg-[#0A2463]/10 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors">Edit</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Disputes */}
          {activeTab === 'disputes' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Disputes & Issues</h2>
              <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
                <AlertTriangle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No open disputes.</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
