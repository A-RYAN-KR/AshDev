import React, { useState, useMemo } from 'react';
import { BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Users, DollarSign, ShoppingBag, Utensils, TrendingUp, Calendar } from 'lucide-react';

// Extended dummy data for different time ranges
const allData = {
  daily: {
    revenue: [
      { date: '2024-03-07', revenue: 3600, orders: 55, customers: 150 },
    ],
    stats: {
      totalOrders: 55,
      totalRevenue: 3600,
      activeCustomers: 38,
      occupiedTables: 8,
    },
    hourlyTraffic: [
      { hour: '08:00', customers: 20 },
      { hour: '10:00', customers: 45 },
      { hour: '12:00', customers: 85 },
      { hour: '14:00', customers: 65 },
      { hour: '16:00', customers: 40 },
      { hour: '18:00', customers: 70 },
      { hour: '20:00', customers: 90 },
      { hour: '22:00', customers: 50 },
    ],
  },
  weekly: {
    revenue: [
      { date: '2024-03-01', revenue: 2500, orders: 45, customers: 120 },
      { date: '2024-03-02', revenue: 3200, orders: 52, customers: 145 },
      { date: '2024-03-03', revenue: 2800, orders: 48, customers: 135 },
      { date: '2024-03-04', revenue: 3800, orders: 60, customers: 160 },
      { date: '2024-03-05', revenue: 2900, orders: 50, customers: 140 },
      { date: '2024-03-06', revenue: 4200, orders: 65, customers: 180 },
      { date: '2024-03-07', revenue: 3600, orders: 55, customers: 150 },
    ],
    stats: {
      totalOrders: 375,
      totalRevenue: 23000,
      activeCustomers: 150,
      occupiedTables: 12,
    },
    hourlyTraffic: [
      { hour: '08:00', customers: 25 },
      { hour: '10:00', customers: 55 },
      { hour: '12:00', customers: 95 },
      { hour: '14:00', customers: 75 },
      { hour: '16:00', customers: 50 },
      { hour: '18:00', customers: 80 },
      { hour: '20:00', customers: 100 },
      { hour: '22:00', customers: 60 },
    ],
  },
  monthly: {
    revenue: [
      { date: '2024-02-01', revenue: 32000, orders: 520, customers: 1400 },
      { date: '2024-02-08', revenue: 35000, orders: 580, customers: 1600 },
      { date: '2024-02-15', revenue: 38000, orders: 610, customers: 1700 },
      { date: '2024-02-22', revenue: 36000, orders: 590, customers: 1650 },
      { date: '2024-02-29', revenue: 42000, orders: 650, customers: 1800 },
      { date: '2024-03-07', revenue: 45000, orders: 680, customers: 1900 },
    ],
    stats: {
      totalOrders: 3630,
      totalRevenue: 228000,
      activeCustomers: 450,
      occupiedTables: 24,
    },
    hourlyTraffic: [
      { hour: '08:00', customers: 35 },
      { hour: '10:00', customers: 65 },
      { hour: '12:00', customers: 110 },
      { hour: '14:00', customers: 85 },
      { hour: '16:00', customers: 60 },
      { hour: '18:00', customers: 95 },
      { hour: '20:00', customers: 115 },
      { hour: '22:00', customers: 70 },
    ],
  },
};

const categoryRevenue = [
  { name: 'Main Course', value: 45, revenue: 5600 },
  { name: 'Beverages', value: 20, revenue: 2400 },
  { name: 'Desserts', value: 15, revenue: 1800 },
  { name: 'Appetizers', value: 20, revenue: 2200 },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#6366f1'];

const StatCard = ({ title, value, icon: Icon, color }: { title: string; value: string | number; icon: any; color: string }) => (
  <div className="bg-white rounded-lg p-6 shadow-md">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <p className="text-2xl font-semibold mt-1">{value}</p>
      </div>
      <div className={`p-3 rounded-full ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </div>
);

export default function Dashboard() {
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('week');

  // Get the appropriate data based on the selected time range
  const currentData = useMemo(() => {
    switch (timeRange) {
      case 'day':
        return allData.daily;
      case 'week':
        return allData.weekly;
      case 'month':
        return allData.monthly;
      default:
        return allData.weekly;
    }
  }, [timeRange]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500">
          {timeRange === 'day' 
            ? "Today's performance" 
            : timeRange === 'week' 
              ? "This week's performance" 
              : "This month's performance"}
        </p>
      </div>

      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setTimeRange('day')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            timeRange === 'day' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Today
        </button>
        <button
          onClick={() => setTimeRange('week')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            timeRange === 'week' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          This Week
        </button>
        <button
          onClick={() => setTimeRange('month')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            timeRange === 'month' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          This Month
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Orders"
          value={currentData.stats.totalOrders.toLocaleString()}
          icon={ShoppingBag}
          color="bg-blue-500"
        />
        <StatCard
          title="Total Revenue"
          value={`$${currentData.stats.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          color="bg-green-500"
        />
        <StatCard
          title="Active Customers"
          value={currentData.stats.activeCustomers.toLocaleString()}
          icon={Users}
          color="bg-purple-500"
        />
        <StatCard
          title="Occupied Tables"
          value={currentData.stats.occupiedTables}
          icon={Utensils}
          color="bg-orange-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend Line Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Revenue Trend</h2>
            <TrendingUp className="w-5 h-5 text-blue-500" />
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={currentData.revenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  name="Revenue ($)"
                  stroke="#3b82f6" 
                  strokeWidth={2} 
                  dot={timeRange !== 'week'} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Orders vs Customers Area Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Orders vs Customers</h2>
            <Users className="w-5 h-5 text-purple-500" />
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={currentData.revenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="orders" 
                  stackId="1" 
                  stroke="#10b981" 
                  fill="#10b981" 
                  fillOpacity={0.3} 
                />
                <Area 
                  type="monotone" 
                  dataKey="customers" 
                  stackId="2" 
                  stroke="#6366f1" 
                  fill="#6366f1" 
                  fillOpacity={0.3} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Hourly Traffic Line Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Hourly Traffic</h2>
            <Calendar className="w-5 h-5 text-orange-500" />
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={currentData.hourlyTraffic}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="customers" 
                  name="Customers"
                  stroke="#f59e0b" 
                  strokeWidth={2} 
                  dot={true} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution Pie Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Revenue by Category</h2>
            <DollarSign className="w-5 h-5 text-green-500" />
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryRevenue}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryRevenue.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}