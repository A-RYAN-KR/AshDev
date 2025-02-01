import axios from 'axios';
import { useEffect, useState } from 'react';

interface Order {
  _id: string;
  table: string | { number: string };
  items: string[];
  total: number;
  status: string;
  time: string;
}

const StatusBadge = ({ status }: { status: string }) => {
  const colors = {
    completed: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm ${colors[status as keyof typeof colors]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'custom' | ''>('week');
  const [customRange, setCustomRange] = useState<{ start: string; end: string }>({ start: '', end: '' });
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:7000/api/v1/orders");
        setOrders(response.data); // Assuming response.data contains the orders
        console.log("Orders fetched:", response.data);
      } catch (error:any) {
        console.error("Error fetching orders:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);


  useEffect(() => {
    const filterOrders = () => {
      if (!orders.length) return []; // Ensure orders exist before filtering

      const now = new Date();

      if (dateRange === "week") {
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        return orders.filter(order => new Date(order.time) >= startOfWeek);
      }

      if (dateRange === "month") {
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        return orders.filter(order => new Date(order.time) >= startOfMonth);
      }

      if (dateRange === "custom" && customRange?.start && customRange?.end) {
        const startDate = new Date(customRange.start);
        const endDate = new Date(customRange.end);
        return orders.filter(order => {
          const orderDate = new Date(order.time);
          return orderDate >= startDate && orderDate <= endDate;
        });
      }

      return orders; // Default case (if no filtering applies)
    };

    setFilteredOrders(filterOrders());
  }, [dateRange, customRange, orders]);


  if (loading) {
    return <div>Loading orders...</div>;
  }

  if (error) {
    return <div>Error loading orders: {error.message}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-500">Manage and track all orders</p>
        </div>
        <div className="flex space-x-4">
          <button
            className={`px-4 py-2 rounded-lg ${dateRange === 'week' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
              }`}
            onClick={() => setDateRange('week')}
          >
            This Week
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${dateRange === 'month' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
              }`}
            onClick={() => setDateRange('month')}
          >
            This Month
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${dateRange === 'custom' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
              }`}
            onClick={() => setShowDatePicker(true)}
          >
            Custom Range
          </button>
        </div>
      </div>

      {showDatePicker && (
        <div className="flex space-x-4 mt-4">
          <input
            type="date"
            value={customRange.start}
            onChange={(e) => setCustomRange({ ...customRange, start: e.target.value })}
            className="px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
          <input
            type="date"
            value={customRange.end}
            onChange={(e) => setCustomRange({ ...customRange, end: e.target.value })}
            className="px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
            onClick={() => {
              setDateRange('custom');
              setShowDatePicker(false);
            }}
          >
            Apply
          </button>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Table</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredOrders.map((order) => (
              <tr key={order._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"># {order._id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.table && typeof order.table === "object" ? order.table.number : order.table}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {Array.isArray(order.items)
                    ? order.items.map((item) => item.name).join(', ')
                    : ''}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${order.total ? order.total.toFixed(2) : 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={order.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Intl.DateTimeFormat('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true,
                  }).format(new Date(order.time))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}