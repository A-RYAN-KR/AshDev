import React from 'react';
import { Circle } from 'lucide-react';

const dummyTables = [
  { id: 1, number: 1, capacity: 4, status: 'available', lastOccupied: null },
  { id: 2, number: 2, capacity: 2, status: 'occupied', lastOccupied: '14:30' },
  { id: 3, number: 3, capacity: 6, status: 'reserved', lastOccupied: null },
  { id: 4, number: 4, capacity: 4, status: 'occupied', lastOccupied: '15:45' },
  { id: 5, number: 5, capacity: 8, status: 'available', lastOccupied: null },
  { id: 6, number: 6, capacity: 2, status: 'occupied', lastOccupied: '16:00' },
  { id: 7, number: 7, capacity: 4, status: 'available', lastOccupied: null },
  { id: 8, number: 8, capacity: 6, status: 'reserved', lastOccupied: null },
];

const statusColors = {
  available: 'text-green-500',
  occupied: 'text-red-500',
  reserved: 'text-yellow-500',
};

const TableCard = ({ table }: { table: typeof dummyTables[0] }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <div className="flex justify-between items-start mb-4">
      <div>
        <h3 className="text-lg font-semibold">Table {table.number}</h3>
        <p className="text-gray-500">Capacity: {table.capacity} people</p>
      </div>
      <Circle className={`w-4 h-4 ${statusColors[table.status as keyof typeof statusColors]}`} fill="currentColor" />
    </div>
    <div className="space-y-2">
      <div className="flex justify-between">
        <span className="text-gray-500">Status:</span>
        <span className="font-medium capitalize">{table.status}</span>
      </div>
      {table.lastOccupied && (
        <div className="flex justify-between">
          <span className="text-gray-500">Last Occupied:</span>
          <span className="font-medium">{table.lastOccupied}</span>
        </div>
      )}
    </div>
    <div className="mt-4 flex space-x-2">
      <button className="flex-1 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors">
        View Details
      </button>
      {table.status === 'available' && (
        <button className="flex-1 bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition-colors">
          Reserve
        </button>
      )}
    </div>
  </div>
);

export default function Tables() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Table Management</h1>
        <p className="text-gray-500">Monitor and manage restaurant tables</p>
      </div>

      <div className="flex space-x-4 mb-6">
        <div className="flex items-center">
          <Circle className="w-4 h-4 text-green-500 mr-2" fill="currentColor" />
          <span>Available</span>
        </div>
        <div className="flex items-center">
          <Circle className="w-4 h-4 text-red-500 mr-2" fill="currentColor" />
          <span>Occupied</span>
        </div>
        <div className="flex items-center">
          <Circle className="w-4 h-4 text-yellow-500 mr-2" fill="currentColor" />
          <span>Reserved</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {dummyTables.map((table) => (
          <TableCard key={table.id} table={table} />
        ))}
      </div>
    </div>
  );
}