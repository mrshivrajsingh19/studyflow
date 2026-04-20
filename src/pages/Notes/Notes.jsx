import React, { useState, useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Card, Button, Input, Badge } from '../../components/ui';
import { Plus, Search, Star, Clock, CheckCircle, X, BookOpen } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { calculateNextReview } from '../../utils/spacedRepetition';
import { MOCK_NOTES } from '../../services/mockData';

export function Notes() {
  const { subjects, notes, addNote, updateNote } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // all, review
  
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  
  // Note Form State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [subjectId, setSubjectId] = useState('');

  // Review Form State
  const [isReviewing, setIsReviewing] = useState(false);
  const [activeReviewNote, setActiveReviewNote] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);

  // Filter notes
  const filteredNotes = useMemo(() => {
    return notes.filter(n => {
      const titleMatch = String(n.title || '').toLowerCase().includes(searchTerm.toLowerCase());
      const contentMatch = String(n.content || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSearch = titleMatch || contentMatch;
      
      const needsReview = n.nextReviewDate ? new Date(n.nextReviewDate) <= new Date() : false;
      
      if (filter === 'review') return matchesSearch && needsReview;
      return matchesSearch;
    }).sort((a, b) => {
      const dateA = a.nextReviewDate ? new Date(a.nextReviewDate).getTime() : 0;
      const dateB = b.nextReviewDate ? new Date(b.nextReviewDate).getTime() : 0;
      return dateA - dateB;
    });
  }, [notes, searchTerm, filter]);

  const dueCount = useMemo(() => notes.filter(n => n.nextReviewDate && new Date(n.nextReviewDate) <= new Date()).length, [notes]);

  const openEditor = (note = null) => {
    if (note) {
      setEditingNote(note);
      setTitle(note.title);
      setContent(note.content);
      setSubjectId(note.subjectId);
    } else {
      setEditingNote(null);
      setTitle('');
      setContent('');
      setSubjectId(subjects.length > 0 ? subjects[0].id : '');
    }
    setIsEditorOpen(true);
  };

  const closeEditor = () => {
    setIsEditorOpen(false);
    setEditingNote(null);
  };

  const handleSaveNote = (e) => {
    e.preventDefault();
    if (!title || !subjectId) return;

    if (editingNote) {
      updateNote({
        ...editingNote,
        title,
        content,
        subjectId,
        updatedAt: new Date().toISOString()
      });
    } else {
      addNote({
        id: `note_${Date.now()}`,
        subjectId,
        title,
        content,
        confidence: 0,
        interval: 0,
        easiness: 2.5,
        nextReviewDate: new Date().toISOString(), // Due immediately
        reviewCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
    closeEditor();
  };

  const handleStartReview = () => {
    const queue = notes.filter(n => new Date(n.nextReviewDate) <= new Date());
    if (queue.length > 0) {
      // Sort by random or most urgent, here we just take the first
      setActiveReviewNote(queue[0]);
      setShowAnswer(false);
      setIsReviewing(true);
    }
  };

  const handleReviewScore = (score) => {
    // calculate new SM-2 values
    const { interval, easiness } = calculateNextReview(score, activeReviewNote.interval, activeReviewNote.easiness);
    
    // next review date = today + interval days
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + interval);

    updateNote({
      ...activeReviewNote,
      interval,
      easiness,
      confidence: score,
      nextReviewDate: nextDate.toISOString(),
      reviewCount: activeReviewNote.reviewCount + 1,
      updatedAt: new Date().toISOString()
    });

    // Move to next note
    const remainingQueue = notes.filter(n => n.id !== activeReviewNote.id && new Date(n.nextReviewDate) <= new Date());
    if (remainingQueue.length > 0) {
      setActiveReviewNote(remainingQueue[0]);
      setShowAnswer(false);
    } else {
      setIsReviewing(false);
      setActiveReviewNote(null);
    }
  };


  if (isReviewing && activeReviewNote) {
    const subject = subjects.find(s => s.id === activeReviewNote.subjectId);
    return (
      <div className="max-w-3xl mx-auto py-12 flex flex-col items-center">
        <h1 className="text-xl font-bold mb-8 text-slate-500 dark:text-slate-400 text-center">
          Space Repetition Review
        </h1>
        
        <Card className="w-full text-center px-12 py-16 min-h-[400px] flex flex-col justify-center">
          {subject && (
            <div className="mb-4 flex justify-center">
              <Badge color="slate" className="border" style={{ borderColor: subject.color, color: subject.color }}>
                {subject.name}
              </Badge>
            </div>
          )}
          <h2 className="text-3xl font-bold dark:text-white mb-8">{activeReviewNote.title}</h2>
          
          {!showAnswer ? (
            <div className="mt-8">
              <Button onClick={() => setShowAnswer(true)} size="lg" className="px-8">Show Answer</Button>
            </div>
          ) : (
            <div className="text-left bg-slate-50 dark:bg-slate-800 p-6 rounded-xl border border-slate-100 dark:border-slate-700 prose dark:prose-invert max-w-none">
              {activeReviewNote.content ? <ReactMarkdown>{String(activeReviewNote.content)}</ReactMarkdown> : <p className="text-slate-400 italic">No content</p>}
            </div>
          )}
        </Card>

        {showAnswer && (
          <div className="w-full mt-8 animate-in fade-in slide-in-from-bottom-4">
            <h3 className="text-center font-semibold text-slate-700 dark:text-slate-300 mb-4">How well did you recall this?</h3>
            <div className="flex justify-center gap-3">
              <button onClick={() => handleReviewScore(1)} className="flex-1 py-4 rounded-xl bg-red-100 hover:bg-red-200 text-red-800 font-bold transition-colors">1 - Again</button>
              <button onClick={() => handleReviewScore(2)} className="flex-1 py-4 rounded-xl bg-orange-100 hover:bg-orange-200 text-orange-800 font-bold transition-colors">2 - Hard</button>
              <button onClick={() => handleReviewScore(4)} className="flex-1 py-4 rounded-xl bg-blue-100 hover:bg-blue-200 text-blue-800 font-bold transition-colors">4 - Good</button>
              <button onClick={() => handleReviewScore(5)} className="flex-1 py-4 rounded-xl bg-green-100 hover:bg-green-200 text-green-800 font-bold transition-colors">5 - Easy</button>
            </div>
            <p className="text-center text-xs text-slate-500 mt-4">Scoring higher pushes the next review further into the future.</p>
          </div>
        )}
        
        <button 
          onClick={() => setIsReviewing(false)} 
          className="mt-8 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-1"
        >
          <X size={16} /> Exit Session
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold dark:text-white">Smart Notes</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Manage your knowledge base.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="secondary" onClick={handleStartReview} disabled={dueCount === 0} className="relative">
            <Clock size={16} /> Review Queue
            {dueCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {dueCount}
              </span>
            )}
          </Button>
          <Button onClick={() => openEditor()}>
            <Plus size={16} /> Add Note
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <Input 
            className="pl-10" 
            placeholder="Search notes..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
          <button 
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${filter === 'all' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}
            onClick={() => setFilter('all')}
          >
            All Notes
          </button>
          <button 
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${filter === 'review' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}
            onClick={() => setFilter('review')}
          >
            Needs Review
          </button>
        </div>
      </div>

      {!isEditorOpen ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map(note => {
            const subject = subjects.find(s => s.id === note.subjectId);
            const isDue = new Date(note.nextReviewDate) <= new Date();
            
            return (
              <Card key={note.id} className="flex flex-col cursor-pointer hover:border-primary-300 dark:hover:border-primary-700 transition-colors" onClick={() => openEditor(note)}>
                <div className="flex justify-between items-start mb-2">
                  {subject && (
                    <Badge color="slate" className="border" style={{ borderColor: `${subject.color}40`, color: subject.color }}>
                      {subject.name}
                    </Badge>
                  )}
                  {isDue && <Badge color="red" className="animate-pulse">Due Review</Badge>}
                </div>
                <h3 className="font-bold text-lg dark:text-white mb-2 leading-tight">{note.title || 'Untitled Note'}</h3>
                <div className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 mb-4 flex-1">
                  {note.content ? <ReactMarkdown>{String(note.content)}</ReactMarkdown> : <span className="italic text-slate-400">Empty note</span>}
                </div>
                <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs text-slate-500">
                  <div className="flex items-center gap-1">
                    <Star size={12} className={note.confidence >= 4 ? "text-yellow-500 fill-yellow-500" : ""} />
                    Score: {note.confidence}/5
                  </div>
                  <div>
                    Next: {isDue ? 'Today' : new Date(note.nextReviewDate).toLocaleDateString()}
                  </div>
                </div>
              </Card>
            );
          })}
          {filteredNotes.length === 0 && (
            <div className="col-span-full py-20 text-center text-slate-500 dark:text-slate-400 bg-surface-light dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 border-dashed">
              <BookOpen size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
              <p className="text-lg font-medium">No notes found.</p>
              <p className="text-sm">Create a new note or adjust your search filters.</p>
            </div>
          )}
        </div>
      ) : (
        <Card className="max-w-4xl mx-auto shadow-lg border-primary-200 dark:border-primary-800">
          <form onSubmit={handleSaveNote} className="space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
              <h2 className="text-lg font-bold dark:text-white">{editingNote ? 'Edit Note' : 'Create Note'}</h2>
              <button type="button" onClick={closeEditor} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X size={20} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Title</label>
                <Input 
                  required
                  placeholder="e.g. Mitochondria" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)}
                  className="font-medium text-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Subject</label>
                <select 
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-slate-900 dark:border-slate-700 text-slate-900 dark:text-white"
                  value={subjectId}
                  onChange={(e) => setSubjectId(e.target.value)}
                  required
                >
                  <option value="" disabled>Select a subject...</option>
                  {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Content (Markdown supported)</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <textarea 
                  required
                  rows={12}
                  className="w-full p-4 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-slate-900 dark:border-slate-700 font-mono text-sm resize-none text-slate-900 dark:text-slate-200"
                  placeholder="# Heading&#10;&#10;Key facts here...&#10;- bullet point 1"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
                <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 overflow-y-auto prose dark:prose-invert max-w-none text-sm h-[320px]">
                  {content ? <ReactMarkdown>{content}</ReactMarkdown> : <p className="text-slate-400 italic mt-0">Preview will appear here...</p>}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button type="button" variant="ghost" onClick={closeEditor}>Cancel</Button>
              <Button type="submit">
                <CheckCircle size={16} /> Save Note
              </Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
}
