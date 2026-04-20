import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { Card, Button, Input, Badge } from '../../components/ui';
import { Play, Square, Settings, Maximize2, History } from 'lucide-react';

export function StudyRoom() {
  const { subjects, sessions, addSession } = useAppContext();
  const { currentUser } = useAuth();
  
  const [isActive, setIsActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(25 * 60); // 25 mins by default
  const [selectedSubject, setSelectedSubject] = useState('');
  const [goalText, setGoalText] = useState('');
  
  const [timerDuration, setTimerDuration] = useState(25); // initial requested duration
  const [sessionStartTime, setSessionStartTime] = useState(null);

  const timerRef = useRef(null);

  useEffect(() => {
    if (isActive && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0 && isActive) {
      handleComplete();
    }
    return () => clearInterval(timerRef.current);
  }, [isActive, timeRemaining]);

  const toggleTimer = () => {
    if (!isActive) {
      if (!selectedSubject) {
        alert("Please select a subject first.");
        return;
      }
      if (timeRemaining === timerDuration * 60) {
        setSessionStartTime(new Date().toISOString());
      }
    }
    setIsActive(!isActive);
  };

  const handleStop = () => {
    setIsActive(false);
    clearInterval(timerRef.current);
    const confirmStop = window.confirm("Are you sure you want to end this session early? It won't be saved.");
    if (confirmStop) {
      setTimeRemaining(timerDuration * 60);
      setSessionStartTime(null);
    } else {
      setIsActive(true);
    }
  };

  const handleComplete = () => {
    setIsActive(false);
    clearInterval(timerRef.current);
    // Beep sound
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(880, audioCtx.currentTime);
      oscillator.connect(audioCtx.destination);
      oscillator.start();
      setTimeout(() => oscillator.stop(), 500);
    } catch(e) {}

    // Save session
    if (sessionStartTime) {
      addSession({
        id: `session_${Date.now()}`,
        subjectId: selectedSubject,
        goalText: goalText || 'Focused Study Session',
        durationMinutes: timerDuration,
        startedAt: sessionStartTime,
        endedAt: new Date().toISOString()
      });
    }

    setTimeRemaining(timerDuration * 60);
    setSessionStartTime(null);
    alert("Session complete! Great job.");
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const fractionComplete = 1 - (timeRemaining / (timerDuration * 60));
  const circleOffset = 283 - (283 * fractionComplete);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold dark:text-white">Study Room</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Deep focus Pomodoro sessions.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-1 md:col-span-2 flex flex-col items-center justify-center p-12 min-h-[400px]">
          
          {!isActive && timeRemaining === timerDuration * 60 ? (
            <div className="w-full max-w-sm space-y-6 animate-in slide-in-from-bottom-4 fade-in duration-500">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Subject</label>
                <select 
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-slate-800/50 dark:border-slate-700 text-slate-900 dark:text-white transition-colors"
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                >
                  <option value="" disabled>Select subject...</option>
                  {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Goal (Optional)</label>
                <Input 
                  placeholder="e.g. Read Chapter 5"
                  value={goalText}
                  onChange={(e) => setGoalText(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-800/50 rounded-xl py-2.5"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Duration: {timerDuration} mins</label>
                <input 
                  type="range" 
                  min="5" max="120" step="5"
                  className="w-full accent-primary-600"
                  value={timerDuration}
                  onChange={(e) => {
                    setTimerDuration(parseInt(e.target.value));
                    setTimeRemaining(parseInt(e.target.value) * 60);
                  }}
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>5m</span>
                  <span>60m</span>
                  <span>120m</span>
                </div>
              </div>
              <div className="pt-4 flex justify-center">
                <Button size="lg" className="px-12 py-4 rounded-full text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all" onClick={toggleTimer}>
                  <Play className="fill-current mr-2" /> Start Session
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center animate-in zoom-in-95 duration-300">
              <div className="relative flex items-center justify-center w-64 h-64 mb-8">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="128" cy="128" r="120" fill="none" strokeWidth="8" className="stroke-slate-100 dark:stroke-slate-800" />
                  <circle 
                    cx="128" cy="128" r="120" fill="none" strokeWidth="8" 
                    className="stroke-primary-500 transition-all duration-1000 linear glow"
                    strokeDasharray="754"
                    strokeDashoffset={283 * Math.PI * 2 * (timeRemaining / (timerDuration * 60))}
                    strokeLinecap="round"
                    style={{ strokeDashoffset: 283 * Math.PI * 2 * (1 - fractionComplete) }}
                  />
                </svg>
                <div className="absolute text-5xl font-extrabold text-slate-800 dark:text-white font-mono tracking-tighter">
                  {formatTime(timeRemaining)}
                </div>
              </div>
              
              <div className="text-center mb-8">
                <Badge color="slate" className="mb-2">
                  {subjects.find(s => s.id === selectedSubject)?.name || 'Focus Mode'}
                </Badge>
                {goalText && <p className="text-slate-600 dark:text-slate-300 font-medium">{goalText}</p>}
              </div>

              <div className="flex gap-4">
                <Button variant={isActive ? "secondary" : "primary"} className="w-16 h-16 rounded-full flex justify-center items-center shadow-lg" onClick={toggleTimer}>
                  {isActive ? <div className="w-4 h-4 bg-slate-700 dark:bg-slate-300 rounded-sm"></div> : <Play className="fill-current" size={24} />}
                </Button>
                <Button variant="danger" className="w-16 h-16 rounded-full flex justify-center items-center shadow-lg" onClick={handleStop}>
                  <Square className="fill-current" size={20} />
                </Button>
              </div>
            </div>
          )}
        </Card>

        <Card className="flex flex-col">
          <div className="flex items-center gap-2 mb-4 text-slate-800 dark:text-white font-bold pb-4 border-b border-slate-100 dark:border-slate-800">
            <History size={18} /> Today's Log
          </div>
          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            {sessions.filter(s => new Date(s.startedAt).toDateString() === new Date().toDateString()).map(session => (
              <div key={session.id} className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-semibold text-sm dark:text-white">{subjects.find(s => s.id === session.subjectId)?.name}</span>
                  <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 px-2 rounded-full font-medium">+{session.durationMinutes}m</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">{session.goalText}</p>
              </div>
            ))}
            {sessions.filter(s => new Date(s.startedAt).toDateString() === new Date().toDateString()).length === 0 && (
              <div className="text-center py-8 text-slate-400 text-sm">
                No sessions completed today.
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
