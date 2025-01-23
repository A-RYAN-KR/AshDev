import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ClipboardList, 
  DollarSign, 
  Table, 
  Menu, 
  FileText, 
  LogOut 
} from 'lucide-react';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/orders', icon: ClipboardList, label: 'Orders' },
  { path: '/revenue', icon: DollarSign, label: 'Revenue' },
  { path: '/tables', icon: Table, label: 'Tables' },
  { path: '/menu', icon: Menu, label: 'Menu' },
  { path: '/reports', icon: FileText, label: 'Reports' },
];


export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-4">
          <h1 className="text-xl font-bold text-gray-800">Restaurant Admin</h1>
        </div>
        <nav className="mt-4">
          {navItems.map(({ path, icon: Icon, label }) => (
            <Link
              key={path}
              to={path}
              className={`flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 ${
                location.pathname === path ? 'bg-gray-50 border-r-4 border-blue-500' : ''
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              <span>{label}</span>
            </Link>
          ))}
          <button
            onClick={() => {
              navigate('/login');
            }}
            className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-gray-50"
          >
            <LogOut className="w-5 h-5 mr-3" />
            <span>Logout</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}