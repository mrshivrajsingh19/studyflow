import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAppContext } from '../../context/AppContext';
import { Card, Button, Badge } from '../../components/ui';
import { Award, Zap, Book, LogOut, Moon, Sun, Monitor } from 'lucide-react';

export function Profile() {
  const { currentUser, logout } = useAuth();
  const { theme, toggleTheme, subjects, notes, sessions } = useAppContext();
  
  const [activeTab, setActiveTab] = useState('overview');

  const totalTime = sessions.reduce((acc, s) => acc + s.durationMinutes, 0);
  
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold dark:text-white">Profile & Settings</h1>
      
      <Card className="flex flex-col md:flex-row items-center gap-6 p-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 border-blue-100 dark:border-blue-900/30">
        <div className="relative">
          <img 
            src={currentUser?.photoURL || `https://ui-avatars.com/api/?name=${currentUser?.displayName}`} 
            alt="Avatar" 
            className="w-24 h-24 rounded-full border-4 border-white dark:border-slate-800 shadow-lg object-cover"
          />
          <div className="absolute -bottom-2 -right-2 bg-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-800 shadow-sm" title="Current Streak">
            <Zap size={16} className="fill-current" />
          </div>
        </div>
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{currentUser?.displayName}</h2>
          <p className="text-slate-500 dark:text-slate-400">{currentUser?.email}</p>
          <div className="flex flex-wrap gap-2 justify-center md:justify-start mt-4">
            {currentUser?.badges?.map(badge => (
              <Badge key={badge} color="blue" className="bg-blue-100 dark:bg-blue-900/50"><Award size={12} className="mr-1" /> {badge}</Badge>
            ))}
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={logout} className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200 dark:border-red-900/30">
            <LogOut size={16} /> Sign out
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <h3 className="text-lg font-bold mb-4 dark:text-white">Learning Stats</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700 text-center">
                <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">{subjects.length}</p>
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mt-1">Subjects</p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700 text-center">
                <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">{notes.length}</p>
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mt-1">Notes</p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700 text-center">
                <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">{sessions.length}</p>
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mt-1">Sessions</p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700 text-center">
                <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">{Math.round(totalTime / 60)}h</p>
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mt-1">Focused</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <h3 className="text-lg font-bold mb-4 dark:text-white">Settings</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <p className="font-medium dark:text-slate-200">Dark Mode</p>
                  <p className="text-xs text-slate-500">Toggle dark theme.</p>
                </div>
                <button 
                  onClick={toggleTheme}
                  className={`w-12 h-6 rounded-full transition-colors relative ${theme === 'dark' ? 'bg-primary-600' : 'bg-slate-300 dark:bg-slate-600'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${theme === 'dark' ? 'translate-x-7' : 'translate-x-1'}`}></div>
                </button>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <p className="font-medium dark:text-slate-200">Weekly Goal</p>
                  <p className="text-xs text-slate-500">Target study hours.</p>
                </div>
                <span className="font-semibold text-primary-600">{currentUser?.weeklyGoal || 10}h</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
