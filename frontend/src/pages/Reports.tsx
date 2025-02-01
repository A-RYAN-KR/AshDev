import React, { useState, useEffect } from 'react';
import { Download, FileSpreadsheet, FileText } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, parseISO, eachDayOfInterval, eachMonthOfInterval } from 'date-fns';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

const Reports = () => {
  const [dateRange, setDateRange] = useState('week');
  const [showFormatDropdown, setShowFormatDropdown] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    averageOrderValue: 0
  });

  useEffect(() => {
    const today = new Date();
    
    if (dateRange === 'week') {
      setStartDate(format(startOfWeek(today), 'yyyy-MM-dd'));
      setEndDate(format(endOfWeek(today), 'yyyy-MM-dd'));
    } else if (dateRange === 'month') {
      setStartDate(format(startOfMonth(today), 'yyyy-MM-dd'));
      setEndDate(format(endOfMonth(today), 'yyyy-MM-dd'));
    }
  }, [dateRange]);

  const generateDateRange = (start, end) => {
    if (dateRange === 'month') {
      const months = eachMonthOfInterval({
        start: parseISO(start),
        end: parseISO(end)
      });
      
      return months.map(date => ({
        date: format(date, 'yyyy-MM'),
        displayDate: format(date, 'MMMM yyyy'),
        sales: 0,
        orders: 0
      }));
    } else {
      const days = eachDayOfInterval({
        start: parseISO(start),
        end: parseISO(end)
      });
      
      return days.map(date => ({
        date: format(date, 'yyyy-MM-dd'),
        displayDate: format(date, 'MMM dd, yyyy'),
        sales: 0,
        orders: 0
      }));
    }
  };

  const processOrdersData = (orders) => {
    const dateRange = generateDateRange(startDate, endDate);
    
    const groupedOrders = orders.reduce((acc, order) => {
      const date = dateRange === 'month' 
        ? format(new Date(order.time), 'yyyy-MM')
        : format(new Date(order.time), 'yyyy-MM-dd');
      
      if (!acc[date]) {
        acc[date] = { date, sales: 0, orders: 0 };
      }
      acc[date].sales += order.total;
      acc[date].orders += 1;
      return acc;
    }, {});

    return dateRange.map(dateObj => ({
      ...dateObj,
      ...(groupedOrders[dateObj.date] || {})
    }));
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('http://localhost:7000/api/v1/orders');
      if (!response.ok) throw new Error('Failed to fetch orders');

      const ordersData = await response.json();
      
      const filteredOrders = ordersData.filter(order => {
        if (order.status !== 'completed') return false;
        
        const orderDate = parseISO(order.time);
        const start = parseISO(startDate);
        const end = parseISO(endDate);
        
        return orderDate >= start && orderDate <= end;
      });

      const processedOrders = processOrdersData(filteredOrders);
      setOrders(processedOrders);
      calculateStats(filteredOrders);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (orders) => {
    const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = orders.length;
    const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

    setStats({
      totalSales,
      totalOrders,
      averageOrderValue
    });
  };

  useEffect(() => {
    if (startDate && endDate) {
      fetchOrders();
    }
  }, [startDate, endDate]);

  const downloadPDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text('Sales Report', 14, 22);
    
    // Add date range
    doc.setFontSize(12);
    doc.text(`Date Range: ${dateRange.charAt(0).toUpperCase() + dateRange.slice(1)}ly Report`, 14, 32);
    
    // Add summary statistics
    doc.text('Summary Statistics:', 14, 42);
    doc.text(`Total Sales: $${stats.totalSales.toLocaleString()}`, 20, 52);
    doc.text(`Total Orders: ${stats.totalOrders}`, 20, 62);
    doc.text(`Average Order Value: $${stats.averageOrderValue.toFixed(2)}`, 20, 72);
    
    // Add sales data table
    autoTable(doc, {
      head: [['Date', 'Sales ($)', 'Orders']],
      body: orders.map(row => [
        row.displayDate,
        row.sales.toFixed(2),
        row.orders
      ]),
      startY: 82,
    });
    
    doc.save('sales-report.pdf');
  };

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(orders.map(row => ({
      Date: row.displayDate,
      Sales: row.sales,
      Orders: row.orders
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sales Data');
    
    // Add summary data
    const summaryData = [
      ['Summary Statistics'],
      ['Total Sales', `$${stats.totalSales.toLocaleString()}`],
      ['Total Orders', stats.totalOrders.toString()],
      ['Average Order Value', `$${stats.averageOrderValue.toFixed(2)}`],
    ];
    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');
    
    XLSX.writeFile(workbook, 'sales-report.xlsx');
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sales Dashboard</h1>
          <p className="text-gray-500">
            {dateRange === 'month' ? 'Monthly' : dateRange === 'week' ? 'Weekly' : 'Custom'} Sales Analysis
          </p>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowFormatDropdown(!showFormatDropdown)}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Download className="w-5 h-5 mr-2" />
            Export Report
          </button>
          {showFormatDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 border border-gray-200">
              <button 
                onClick={() => {
                  downloadPDF();
                  setShowFormatDropdown(false);
                }} 
                className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-t-lg transition-colors"
              >
                <FileText className="w-5 h-5 mr-2" />
                Download PDF
              </button>
              <button 
                onClick={() => {
                  downloadExcel();
                  setShowFormatDropdown(false);
                }} 
                className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-b-lg border-t border-gray-100 transition-colors"
              >
                <FileSpreadsheet className="w-5 h-5 mr-2" />
                Download Excel
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex mb-6 bg-gray-50 p-4 rounded-lg">
          <div className="flex space-x-4">
            <button
              className={`px-6 py-2 rounded-lg transition-colors ${
                dateRange === 'week' ? 'bg-blue-500 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
              onClick={() => setDateRange('week')}
            >
              Week
            </button>
            <button
              className={`px-6 py-2 rounded-lg transition-colors ${
                dateRange === 'month' ? 'bg-blue-500 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
              onClick={() => setDateRange('month')}
            >
              Month
            </button>
            <div className={`flex items-center space-x-4 ${dateRange === 'custom' ? 'bg-blue-50 px-4 rounded-lg' : ''}`}>
              <button
                className={`px-6 py-2 rounded-lg transition-colors ${
                  dateRange === 'custom' ? 'bg-blue-500 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => setDateRange('custom')}
              >
                Custom
              </button>
              {dateRange === 'custom' && (
                <div className="flex space-x-4">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white"
                  />
                  <span className="text-gray-500">to</span>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="h-80 mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={orders} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="displayDate"
                angle={-45}
                textAnchor="end"
                height={70}
                interval={0}
                tick={{ fontSize: 12 }}
              />
              <YAxis yAxisId="left" orientation="left" stroke="#3b82f6" />
              <YAxis yAxisId="right" orientation="right" stroke="#10b981" />
              <Tooltip 
                contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
              />
              <Bar yAxisId="left" dataKey="sales" fill="#3b82f6" name="Sales ($)" radius={[4, 4, 0, 0]} />
              <Bar yAxisId="right" dataKey="orders" fill="#10b981" name="Orders" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
            <h3 className="text-lg font-semibold mb-2 text-blue-900">Total Sales</h3>
            <p className="text-3xl font-bold text-blue-600">
              ${stats.totalSales.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
            <h3 className="text-lg font-semibold mb-2 text-green-900">Total Orders</h3>
            <p className="text-3xl font-bold text-green-600">
              {stats.totalOrders.toLocaleString()}
            </p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl">
            <h3 className="text-lg font-semibold mb-2 text-purple-900">Average Order Value</h3>
            <p className="text-3xl font-bold text-purple-600">
              ${stats.averageOrderValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;