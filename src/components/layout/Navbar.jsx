import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAppContext } from '../../context/AppContext';
import { Moon, Sun, Bell, User } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Navbar() {
  const { currentUser, logout } = useAuth();
  const { theme, toggleTheme } = useAppContext();

  return (
    <header className="h-16 px-6 bg-surface-light dark:bg-surface-dark border-b border-slate-200 dark:border-slate-800 flex items-center justify-between sticky top-0 z-10 transition-colors duration-200">
      <div className="flex items-center">
        {/* Mobile menu toggle could go here */}
        <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-indigo-600 dark:from-primary-400 dark:to-indigo-400 md:hidden">
          StudyFlow
        </h2>
      </div>

      <div className="flex items-center space-x-4">
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        
        <button className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300 relative">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <div className="relative group">
          <button className="flex items-center space-x-2 focus:outline-none">
            <img 
              src={currentUser?.photoURL || `https://ui-avatars.com/api/?name=${currentUser?.displayName}`} 
              alt="Profile" 
              className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700"
            />
          </button>
          
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 py-1 hidden group-hover:block transition-all z-20">
            <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700">
              <p className="text-sm font-semibold truncate leading-tight dark:text-white">{currentUser?.displayName}</p>
              <p className="text-xs text-slate-500 truncate mt-0.5">{currentUser?.email}</p>
            </div>
            <Link to="/profile" className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">Profile</Link>
            <button 
              onClick={logout}
              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
