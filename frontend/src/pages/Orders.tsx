import React, { useEffect, useState } from 'react';
import { Calendar, Search } from 'lucide-react';

interface Order {
  id: string;
  table: string;
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
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filteredOrders, setFilteredOrders] = useState(orders);


  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost:7000/api/v1/orders');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        setOrders(data);
      } catch (error: any) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <div>Loading orders...</div>;
  }

  if (error) {
    return <div>Error loading orders: {error.message}</div>;
  }

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    // Filter orders based on search query (matching order ID or item names)
    const filtered = orders.filter((order) =>
      order.id.toLowerCase().includes(query) ||
      (Array.isArray(order.items) &&
        order.items.some((item) => item.name.toLowerCase().includes(query)))
    );
    setFilteredOrders(filtered);
  };

  const handleDateFilter = (e) => {
    const date = e.target.value;
    setFilterDate(date);

    // Filter orders based on the selected date
    const filtered = orders.filter((order) => {
      const orderDate = new Date(order.time).toISOString().split('T')[0]; // Extract date in YYYY-MM-DD format
      return orderDate === date;
    });
    setFilteredOrders(filtered);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-500">Manage and track all orders</p>
        </div>
        <div className="flex space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search orders..."
              value={searchQuery}
              onChange={handleSearch}
              className="pl-10 pr-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
          </div>
          <div className="relative">
            <input
              type="date"
              value={filterDate}
              onChange={handleDateFilter}
              className="pl-3 pr-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

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
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {/* Access the "number" field of the table object */}
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
                  {/* Format the date */}
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