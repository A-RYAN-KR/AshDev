import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Circle, PlusCircle, Edit2, Trash2, X, Loader } from "lucide-react";

const API_BASE_URL = "http://localhost:7000/api/v1";

const statusColors = {
  available: "text-green-500",
  occupied: "text-red-500",
  reserved: "text-yellow-500",
};

interface Table {
  id: string;
  number: number;
  capacity: number;
  status: "available" | "occupied" | "reserved";
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
  onDelete: (id: string) => void;
  onReserveToggle: (id: string) => void;
}) => (
  <div className="bg-white rounded-lg shadow-md p-6">
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
          <span className="font-medium">{new Date(table.lastOccupied).toLocaleString()}</span>
        </div>
      )}
    </div>
    <div className="mt-4 flex space-x-2">
      <button
        onClick={() => onReserveToggle(table.id)}
        className={`flex-1 py-2 rounded-md text-white ${
          table.status === "available"
            ? "bg-green-500 hover:bg-green-600"
            : "bg-red-500 hover:bg-red-600"
        }`}
      >
        {table.status === "available" ? "Reserve" : "Free Table"}
      </button>
    </div>
  </div>
);

export default function Tables() {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Table | null>(null);

  const fetchTables = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/getAllTables`);
      const fetchedTables = response.data.data.map((table: any) => ({
        ...table,
        id: table._id,
      }));
      setTables(fetchedTables);
    } catch (error) {
      console.error("Error fetching tables:", error);
      toast.error("Failed to fetch tables.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddTable = () => {
    setFormData({
      id: "",
      number: 0,
      capacity: 0,
      status: "available",
      lastOccupied: null,
    });
    setShowForm(true);
  };

  const handleEdit = (table: Table) => {
    setFormData(table);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${API_BASE_URL}/deleteTable/${id}`);
      setTables((prev) => prev.filter((table) => table.id !== id));
      toast.success("Table deleted successfully!");
    } catch (error) {
      console.error("Error deleting table:", error);
      toast.error("Failed to delete table.");
    }
  };

  const handleReserveToggle = async (id: string) => {
    try {
      const table = tables.find((t) => t.id === id);
      if (table) {
        const updatedStatus = table.status === "available" ? "reserved" : "available";
        const response = await axios.put(`${API_BASE_URL}/updateTable/${id}`, {
          status: updatedStatus,
        });
        
        setTables((prev) =>
          prev.map((t) => t.id === id 
            ? { ...response.data.data, id: response.data.data._id } 
            : t)
        );
        
        toast.success(`Table status updated to ${updatedStatus}.`);
      }
    } catch (error) {
      console.error("Error toggling reservation:", error);
      toast.error("Failed to update table status.");
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setFormData(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const existingTable = tables.find((table) => table.id === formData?.id);
      if (existingTable) {
        const response = await axios.put(
          `${API_BASE_URL}/updateTable/${formData?.id}`,
          formData
        );
        
        setTables((prev) =>
          prev.map((table) =>
            table.id === formData?.id 
              ? { ...response.data.data, id: response.data.data._id } 
              : table
          )
        );
        
        toast.success("Table updated successfully!");
      } else {
        const response = await axios.post(`${API_BASE_URL}/createTable`, formData);
        
        setTables((prev) => [...prev, { ...response.data.data, id: response.data.data._id }]);
        
        toast.success("Table created successfully!");
      }
    } catch (error: any) {
      if (error.response?.status === 409) {
        toast.error("Table number must be unique.");
      } else {
        console.error("Error saving table:", error);
        toast.error("Failed to save table.");
      }
    }
    handleCloseForm();
  };

  useEffect(() => {
    fetchTables();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Table Management</h1>
        <button
          onClick={handleAddTable}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          Add Table
        </button>
      </div>

  {/* Status Color Legend */}
  <div className="flex items-center space-x-4 mb-4">
        <div className="flex items-center space-x-2">
          <Circle className="w-5 h-5 text-green-500" fill="currentColor" />
          <span>Available</span>
        </div>
        <div className="flex items-center space-x-2">
          <Circle className="w-5 h-5 text-red-500" fill="currentColor" />
          <span>Occupied</span>
        </div>
        <div className="flex items-center space-x-2">
          <Circle className="w-5 h-5 text-yellow-500" fill="currentColor" />
          <span>Reserved</span>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center">
          <Loader className="animate-spin w-6 h-6 text-blue-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
      )}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {formData?.id ? "Edit Table" : "Add New Table"}
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
                  value={formData?.number || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev!,
                      number: +e.target.value,
                    }))
                  }
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
                  value={formData?.capacity || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev!,
                      capacity: +e.target.value,
                    }))
                  }
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