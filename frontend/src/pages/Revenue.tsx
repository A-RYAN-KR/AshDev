import { useState, useEffect } from "react";
import { fetchMonthlyRevenue } from "../lib/api.ts"; // Import API function
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, ShoppingBag, IndianRupee } from "lucide-react";

export default function Revenue() {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [averageOrderValue, setAverageOrderValue] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState<any>([]);

  useEffect(() => {
    fetchMonthlyRevenue()
      .then(({ totalRevenue, totalOrders, averageOrderValue, monthlyRevenue }) => {
        setTotalRevenue(totalRevenue);
        setTotalOrders(totalOrders);
        setAverageOrderValue(averageOrderValue);
        setMonthlyRevenue(monthlyRevenue);
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Revenue Analytics</h1>
        <p className="text-gray-500">Track your restaurant's financial performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Total Revenue</h3>
            <IndianRupee className="w-6 h-6 text-green-500" />
          </div>
          <p className="text-3xl font-bold">₹ {totalRevenue.toLocaleString("en-IN")}</p>
          <p className="text-green-500 text-sm mt-2">+12.5% from last month</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Average Order Value</h3>
            <TrendingUp className="w-6 h-6 text-blue-500" />
          </div>
          <p className="text-3xl font-bold">₹ {averageOrderValue}</p>
          <p className="text-blue-500 text-sm mt-2">+5.2% from last month</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Total Completed Orders</h3>
            <ShoppingBag className="w-6 h-6 text-purple-500" />
          </div>
          <p className="text-3xl font-bold">{totalOrders}</p>
          <p className="text-purple-500 text-sm mt-2">+8.3% from last month</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Monthly Revenue Trend</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fill="#93c5fd" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
