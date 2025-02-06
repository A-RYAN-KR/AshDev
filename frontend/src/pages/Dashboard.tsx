import { useState, useMemo, useEffect } from 'react';
import { format } from 'date-fns';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Users, ShoppingBag, TrendingUp, Calendar, IndianRupee } from 'lucide-react';
import axios from 'axios';
import StatCard from '../components/StatCard';
import { SparklesCore } from '../components/sparkles';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#6366f1'];

export default function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [timeRange, setTimeRange] = useState('week');

  useEffect(() => {
    axios
      .get('http://localhost:7000/api/v1/orders')
      .then(response => {
        console.log("response.data :", response.data);
        setOrders(response.data);
      })
      .catch(error => console.error("Error fetching orders:", error));
    console.log("orders :", orders);
  }, []);

  const aggregatedData = useMemo(() => {
    const filteredOrders = orders.filter(order => {
      const orderDate = new Date(order.time);
      const now = new Date();
      if (order.status !== 'completed') return false;
      if (timeRange === 'day') return orderDate.toDateString() === now.toDateString();
      if (timeRange === 'week') return (now - orderDate) / (1000 * 60 * 60 * 24) <= 7;
      return (now - orderDate) / (1000 * 60 * 60 * 24) <= 30;
    });

    const revenue = filteredOrders.reduce((acc, order) => acc + order.total, 0);
    const ordersCount = filteredOrders.length;
    const activeCustomers = new Set(filteredOrders.map(order => order.table)).size;

    return {
      totalOrders: ordersCount,
      totalRevenue: revenue,
      activeCustomers,
      ordersRevenueData: filteredOrders.map(order => ({
        date: order.time,
        orders: 1,
        revenue: order.total,
      })),
    };
  }, [orders, timeRange]);

  const categoryData = useMemo(() => {
    const categoryCounts = {};
    let totalItems = 0;

    orders.forEach(order => {
      order.items.forEach(item => {
        categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
        totalItems++;
      });
    });

    return Object.entries(categoryCounts).map(([category, count], index) => ({
      name: category,
      value: count,
      percentage: ((count / totalItems) * 100).toFixed(1),
      color: COLORS[index % COLORS.length],
    }));
  }, [orders]);

  const getHourlyTrafficData = () => {
    const hourlyTraffic = new Array(24).fill(0);

    orders.forEach(order => {
      const orderDate = new Date(order.time);
      const hour = orderDate.getHours();
      hourlyTraffic[hour] += 1;
    });

    return hourlyTraffic.map((count, index) => ({
      hour: `${index}:00`,
      customers: count,
    }));
  };

  const hourlyTrafficData = useMemo(() => getHourlyTrafficData(), [orders]);

  return (
    <div className="space-y-6 p-6 bg-gray-50">
      <div className="relative text-center py-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg mb-8">
  <h1 className="relative z-10 text-5xl font-bold text-white mb-3 font-serif">
    Terracotta
  </h1>
  <SparklesCore className="absolute inset-0 z-0" particleColor="#ffffff" particleDensity={100} maxSize={2}/>
</div>


      <div className="flex justify-center space-x-4 mb-8">
        <button
          onClick={() => setTimeRange('day')}
          className={`px-6 py-3 rounded-lg transition-all transform hover:scale-105 ${
            timeRange === 'day'
              ? 'bg-blue-500 text-white shadow-lg'
              : 'bg-white text-gray-600 hover:bg-gray-50 shadow'
          }`}
        >
          Today
        </button>
        <button
          onClick={() => setTimeRange('week')}
          className={`px-6 py-3 rounded-lg transition-all transform hover:scale-105 ${
            timeRange === 'week'
              ? 'bg-blue-500 text-white shadow-lg'
              : 'bg-white text-gray-600 hover:bg-gray-50 shadow'
          }`}
        >
          This Week
        </button>
        <button
          onClick={() => setTimeRange('month')}
          className={`px-6 py-3 rounded-lg transition-all transform hover:scale-105 ${
            timeRange === 'month'
              ? 'bg-blue-500 text-white shadow-lg'
              : 'bg-white text-gray-600 hover:bg-gray-50 shadow'
          }`}
        >
          This Month
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Orders"
          value={aggregatedData.totalOrders}
          icon={ShoppingBag}
          color="bg-blue-500"
        />
        <StatCard
          title="Total Revenue"
          value={`₹ ${aggregatedData.totalRevenue}`}
          icon={IndianRupee}
          color="bg-green-500"
        />
        <StatCard
          title="Active Customers"
          value={aggregatedData.activeCustomers}
          icon={Users}
          color="bg-purple-500"
        />
        <StatCard
          title="Average Order Value"
          value={`₹ ${aggregatedData.totalOrders ? Math.round(aggregatedData.totalRevenue / aggregatedData.totalOrders) : 0}`}
          icon={TrendingUp}
          color="bg-orange-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Trend Line Chart */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Revenue Trend</h2>
            <TrendingUp className="w-6 h-6 text-blue-500" />
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={aggregatedData.ordersRevenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(date) => format(new Date(date), 'MMM dd')}
                  stroke="#666"
                />
                <YAxis stroke="#666" />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue (₹)"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={timeRange !== 'week'}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Orders vs Revenue Area Chart */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Orders vs Revenue</h2>
            <Users className="w-6 h-6 text-purple-500" />
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={aggregatedData.ordersRevenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(date) => format(new Date(date), 'MMM dd')}
                  stroke="#666"
                />
                <YAxis yAxisId="left" orientation="left" stroke="#666" />
                <YAxis yAxisId="right" orientation="right" stroke="#666" />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="orders"
                  name="Orders"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.3}
                  yAxisId="left"
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue (₹)"
                  stroke="#6366f1"
                  fill="#6366f1"
                  fillOpacity={0.3}
                  yAxisId="right"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Hourly Traffic Line Chart - Expanded */}
        <div className="bg-white p-6 rounded-xl shadow-lg lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Hourly Traffic Distribution</h2>
            <Calendar className="w-6 h-6 text-orange-500" />
          </div>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={hourlyTrafficData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="hour"
                  stroke="#666"
                  tickFormatter={(hour) => hour.split(':')[0]}
                />
                <YAxis stroke="#666" />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="customers"
                  name="Orders"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={true}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

   {/* Category Distribution Pie Chart - Expanded */}
<div className="bg-white p-6 rounded-xl shadow-lg lg:col-span-2">
  <div className="flex items-center justify-between mb-6">
    <h2 className="text-xl font-semibold text-gray-800">Revenue Distribution by Category</h2>
    <IndianRupee className="w-6 h-6 text-green-500" />
  </div>
  <div className="h-96">
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={categoryData}
          cx="50%"
          cy="50%"
          labelLine={true}
          label={({ name, percentage }) => `${name}: ${percentage}%`}
          outerRadius={({chartWidth, chartHeight}) => Math.min(chartWidth, chartHeight) / 3}
          fill="#8884d8"
          dataKey="value"
        >
          {categoryData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip formatter={(value, name, props) => `${props.payload.percentage}%`} />
      </PieChart>
    </ResponsiveContainer>
  </div>
</div>
</div>
    </div>
  );
}