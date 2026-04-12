import React, { useState } from 'react';
import { BarChart3, Users, Truck, DollarSign, CheckCircle, XCircle, Clock, AlertTriangle, Star, Shield, Search, Filter, Eye, Ban, ChevronDown, TrendingUp, Activity, MapPin } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

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

const pendingDrivers = [
  { id: 'DRV-001', name: 'Tom Wilson', vehicle: 'Ford Transit', insurance: 'Commercial', date: '2026-03-07', status: 'pending' },
  { id: 'DRV-002', name: 'Sarah Ahmed', vehicle: 'Mercedes Sprinter', insurance: 'Standard', date: '2026-03-07', status: 'pending' },
  { id: 'DRV-003', name: 'James O\'Brien', vehicle: 'Vauxhall Movano', insurance: 'Commercial', date: '2026-03-06', status: 'pending' },
  { id: 'DRV-004', name: 'Priya Patel', vehicle: 'Renault Master', insurance: 'Standard', date: '2026-03-06', status: 'pending' },
  { id: 'DRV-005', name: 'Mike Chen', vehicle: 'Iveco Daily', insurance: 'Commercial', date: '2026-03-05', status: 'pending' },
];

const recentBookings = [
  { id: 'BK-4521', customer: 'Emily Clarke', from: 'London', to: 'Brighton', price: 145, status: 'completed', driver: 'Marcus J.' },
  { id: 'BK-4520', customer: 'Corp: TechFlow Ltd', from: 'Manchester', to: 'Leeds', price: 220, status: 'in-progress', driver: 'Sarah K.' },
  { id: 'BK-4519', customer: 'David Brown', from: 'Edinburgh', to: 'Glasgow', price: 110, status: 'completed', driver: 'Tom W.' },
  { id: 'BK-4518', customer: 'Student: Amy Li', from: 'Oxford', to: 'London', price: 95, status: 'disputed', driver: 'James O.' },
  { id: 'BK-4517', customer: 'Rachel Green', from: 'Bristol', to: 'Cardiff', price: 130, status: 'completed', driver: 'Mike C.' },
];

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [drivers, setDrivers] = useState(pendingDrivers);
  const [searchQuery, setSearchQuery] = useState('');

  const approveDriver = (id: string) => setDrivers(drivers.map(d => d.id === id ? { ...d, status: 'approved' } : d));
  const rejectDriver = (id: string) => setDrivers(drivers.map(d => d.id === id ? { ...d, status: 'rejected' } : d));

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'drivers', label: 'Driver Approvals', icon: Users },
    { id: 'bookings', label: 'Bookings', icon: Truck },
    { id: 'pricing', label: 'Pricing Rules', icon: DollarSign },
    { id: 'disputes', label: 'Disputes', icon: AlertTriangle },
  ];

  const stats = [
    { label: 'Total Revenue', value: '£458,000', change: '+12.5%', icon: DollarSign, color: 'bg-green-500' },
    { label: 'Active Drivers', value: '2,847', change: '+8.3%', icon: Truck, color: 'bg-blue-500' },
    { label: 'Total Bookings', value: '12,456', change: '+15.2%', icon: BarChart3, color: 'bg-purple-500' },
    { label: 'Avg Rating', value: '4.87', change: '+0.03', icon: Star, color: 'bg-[#D4AF37]' },
    { label: 'Active Now', value: '342', change: 'live', icon: Activity, color: 'bg-red-500' },
    { label: 'Pending Approvals', value: drivers.filter(d => d.status === 'pending').length.toString(), change: 'action', icon: Clock, color: 'bg-orange-500' },
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
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
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
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id ? 'bg-[#0A2463] text-white' : 'bg-white text-gray-600'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {stats.map((stat, idx) => (
                  <div key={idx} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className={`w-8 h-8 ${stat.color} rounded-lg flex items-center justify-center mb-3`}>
                      <stat.icon className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{stat.label}</p>
                    <span className={`text-xs font-medium ${stat.change.startsWith('+') ? 'text-green-500' : stat.change === 'live' ? 'text-red-500' : 'text-orange-500'}`}>{stat.change}</span>
                  </div>
                ))}
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-4">Revenue (Last 7 Months)</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" fontSize={12} />
                      <YAxis fontSize={12} tickFormatter={(v) => `£${v/1000}k`} />
                      <Tooltip formatter={(v: number) => [`£${v.toLocaleString()}`, 'Revenue']} />
                      <Bar dataKey="revenue" fill="#0A2463" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-4">Weekly Bookings</h3>
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

              {/* Vehicle Distribution & Recent Bookings */}
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
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-gray-500 border-b border-gray-100">
                          <th className="pb-2 font-medium">ID</th>
                          <th className="pb-2 font-medium">Customer</th>
                          <th className="pb-2 font-medium">Route</th>
                          <th className="pb-2 font-medium">Price</th>
                          <th className="pb-2 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentBookings.map((b) => (
                          <tr key={b.id} className="border-b border-gray-50 hover:bg-gray-50">
                            <td className="py-2.5 font-mono text-xs text-gray-400">{b.id}</td>
                            <td className="py-2.5 font-medium text-gray-800">{b.customer}</td>
                            <td className="py-2.5 text-gray-600">{b.from} → {b.to}</td>
                            <td className="py-2.5 font-semibold text-gray-800">£{b.price}</td>
                            <td className="py-2.5">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                b.status === 'completed' ? 'bg-green-100 text-green-700' :
                                b.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                                'bg-red-100 text-red-700'
                              }`}>{b.status}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
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
                  <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search drivers..." className="bg-transparent outline-none text-sm w-48" />
                </div>
              </div>
              <div className="space-y-3">
                {drivers.filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase())).map((driver) => (
                  <div key={driver.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#0A2463]/10 rounded-full flex items-center justify-center">
                        <Users className="w-6 h-6 text-[#0A2463]" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{driver.name}</p>
                        <p className="text-gray-500 text-sm">{driver.vehicle} • {driver.insurance} Insurance</p>
                        <p className="text-gray-400 text-xs">Applied: {driver.date}</p>
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
                          <button className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                            <Eye className="w-4 h-4" /> Review
                          </button>
                        </>
                      ) : (
                        <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                          driver.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {driver.status === 'approved' ? 'Approved' : 'Rejected'}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bookings */}
          {activeTab === 'bookings' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">All Bookings</h2>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr className="text-left text-gray-500">
                        <th className="px-4 py-3 font-medium">ID</th>
                        <th className="px-4 py-3 font-medium">Customer</th>
                        <th className="px-4 py-3 font-medium">Driver</th>
                        <th className="px-4 py-3 font-medium">Route</th>
                        <th className="px-4 py-3 font-medium">Price</th>
                        <th className="px-4 py-3 font-medium">Status</th>
                        <th className="px-4 py-3 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentBookings.map((b) => (
                        <tr key={b.id} className="border-t border-gray-100 hover:bg-gray-50">
                          <td className="px-4 py-3 font-mono text-xs">{b.id}</td>
                          <td className="px-4 py-3 font-medium">{b.customer}</td>
                          <td className="px-4 py-3">{b.driver}</td>
                          <td className="px-4 py-3">{b.from} → {b.to}</td>
                          <td className="px-4 py-3 font-semibold">£{b.price}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              b.status === 'completed' ? 'bg-green-100 text-green-700' :
                              b.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                              'bg-red-100 text-red-700'
                            }`}>{b.status}</span>
                          </td>
                          <td className="px-4 py-3">
                            <button className="text-[#0A2463] hover:underline text-sm font-medium">View</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Pricing Rules */}
          {activeTab === 'pricing' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Pricing Rules</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { label: 'Minimum Booking Fee', value: '£50', editable: true },
                  { label: 'Minimum Job Duration', value: '2 hours', editable: true },
                  { label: 'Minimum Job Cost', value: '£80', editable: true },
                  { label: 'Additional Time Charge', value: '£30 per 30 min', editable: true },
                  { label: 'Platform Commission', value: '20%', editable: true },
                  { label: 'Student Discount', value: '10%', editable: true },
                  { label: 'Max Surge Multiplier', value: '2.5x', editable: true },
                  { label: 'Stairs Surcharge', value: '£20', editable: true },
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
              <div className="space-y-3">
                {[
                  { id: 'DSP-001', booking: 'BK-4518', customer: 'Amy Li', driver: 'James O.', issue: 'Student ID not presented', amount: '£9.50 discount reversal', status: 'open' },
                  { id: 'DSP-002', booking: 'BK-4501', customer: 'Mark Davis', driver: 'Tom W.', issue: 'Damaged item during transport', amount: '£150 claim', status: 'investigating' },
                  { id: 'DSP-003', booking: 'BK-4489', customer: 'Lisa Wong', driver: 'Sarah K.', issue: 'Late arrival (45 min)', amount: '£30 refund request', status: 'resolved' },
                ].map((dispute) => (
                  <div key={dispute.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-xs text-gray-400">{dispute.id}</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            dispute.status === 'open' ? 'bg-red-100 text-red-700' :
                            dispute.status === 'investigating' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}>{dispute.status}</span>
                        </div>
                        <p className="font-semibold text-gray-900">{dispute.issue}</p>
                        <p className="text-gray-500 text-sm">Booking: {dispute.booking} | Customer: {dispute.customer} | Driver: {dispute.driver}</p>
                        <p className="text-[#D4AF37] font-semibold text-sm mt-1">{dispute.amount}</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="bg-[#0A2463] hover:bg-[#1B3A8C] text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors">Review</button>
                        {dispute.status !== 'resolved' && (
                          <button className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors">Resolve</button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
