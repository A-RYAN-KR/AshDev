import React, { useState, useEffect } from 'react';
import { PlusCircle, Edit2, Trash2, X, Search } from 'lucide-react';
import axios from 'axios';

interface MenuItem {
  _id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  isAvailable: boolean;
}

export default function Menu() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [categories, setCategories] = useState([]);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [categoryFormData, setCategoryFormData] = useState({
    categoryName: '',
    restaurant: '',
  });


  const initialFormState = {
    name: '',
    price: 0,
    category: '',
    description: '',
    isAvailable: true,
  };

  const [formData, setFormData] = useState(initialFormState);

  // Fetch menu items from the API
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get('http://localhost:7000/api/v1/menu');
        const apiResponse = response.data;

        if (Array.isArray(apiResponse.data)) {
          console.log(apiResponse.data);
          setMenuItems(apiResponse.data); // Accessing the 'data' property
        } else {
          console.error('API response data is not an array:', apiResponse);
          setMenuItems([]); // Fallback to empty array on error
        }
      } catch (error) {
        console.error('Failed to fetch menu items:', error);
        setMenuItems([]); // Fallback to empty array on error
      }
    };

    fetchMenuItems();
  }, []);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      console.log(categoryFormData);

      const response = await axios.post('http://localhost:7000/api/v1/category', categoryFormData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Response:', response);

      if (response.status !== 200) {
        throw new Error(`Failed to add category: ${response.statusText}`);
      }

      const newCategory = response.data;

      // Update category list with the new category
      setCategories((prev) => [...prev, newCategory]);
      setCategoryFormData({ categoryName: '', restaurant: '' });
      setShowCategoryForm(false);
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const handleCategoryInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCategoryFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Fetch categories from the backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:7000/api/v1/category');
        console.log('Fetched categories:', response.data);
        setCategories(response.data); // Assuming the response data is an array of categories
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox'
        ? (e.target as HTMLInputElement).checked
        : name === 'price'
          ? parseFloat(value) || 0
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let response;
      if (editingItem) {
        // Update existing item
        response = await axios.put(`http://localhost:7000/api/v1/menu/${editingItem._id}`, formData, {
          headers: { 'Content-Type': 'application/json' },
        });

        const updatedItem = response.data; // Assuming the updated item is in `data`
        setMenuItems(prev =>
          prev.map(item => (item._id === updatedItem._id ? updatedItem : item))
        );
      } else {
        // Add a new item
        response = await axios.post('http://localhost:7000/api/v1/menu', formData, {
          headers: { 'Content-Type': 'application/json' },
        });

        const newItem = response.data; // Assuming the new item is in `data`
        setMenuItems(prev => [...prev, newItem]);
      }

      handleCloseForm();
    } catch (error) {
      console.error('Failed to submit menu item:', error);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingItem(null);
    setFormData(initialFormState);
  };

  const filteredItems = menuItems.filter(item => {
    const itemName = item?.name || ''; // Safely handle missing 'name' property
    return itemName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Add these functions within your component
  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      ...item,
      category: item.category // <-- Use _id here
    });  // Pre-fill the form with the item's data
    setShowForm(true);
  };

  const handleDelete = async (_id: string | undefined) => {
    console.log('Deleting item:', _id);

    if (!_id) {
      console.error('Cannot delete: Menu item ID is undefined.');
      return;
    }

    try {
      // Send DELETE request with axios
      await axios.delete(`http://localhost:7000/api/v1/menu/${_id}`);

      // Update state to remove the deleted item
      setMenuItems(prev => prev.filter(item => item._id !== _id));
    } catch (error) {
      console.error('Failed to delete menu item:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Menu Management</h1>
        </div>
        <div className="space-x-4 flex items-center">
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Add New Item
          </button>
          <button
            onClick={() => setShowCategoryForm(true)}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Add New Category
          </button>
        </div>
      </div>
      {/* Category form */}
      {showCategoryForm && (
        <form onSubmit={handleAddCategory} className="space-y-4 bg-white p-4 rounded-lg shadow-md">
          <div>
            <label className="block text-gray-700 font-medium">Category Name</label>
            <input
              type="text"
              name="categoryName"
              value={categoryFormData.categoryName}
              onChange={handleCategoryInputChange}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Enter category name"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Restaurant Name</label>
            <input
              type="text"
              name="restaurant"
              value={categoryFormData.restaurant}
              onChange={handleCategoryInputChange}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Enter restaurant name"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Submit
          </button>
          <button
            type="button"
            onClick={() => setShowCategoryForm(false)}
            className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 ml-4"
          >
            Cancel
          </button>
        </form>
      )}

      <div className="flex space-x-4 mb-6">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search menu items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category._id} value={category._id}>{category.categoryName}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map(item => (
          <div key={item._id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p className="text-gray-500">{item.category}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="p-1 text-blue-500 hover:bg-blue-50 rounded"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    if (item._id) {
                      handleDelete(item._id);
                    } else {
                      console.error('Menu item does not have a valid ID:', item);
                    }
                  }}
                  className="p-1 text-red-500 hover:bg-red-50 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

              </div>
            </div>
            <p className="text-gray-600 mb-4">{item.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">${Number(item.price).toFixed(2)}</span>
              <span className={`px-3 py-1 rounded-full text-sm ${item.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                {item.isAvailable ? 'Available' : 'Unavailable'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
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
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Price</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category._id} value={category._id}>{category.categoryName}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isAvailable"
                  checked={formData.isAvailable}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700">Available</label>
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  {editingItem ? 'Update Item' : 'Add Item'}
                </button>
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
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