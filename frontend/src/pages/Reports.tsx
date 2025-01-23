import React, { useState } from 'react';
import { Calendar, Download, Filter, FileSpreadsheet, FileText } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

const dummyReportData = {
  dailySales: [
    { date: '2024-03-01', sales: 2500, orders: 45 },
    { date: '2024-03-02', sales: 3200, orders: 52 },
    { date: '2024-03-03', sales: 2800, orders: 48 },
    { date: '2024-03-04', sales: 3800, orders: 60 },
    { date: '2024-03-05', sales: 2900, orders: 50 },
    { date: '2024-03-06', sales: 4200, orders: 65 },
    { date: '2024-03-07', sales: 3600, orders: 55 },
  ],
  monthlySales: [
    { date: '2024-02-01', sales: 32000, orders: 520 },
    { date: '2024-02-08', sales: 35000, orders: 580 },
    { date: '2024-02-15', sales: 38000, orders: 610 },
    { date: '2024-02-22', sales: 36000, orders: 590 },
    { date: '2024-02-29', sales: 42000, orders: 650 },
  ],
};

export default function Reports() {
  const [dateRange, setDateRange] = useState('week');
  const [showFormatDropdown, setShowFormatDropdown] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    category: 'all',
    orderType: 'all',
    minAmount: '',
    maxAmount: '',
  });

  const displayData = dateRange === 'month' ? dummyReportData.monthlySales : dummyReportData.dailySales;

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
    doc.text(`Total Sales: $23,000`, 20, 52);
    doc.text(`Total Orders: 375`, 20, 62);
    doc.text(`Average Order Value: $61.33`, 20, 72);
    
    // Add sales data table
    autoTable(doc, {
      head: [['Date', 'Sales ($)', 'Orders']],
      body: displayData.map(row => [
        row.date,
        row.sales.toFixed(2),
        row.orders
      ]),
      startY: 82,
    });
    
    doc.save('sales-report.pdf');
  };

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(displayData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sales Data');
    
    // Add summary data
    const summaryData = [
      ['Summary Statistics'],
      ['Total Sales', '$23,000'],
      ['Total Orders', '375'],
      ['Average Order Value', '$61.33'],
    ];
    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');
    
    XLSX.writeFile(workbook, 'sales-report.xlsx');
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setSelectedFilters(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const applyDateRange = () => {
    if (startDate && endDate) {
      setDateRange('custom');
      setShowDatePicker(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-500">Generate and download custom reports</p>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowFormatDropdown(!showFormatDropdown)}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            <Download className="w-5 h-5 mr-2" />
            Download Report
          </button>
          {showFormatDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10">
              <button
                onClick={() => {
                  downloadPDF();
                  setShowFormatDropdown(false);
                }}
                className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-t-lg"
              >
                <FileText className="w-5 h-5 mr-2" />
                Download as PDF
              </button>
              <button
                onClick={() => {
                  downloadExcel();
                  setShowFormatDropdown(false);
                }}
                className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-b-lg"
              >
                <FileSpreadsheet className="w-5 h-5 mr-2" />
                Download as Excel
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-4">
            <button
              className={`px-4 py-2 rounded-lg ${
                dateRange === 'week' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
              }`}
              onClick={() => setDateRange('week')}
            >
              This Week
            </button>
            <button
              className={`px-4 py-2 rounded-lg ${
                dateRange === 'month' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
              }`}
              onClick={() => setDateRange('month')}
            >
              This Month
            </button>
            <button
              className={`px-4 py-2 rounded-lg ${
                dateRange === 'custom' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
              }`}
              onClick={() => setShowDatePicker(true)}
            >
              Custom Range
            </button>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => setShowDatePicker(!showDatePicker)}
              className="flex items-center px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50"
            >
              <Calendar className="w-5 h-5 mr-2" />
              Select Dates
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50"
            >
              <Filter className="w-5 h-5 mr-2" />
              Filters
            </button>
          </div>
        </div>

        {showDatePicker && (
          <div className="mb-6 p-4 border rounded-lg bg-gray-50">
            <div className="flex space-x-4 items-end">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={applyDateRange}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Apply
              </button>
            </div>
          </div>
        )}

        {showFilters && (
          <div className="mb-6 p-4 border rounded-lg bg-gray-50">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  name="category"
                  value={selectedFilters.category}
                  onChange={handleFilterChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="all">All Categories</option>
                  <option value="food">Food</option>
                  <option value="beverages">Beverages</option>
                  <option value="desserts">Desserts</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Order Type</label>
                <select
                  name="orderType"
                  value={selectedFilters.orderType}
                  onChange={handleFilterChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="all">All Orders</option>
                  <option value="dine-in">Dine-in</option>
                  <option value="takeaway">Takeaway</option>
                  <option value="delivery">Delivery</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Min Amount</label>
                <input
                  type="number"
                  name="minAmount"
                  value={selectedFilters.minAmount}
                  onChange={handleFilterChange}
                  placeholder="0"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Amount</label>
                <input
                  type="number"
                  name="maxAmount"
                  value={selectedFilters.maxAmount}
                  onChange={handleFilterChange}
                  placeholder="1000"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        <div className="h-80 mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={displayData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" orientation="left" stroke="#3b82f6" />
              <YAxis yAxisId="right" orientation="right" stroke="#10b981" />
              <Tooltip />
              <Bar yAxisId="left" dataKey="sales" fill="#3b82f6" name="Sales ($)" />
              <Bar yAxisId="right" dataKey="orders" fill="#10b981" name="Orders" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Total Sales</h3>
            <p className="text-2xl font-bold text-blue-500">$23,000</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Total Orders</h3>
            <p className="text-2xl font-bold text-green-500">375</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Average Order Value</h3>
            <p className="text-2xl font-bold text-purple-500">$61.33</p>
          </div>
        </div>
      </div>
    </div>
  );
}