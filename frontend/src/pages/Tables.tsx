import React, { useState } from 'react';
import { Circle, PlusCircle, Edit2, Trash2, X } from 'lucide-react';

const initialTables = [
  { id: 1, number: 1, capacity: 4, status: 'available', lastOccupied: null },
  { id: 2, number: 2, capacity: 2, status: 'occupied', lastOccupied: null },
  { id: 3, number: 3, capacity: 6, status: 'reserved', lastOccupied: null },
  { id: 4, number: 4, capacity: 4, status: 'occupied', lastOccupied: null },
];

const statusColors = {
  available: 'text-green-500',
  occupied: 'text-red-500',
  reserved: 'text-yellow-500',
};

interface Table {
  id: number;
  number: number;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved';
  lastOccupied: string | null;
}

const TableCard = ({
  table,
  onEdit,
  onDelete,
  onReserveToggle,
}: {
  table: Table;
  onEdit: (table: Table) => void;
  onDelete: (id: number) => void;
  onReserveToggle: (id: number) => void;
}) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    {/* Table Number, Status Icon, Edit, and Delete */}
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center space-x-3">
        <Circle
          className={`w-5 h-5 ${statusColors[table.status]}`}
          fill="currentColor"
        />
        <h3 className="text-lg font-semibold">Table {table.number}</h3>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={() => onEdit(table)}
          className="p-1 text-blue-500 hover:bg-blue-50 rounded"
        >
          <Edit2 className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(table.id)}
          className="p-1 text-red-500 hover:bg-red-50 rounded"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>

    {/* Table Details */}
    <div className="space-y-2">
      <div className="flex justify-between">
        <span className="text-gray-500">Capacity:</span>
        <span className="font-medium">{table.capacity} people</span>
      </div>
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

    {/* Reserve and Toggle Button */}
    <div className="mt-4 flex space-x-2">
      {table.status === 'available' ? (
        <button
          onClick={() => onReserveToggle(table.id)}
          className="flex-1 bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition-colors"
        >
          Reserve
        </button>
      ) : (
        <button
          onClick={() => onReserveToggle(table.id)}
          className="flex-1 bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition-colors"
        >
          Free Table
        </button>
      )}
    </div>
  </div>
);

export default function Tables() {
  const [tables, setTables] = useState<Table[]>(initialTables);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Table | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev!,
      [name]: name === 'capacity' || name === 'number' ? +value : value,
    }));
  };

  const handleAddTable = () => {
    setFormData({ id: tables.length + 1, number: 0, capacity: 0, status: 'available', lastOccupied: null });
    setShowForm(true);
  };

  const handleEdit = (table: Table) => {
    setFormData(table);
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData) {
      if (formData.id <= tables.length) {
        // Update existing table
        setTables((prev) =>
          prev.map((table) => (table.id === formData.id ? formData : table))
        );
      } else {
        // Add new table
        setTables((prev) => [...prev, formData]);
      }
    }
    setShowForm(false);
    setFormData(null);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setFormData(null);
  };

  const handleDelete = (id: number) => {
    setTables((prev) => prev.filter((table) => table.id !== id));
  };

  const handleReserveToggle = (id: number) => {
    setTables((prev) =>
      prev.map((table) =>
        table.id === id
          ? {
              ...table,
              status: table.status === 'available' ? 'reserved' : 'available',
            }
          : table
      )
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Table Management</h1>
          <p className="text-gray-500">Monitor and manage restaurant tables</p>
        </div>
        <button
          onClick={handleAddTable}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          Add Table
        </button>
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
        {tables.map((table) => (
          <TableCard
            key={table.id}
            table={table}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onReserveToggle={handleReserveToggle}
          />
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {formData?.id && formData.id <= tables.length
                  ? 'Edit Table'
                  : 'Add New Table'}
              </h2>
              <button
                onClick={handleCloseForm}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Table Number
                </label>
                <input
                  type="number"
                  name="number"
                  value={formData?.number || ''}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Capacity
                </label>
                <input
                  type="number"
                  name="capacity"
                  value={formData?.capacity || ''}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
