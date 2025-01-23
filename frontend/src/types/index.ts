export interface User {
  id: string;
  username: string;
  role: 'admin' | 'manager';
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  isAvailable: boolean;
}

export interface Table {
  id: string;
  number: number;
  capacity: number;
  status: 'occupied' | 'available' | 'reserved';
  lastOccupiedAt?: string;
}

export interface Order {
  id: string;
  tableId: string;
  items: Array<{
    menuItemId: string;
    quantity: number;
    price: number;
  }>;
  status: 'pending' | 'completed' | 'cancelled';
  total: number;
  createdAt: string;
}

export interface DailyRevenue {
  date: string;
  amount: number;
  orderCount: number;
}