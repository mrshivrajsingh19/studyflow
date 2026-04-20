import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Card, Button, Input, Badge } from '../../components/ui';
import { BookOpen, MoreVertical, Plus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Subjects() {
  const { subjects, notes, addSubject, deleteSubject } = useAppContext();
  const navigate = useNavigate();
  const [isAdding, setIsAdding] = useState(false);
  const [newSubject, setNewSubject] = useState({ name: '', color: '#3b82f6' });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newSubject.name) return;
    
    addSubject({
      id: `sub_${Date.now()}`,
      name: newSubject.name,
      color: newSubject.color,
      createdAt: Date.now()
    });
    setNewSubject({ name: '', color: '#3b82f6' });
    setIsAdding(false);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold dark:text-white">Subjects</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Manage your study materials.</p>
        </div>
        <Button onClick={() => setIsAdding(true)}>
          <Plus size={16} /> Add Subject
        </Button>
      </div>

      {isAdding && (
        <Card className="border-primary-100 dark:border-primary-900/50 bg-primary-50/50 dark:bg-primary-900/10">
          <form className="flex items-end gap-4" onSubmit={handleAdd}>
            <div className="flex-1">
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Subject Name</label>
              <Input 
                autoFocus
                placeholder="e.g. Organic Chemistry"
                value={newSubject.name}
                onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Color tag</label>
              <input 
                type="color" 
                className="h-10 w-16 p-1 rounded-lg border border-slate-200 cursor-pointer bg-white dark:bg-slate-800 dark:border-slate-700 block"
                value={newSubject.color}
                onChange={(e) => setNewSubject({ ...newSubject, color: e.target.value })}
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={!newSubject.name}>Save</Button>
              <Button type="button" variant="ghost" onClick={() => setIsAdding(false)}>Cancel</Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map(subject => {
          const subjectNotes = notes.filter(n => n.subjectId === subject.id);
          const needsReview = subjectNotes.filter(n => new Date(n.nextReviewDate) <= new Date()).length;
          
          return (
            <Card key={subject.id} className="relative overflow-hidden hover:shadow-md transition-shadow group flex flex-col">
              <div 
                className="absolute top-0 left-0 w-1 h-full" 
                style={{ backgroundColor: subject.color }}
              ></div>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                    style={{ backgroundColor: subject.color }}
                  >
                    <BookOpen size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg dark:text-white leading-tight">{subject.name}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Created {new Date(subject.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <button 
                  className="text-slate-400 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    if(window.confirm(`Are you sure you want to delete ${subject.name}?`)) {
                      deleteSubject(subject.id);
                    }
                  }}
                  title="Delete subject"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              
              <div className="flex gap-4 mt-auto">
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Total Notes</p>
                  <p className="font-semibold dark:text-white">{subjectNotes.length}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">To Review</p>
                  <p className="font-semibold text-primary-600 dark:text-primary-400">{needsReview}</p>
                </div>
                <div className="flex-1 text-right self-end">
                  <Button 
                    variant="secondary" 
                    className="px-3 py-1 text-xs"
                    onClick={() => navigate('/notes')}
                  >
                    View Notes
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
        {subjects.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500 dark:text-slate-400">
            No subjects created yet. Add your first subject to start learning!
          </div>
        )}
      </div>
    </div>
  );
}
