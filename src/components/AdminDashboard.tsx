import React, { useState, useEffect, useMemo } from 'react';
import { BarChart3, Users, Truck, DollarSign, CheckCircle, XCircle, Clock, AlertTriangle, Star, Shield, Search, TrendingUp, Activity, Loader2, AlertCircle, Lock, Unlock, RefreshCw } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { getAllDrivers, updateDriverStatus } from '@/services/drivers';
import { getAllBookings } from '@/services/bookings';
import { getEscrowPayments, releaseEscrowManually, refundEscrowManually, type EscrowPayment } from '@/services/escrow';
import type { Driver, Booking } from '@/types';

interface AdminDashboardProps {
  onNavigate: (page: string) => void;
}


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
  const [escrowPayments, setEscrowPayments] = useState<EscrowPayment[]>([]);
  const [loadingDrivers, setLoadingDrivers] = useState(true);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [loadingEscrow, setLoadingEscrow] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionError, setActionError] = useState<string | null>(null);
  const [escrowActionId, setEscrowActionId] = useState<string | null>(null);

  const refreshEscrow = () => {
    setLoadingEscrow(true);
    getEscrowPayments().then(({ data }) => { setEscrowPayments(data); setLoadingEscrow(false); });
  };

  useEffect(() => {
    getAllDrivers().then(({ data }) => { setDrivers(data); setLoadingDrivers(false); });
    getAllBookings().then(({ data }) => { setBookings(data); setLoadingBookings(false); });
    refreshEscrow();
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

  const handleReleaseEscrow = async (bookingId: string) => {
    setActionError(null);
    setEscrowActionId(bookingId);
    const { error } = await releaseEscrowManually(bookingId);
    setEscrowActionId(null);
    if (error) { setActionError(error.message); return; }
    refreshEscrow();
  };

  const handleRefundEscrow = async (bookingId: string) => {
    if (!confirm('Refund this payment? The driver\'s pending balance will be reversed. You must also refund the customer via the Stripe Dashboard.')) return;
    setActionError(null);
    setEscrowActionId(bookingId);
    const { error } = await refundEscrowManually(bookingId);
    setEscrowActionId(null);
    if (error) { setActionError(error.message); return; }
    refreshEscrow();
  };

  const revenueData = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const revenue = bookings
        .filter(b => b.created_at.slice(0, 7) === key)
        .reduce((s, b) => s + (b.estimated_price ?? 0), 0);
      return { month: d.toLocaleDateString('en-GB', { month: 'short' }), revenue };
    });
  }, [bookings]);

  const bookingsByDay = useMemo(() => {
    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const counts = new Array(7).fill(0);
    bookings.forEach(b => {
      const dow = new Date(b.created_at).getDay();
      counts[dow === 0 ? 6 : dow - 1]++;
    });
    return labels.map((day, i) => ({ day, bookings: counts[i] }));
  }, [bookings]);

  const vehicleData = useMemo(() => {
    const palette = ['#0A2463', '#1B3A8C', '#D4AF37', '#C5A028', '#2563EB'];
    const counts = new Map<string, number>();
    bookings.forEach(b => counts.set(b.vehicle_type, (counts.get(b.vehicle_type) ?? 0) + 1));
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([name, value], i) => ({ name, value, color: palette[i % palette.length] }));
  }, [bookings]);

  const topDrivers = useMemo(() =>
    [...drivers].sort((a, b) => b.total_jobs - a.total_jobs).slice(0, 10),
  [drivers]);

  const pendingDrivers = drivers.filter(d => d.status === 'pending');
  const filteredDrivers = drivers.filter(d =>
    `${d.first_name} ${d.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const escrowHeld = escrowPayments.filter(e => e.status === 'escrow');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'drivers', label: 'Driver Approvals', icon: Users },
    { id: 'bookings', label: 'Bookings', icon: Truck },
    { id: 'escrow', label: 'Escrow', icon: Lock },
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
                {tab.id === 'escrow' && escrowHeld.length > 0 && (
                  <span className="ml-auto bg-blue-400 text-white text-xs rounded-full px-1.5 py-0.5">{escrowHeld.length}</span>
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
                  <h3 className="font-bold text-gray-900 mb-4">Revenue — Last 6 Months</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" fontSize={12} />
                      <YAxis fontSize={12} tickFormatter={v => v === 0 ? '£0' : `£${(v / 1000).toFixed(0)}k`} />
                      <Tooltip formatter={(v: number) => [`£${v.toLocaleString()}`, 'Revenue']} />
                      <Bar dataKey="revenue" fill="#0A2463" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-4">Bookings by Day of Week</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={bookingsByDay}>
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
                  {vehicleData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie data={vehicleData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                          {vehicleData.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-48 text-gray-400 text-sm">No booking data yet</div>
                  )}
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

          {/* Analytics */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Analytics</h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-1">Revenue — Last 6 Months</h3>
                  <p className="text-gray-500 text-sm mb-4">Total £{bookings.reduce((s, b) => s + (b.estimated_price ?? 0), 0).toLocaleString()} all-time</p>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" fontSize={12} />
                      <YAxis fontSize={12} tickFormatter={v => v === 0 ? '£0' : `£${(v / 1000).toFixed(0)}k`} />
                      <Tooltip formatter={(v: number) => [`£${v.toLocaleString()}`, 'Revenue']} />
                      <Bar dataKey="revenue" fill="#0A2463" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-1">Booking Volume by Day</h3>
                  <p className="text-gray-500 text-sm mb-4">All-time distribution across days of the week</p>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={bookingsByDay}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="day" fontSize={12} />
                      <YAxis fontSize={12} />
                      <Tooltip />
                      <Bar dataKey="bookings" fill="#D4AF37" radius={[4, 4, 0, 0]} name="Bookings" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-4">Vehicle Mix</h3>
                  {vehicleData.length > 0 ? (
                    <>
                      <ResponsiveContainer width="100%" height={180}>
                        <PieChart>
                          <Pie data={vehicleData} cx="50%" cy="50%" innerRadius={45} outerRadius={75} dataKey="value">
                            {vehicleData.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
                          </Pie>
                          <Tooltip formatter={(v: number, name: string) => [v, name]} />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="space-y-1.5 mt-3">
                        {vehicleData.map((v, i) => (
                          <div key={i} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: v.color }} />
                              <span className="text-gray-600">{v.name}</span>
                            </div>
                            <span className="font-semibold text-gray-900">{v.value}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-48 text-gray-400 text-sm">No data yet</div>
                  )}
                </div>

                <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-4">Driver Performance</h3>
                  {loadingDrivers ? (
                    <div className="flex items-center justify-center py-8"><Loader2 className="w-6 h-6 text-[#0A2463] animate-spin" /></div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-left text-gray-500 border-b border-gray-100">
                            <th className="pb-2 font-medium">Driver</th>
                            <th className="pb-2 font-medium">Vehicle</th>
                            <th className="pb-2 font-medium">Tier</th>
                            <th className="pb-2 font-medium">Jobs</th>
                            <th className="pb-2 font-medium">Earnings</th>
                            <th className="pb-2 font-medium">Rating</th>
                            <th className="pb-2 font-medium">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {topDrivers.map(d => (
                            <tr key={d.id} className="hover:bg-gray-50">
                              <td className="py-2.5 font-medium text-gray-900">{d.first_name} {d.last_name}</td>
                              <td className="py-2.5 text-gray-500 text-xs">{d.vehicle_make} {d.vehicle_model}</td>
                              <td className="py-2.5">
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${d.tier === 'gold' ? 'bg-[#D4AF37]/20 text-[#8B6914]' : 'bg-gray-100 text-gray-600'}`}>
                                  {d.tier}
                                </span>
                              </td>
                              <td className="py-2.5 font-semibold text-gray-900">{d.total_jobs}</td>
                              <td className="py-2.5 font-semibold text-gray-900">£{d.total_earnings.toLocaleString()}</td>
                              <td className="py-2.5">
                                <span className="flex items-center gap-1 text-[#D4AF37]">
                                  <Star className="w-3 h-3 fill-current" />{d.rating.toFixed(1)}
                                </span>
                              </td>
                              <td className="py-2.5">
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                  d.status === 'active' || d.status === 'approved' ? 'bg-green-100 text-green-700' :
                                  d.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                                }`}>{d.status}</span>
                              </td>
                            </tr>
                          ))}
                          {topDrivers.length === 0 && (
                            <tr><td colSpan={7} className="py-8 text-center text-gray-400">No drivers yet.</td></tr>
                          )}
                        </tbody>
                      </table>
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
                          {(driver.license_document_url || driver.insurance_document_url || driver.vehicle_registration_url || driver.vehicle_photo_url) && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {driver.license_document_url && (
                                <a href={driver.license_document_url} target="_blank" rel="noopener noreferrer" className="text-xs text-[#0A2463] underline hover:text-[#1B3A8C]">License</a>
                              )}
                              {driver.insurance_document_url && (
                                <a href={driver.insurance_document_url} target="_blank" rel="noopener noreferrer" className="text-xs text-[#0A2463] underline hover:text-[#1B3A8C]">Insurance</a>
                              )}
                              {driver.vehicle_registration_url && (
                                <a href={driver.vehicle_registration_url} target="_blank" rel="noopener noreferrer" className="text-xs text-[#0A2463] underline hover:text-[#1B3A8C]">V5C</a>
                              )}
                              {driver.vehicle_photo_url && (
                                <a href={driver.vehicle_photo_url} target="_blank" rel="noopener noreferrer" className="text-xs text-[#0A2463] underline hover:text-[#1B3A8C]">Vehicle Photo</a>
                              )}
                            </div>
                          )}
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

          {/* Escrow Management */}
          {activeTab === 'escrow' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Escrow Management</h2>
                  <p className="text-gray-500 text-sm mt-0.5">Release or refund payments held in escrow</p>
                </div>
                <button onClick={refreshEscrow} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 bg-white border border-gray-200 px-3 py-2 rounded-lg transition-colors">
                  <RefreshCw className="w-4 h-4" /> Refresh
                </button>
              </div>

              {/* Summary cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Held in Escrow', count: escrowPayments.filter(e => e.status === 'escrow').length, value: escrowPayments.filter(e => e.status === 'escrow').reduce((s, e) => s + (e.driver_earning ?? 0) + (e.commission_amount ?? 0), 0), color: 'bg-blue-500' },
                  { label: 'Released', count: escrowPayments.filter(e => e.status === 'released').length, value: escrowPayments.filter(e => e.status === 'released').reduce((s, e) => s + (e.driver_earning ?? 0) + (e.commission_amount ?? 0), 0), color: 'bg-green-500' },
                  { label: 'Refunded', count: escrowPayments.filter(e => e.status === 'refunded').length, value: escrowPayments.filter(e => e.status === 'refunded').reduce((s, e) => s + (e.driver_earning ?? 0) + (e.commission_amount ?? 0), 0), color: 'bg-red-500' },
                  { label: 'Total Commission', count: null, value: escrowPayments.filter(e => e.status === 'released').reduce((s, e) => s + (e.commission_amount ?? 0), 0), color: 'bg-[#D4AF37]' },
                ].map((card, i) => (
                  <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className={`w-8 h-8 ${card.color} rounded-lg flex items-center justify-center mb-3`}>
                      <Lock className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">£{card.value.toFixed(2)}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{card.label}</p>
                    {card.count !== null && <p className="text-xs text-gray-400">{card.count} payment{card.count !== 1 ? 's' : ''}</p>}
                  </div>
                ))}
              </div>

              {loadingEscrow ? (
                <div className="flex items-center justify-center py-12"><Loader2 className="w-8 h-8 text-[#0A2463] animate-spin" /></div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr className="text-left text-gray-500">
                          <th className="px-4 py-3 font-medium">Booking</th>
                          <th className="px-4 py-3 font-medium">Route</th>
                          <th className="px-4 py-3 font-medium">Total</th>
                          <th className="px-4 py-3 font-medium">Driver Earns</th>
                          <th className="px-4 py-3 font-medium">Commission</th>
                          <th className="px-4 py-3 font-medium">Status</th>
                          <th className="px-4 py-3 font-medium">Date</th>
                          <th className="px-4 py-3 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {escrowPayments.map(ep => {
                          const total = (ep.driver_earning ?? 0) + (ep.commission_amount ?? 0);
                          const isProcessing = escrowActionId === ep.booking_id;
                          return (
                            <tr key={ep.id} className="border-t border-gray-100 hover:bg-gray-50">
                              <td className="px-4 py-3 font-mono text-xs text-gray-400">
                                {ep.booking?.booking_ref ?? ep.booking_id.slice(0, 8).toUpperCase()}
                              </td>
                              <td className="px-4 py-3 text-xs text-gray-600 max-w-[180px] truncate">
                                {ep.booking
                                  ? `${ep.booking.collection_address.split(',')[0]} → ${ep.booking.delivery_address.split(',')[0]}`
                                  : '—'}
                              </td>
                              <td className="px-4 py-3 font-semibold text-gray-900">£{total.toFixed(2)}</td>
                              <td className="px-4 py-3 text-green-700 font-medium">£{(ep.driver_earning ?? 0).toFixed(2)}</td>
                              <td className="px-4 py-3 text-[#8B6914] font-medium">£{(ep.commission_amount ?? 0).toFixed(2)}</td>
                              <td className="px-4 py-3">
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                  ep.status === 'escrow'    ? 'bg-blue-100 text-blue-700' :
                                  ep.status === 'released'  ? 'bg-green-100 text-green-700' :
                                  ep.status === 'refunded'  ? 'bg-red-100 text-red-700' :
                                  'bg-gray-100 text-gray-600'
                                }`}>{ep.status}</span>
                              </td>
                              <td className="px-4 py-3 text-xs text-gray-400">
                                {new Date(ep.created_at).toLocaleDateString('en-GB')}
                              </td>
                              <td className="px-4 py-3">
                                {ep.status === 'escrow' ? (
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => handleReleaseEscrow(ep.booking_id)}
                                      disabled={isProcessing}
                                      className="flex items-center gap-1 bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                                    >
                                      {isProcessing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Unlock className="w-3 h-3" />}
                                      Release
                                    </button>
                                    <button
                                      onClick={() => handleRefundEscrow(ep.booking_id)}
                                      disabled={isProcessing}
                                      className="flex items-center gap-1 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                                    >
                                      {isProcessing ? <Loader2 className="w-3 h-3 animate-spin" /> : <XCircle className="w-3 h-3" />}
                                      Refund
                                    </button>
                                  </div>
                                ) : (
                                  <span className="text-gray-400 text-xs italic">
                                    {ep.status === 'released' ? `Released ${ep.released_at ? new Date(ep.released_at).toLocaleDateString('en-GB') : ''}` : ep.status}
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                    {escrowPayments.length === 0 && (
                      <div className="text-center py-12">
                        <Lock className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                        <p className="text-gray-400 text-sm">No escrow payments yet.</p>
                      </div>
                    )}
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
