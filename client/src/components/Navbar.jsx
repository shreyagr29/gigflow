import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../slices/authSlice';
import { Briefcase, User, LogOut, PlusCircle, Menu, X } from 'lucide-react';
import NotificationDropdown from './NotificationDropdown';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-slate-200 dark:border-gray-700 sticky top-0 z-50 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <Briefcase className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
              <span className="font-bold text-xl text-indigo-600 dark:text-indigo-400">GigFlow</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link to="/" className="border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700 dark:hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Find Work
              </Link>
            </div>
          </div>
          
          {/* Desktop Right Side */}
          <div className="hidden sm:flex items-center gap-4">
             <ThemeToggle />
            {userInfo ? (
              <>
                <Link to="/post-gig" className="inline-flex items-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
                  <PlusCircle className="h-4 w-4" />
                  Post a Gig
                </Link>
                <Link to="/dashboard" className="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white">
                  Dashboard
                </Link>
                <NotificationDropdown />
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                  <User className="h-5 w-5" />
                  {userInfo.name}
                </div>
                <button onClick={handleLogout} className="text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400">
                  <LogOut className="h-5 w-5" />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  Sign in
                </Link>
                <Link to="/register" className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-md text-sm font-medium">
                  Sign up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center sm:hidden gap-4">
            <ThemeToggle />
            {userInfo && <NotificationDropdown />}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isMenuOpen && (
        <div className="sm:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className="bg-indigo-50 dark:bg-indigo-900 border-indigo-500 text-indigo-700 dark:text-indigo-200 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            >
              Find Work
            </Link>
            {userInfo && (
                <>
                    <Link
                    to="/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className="border-transparent text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 hover:text-gray-700 dark:hover:text-white block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                    >
                    Dashboard
                    </Link>
                    <Link
                    to="/post-gig"
                    onClick={() => setIsMenuOpen(false)}
                    className="border-transparent text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 hover:text-gray-700 dark:hover:text-white block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                    >
                    Post a Gig
                    </Link>
                </>
            )}
          </div>
          <div className="pt-4 pb-4 border-t border-gray-200 dark:border-gray-700">
            {userInfo ? (
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                    <User className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800 dark:text-white">{userInfo.name}</div>
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{userInfo.email}</div>
                </div>
                <button
                  onClick={handleLogout}
                  className="ml-auto flex-shrink-0 bg-white dark:bg-gray-800 p-1 rounded-full text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <LogOut className="h-6 w-6" />
                </button>
              </div>
            ) : (
              <div className="mt-3 space-y-1 px-4">
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-center w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-indigo-600 bg-white hover:bg-gray-50"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-center w-full mt-2 px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
