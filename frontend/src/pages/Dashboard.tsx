import { useState, useMemo, useEffect } from 'react';
import { format } from 'date-fns';
import { LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Users, DollarSign, ShoppingBag, Utensils, TrendingUp, Calendar } from 'lucide-react';
import axios from 'axios';
import StatCard from '../components/StatCard';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#6366f1'];


export default function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [timeRange, setTimeRange] = useState('week');

  useEffect(() => {
    axios.get('http://localhost:7000/api/v1/orders')
      .then(response => setOrders(response.data))
      .catch(error => console.error("Error fetching orders:", error));
  }, []);

  const aggregatedData = useMemo(() => {
    const filteredOrders = orders.filter(order => {
      const orderDate = new Date(order.time);
      const now = new Date();
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
      ordersRevenueData: filteredOrders.map(order => ({ date: order.time, orders: 1, revenue: order.total }))
    };
  }, [orders, timeRange]);

  const getHourlyTrafficData = () => {
    const hourlyTraffic = new Array(24).fill(0);

    orders.forEach(order => {
      const orderDate = new Date(order.time);
      const hour = orderDate.getHours();
      hourlyTraffic[hour] += 1;
    });

    return hourlyTraffic.map((count, index) => ({
      hour: `${index}:00`,
      customers: count
    }));
  };

  const hourlyTrafficData = useMemo(() => getHourlyTrafficData(), [orders]);


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
          value={aggregatedData.totalOrders}
          icon={ShoppingBag}
          color="bg-blue-500"
        />
        <StatCard
          title="Total Revenue"
          value={`₹ ${aggregatedData.totalRevenue}`}
          icon={DollarSign}
          color="bg-green-500"
        />
        <StatCard
          title="Active Customers"
          value={aggregatedData.activeCustomers}
          icon={Users}
          color="bg-purple-500"
        />
        {/* <StatCard
          title="Occupied Tables"
          value={currentData.stats.occupiedTables}
          icon={Utensils}
          color="bg-orange-500"
        /> */}
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
              <LineChart data={orders.map(order => ({ date: order.time, revenue: order.total }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tickFormatter={(date) => format(new Date(date), 'yyyy-MM-dd')} />
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

        {/* Orders vs Revenue Area Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Orders vs Revenue</h2>
            <Users className="w-5 h-5 text-purple-500" />
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={aggregatedData.ordersRevenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tickFormatter={(date) => format(new Date(date), 'yyyy-MM-dd')} />
                <YAxis yAxisId="left" orientation="left" domain={[0, 10]} />
                <YAxis yAxisId="right" orientation="right" />
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
                  name="Revenue ($)"
                  stroke="#6366f1"
                  fill="#6366f1"
                  fillOpacity={0.3}
                  yAxisId="right"
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
              <LineChart data={hourlyTrafficData}>
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
        {/* <div className="bg-white p-6 rounded-lg shadow-md">
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
        </div> */}
      </div>
    </div>
  );
}