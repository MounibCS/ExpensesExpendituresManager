import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Wallet, PlusCircle, List, PieChart } from 'lucide-react';
import LoginButton from '../pages/Login';
import LogoutButton from '../pages/Logout';
import AuthButton from '../pages/UserProfile';

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-indigo-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2">
              <Wallet className="h-8 w-8" />
              <span className="text-xl font-bold">Masroofy</span>
            </Link>
            <div className="flex space-x-4">
              <Link to="/" className="hover:bg-indigo-700 px-3 py-2 rounded-md">
                Home
              </Link>
              <Link to="/add" className="hover:bg-indigo-700 px-3 py-2 rounded-md">
                Add Transaction
              </Link>
              <Link to="/transactions" className="hover:bg-indigo-700 px-3 py-2 rounded-md">
                Transactions
              </Link>
              <Link to="/reports" className="hover:bg-indigo-700 px-3 py-2 rounded-md">
                Reports
              </Link>
              {/* <LoginButton />
              <LogoutButton /> */}
              <AuthButton />
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}