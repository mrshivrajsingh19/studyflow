import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAppContext } from '../../context/AppContext';
import { Card, Button, Badge } from '../../components/ui';
import { Flame, BookOpen, Clock, ChevronRight, Play } from 'lucide-react';
import { isToday } from '../../utils/dateHelpers';

export function Dashboard() {
  const { currentUser } = useAuth();
  const { subjects, notes, sessions } = useAppContext();
  const navigate = useNavigate();

  const dueNotes = useMemo(() => {
    return notes.filter(n => new Date(n.nextReviewDate) <= new Date());
  }, [notes]);

  const recentSessions = useMemo(() => {
    return [...sessions].sort((a, b) => new Date(b.startedAt) - new Date(a.startedAt)).slice(0, 3);
  }, [sessions]);

  const totalStudyTime = useMemo(() => {
    return sessions.reduce((acc, s) => acc + s.durationMinutes, 0);
  }, [sessions]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300">
            Welcome back, {currentUser?.displayName?.split(' ')[0]}! 👋
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            You have <span className="font-semibold text-primary-600 dark:text-primary-400">{dueNotes.length} notes</span> to review today.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-orange-50 dark:bg-orange-900/20 px-4 py-2 rounded-xl border border-orange-100 dark:border-orange-800/30">
          <div className="bg-orange-100 dark:bg-orange-900/50 p-2 rounded-lg text-orange-500">
            <Flame size={24} className="animate-pulse" />
          </div>
          <div>
            <p className="text-sm font-semibold text-orange-800 dark:text-orange-400 leading-tight">
              {currentUser?.streak || 0} Day Streak
            </p>
            <p className="text-xs text-orange-600 dark:text-orange-500">Keep it up!</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Quick Actions / Stats */}
        <div className="space-y-6 md:col-span-2">
          <div className="grid grid-cols-2 gap-4">
            <Card className="hover:shadow-md transition-shadow cursor-pointer group" onClick={() => navigate('/notes')}>
              <div className="flex flex-col gap-2">
                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <BookOpen size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg dark:text-white">{notes.length}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Total Notes</p>
                </div>
              </div>
            </Card>
            <Card className="hover:shadow-md transition-shadow cursor-pointer group" onClick={() => navigate('/subjects')}>
              <div className="flex flex-col gap-2">
                <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Clock size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg dark:text-white">{Math.round(totalStudyTime / 60)}h {totalStudyTime % 60}m</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Time Studied</p>
                </div>
              </div>
            </Card>
          </div>

          <Card className="flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold dark:text-white">Review Queue</h2>
              <Button variant="ghost" className="text-sm py-1 px-2" onClick={() => navigate('/notes')}>
                View All <ChevronRight size={16} />
              </Button>
            </div>
            
            {dueNotes.length === 0 ? (
              <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                <div className="inline-flex justify-center items-center w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 mb-3">
                  <BookOpen size={24} />
                </div>
                <p>You're all caught up for today!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {dueNotes.slice(0, 3).map(note => {
                  const subject = subjects.find(s => s.id === note.subjectId);
                  return (
                    <div key={note.id} className="flex justify-between items-center p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                      <div>
                        <h4 className="font-medium text-sm text-slate-800 dark:text-slate-200">{note.title}</h4>
                        {subject && (
                          <div className="flex items-center gap-2 mt-1">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: subject.color }}></span>
                            <span className="text-xs text-slate-500 dark:text-slate-400">{subject.name}</span>
                          </div>
                        )}
                      </div>
                      <Badge color="red">Due</Badge>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>

        {/* Right Sidebar on Dashboard */}
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-primary-600 to-indigo-700 text-white border-none shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Play size={100} />
            </div>
            <h2 className="text-lg font-bold mb-2">Ready to focus?</h2>
            <p className="text-sm text-primary-100 mb-6 w-4/5 line-clamp-2">
              Start a Pomodoro session and boost your productivity.
            </p>
            <Button 
              className="w-full bg-white text-primary-700 hover:bg-primary-50 font-bold"
              onClick={() => navigate('/study-room')}
            >
              <Play size={16} /> Start Study Room
            </Button>
          </Card>

          <Card>
            <h2 className="text-lg font-bold mb-4 dark:text-white">Recent Sessions</h2>
            <div className="space-y-4">
              {recentSessions.map(session => (
                <div key={session.id} className="flex gap-3">
                  <div className="mt-1">
                    <div className="w-2 h-2 rounded-full bg-primary-500"></div>
                  </div>
                  <div>
                    <p className="text-sm font-medium dark:text-slate-200">{session.goalText}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {session.durationMinutes} mins • {new Date(session.startedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
              {recentSessions.length === 0 && (
                <p className="text-sm text-slate-500 dark:text-slate-400 italic">No recent sessions.</p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
