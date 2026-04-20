import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { collection, query, where, onSnapshot, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from './AuthContext';

// We import mock data as a fallback for the demo user
import { MOCK_SUBJECTS, MOCK_NOTES, MOCK_STUDY_SESSIONS } from '../services/mockData';

const AppContext = createContext();

export function useAppContext() {
  return useContext(AppContext);
}

const initialState = {
  theme: localStorage.getItem('theme') || 'light',
  subjects: [],
  notes: [],
  sessions: [],
  isLoaded: false
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_THEME':
      localStorage.setItem('theme', action.payload);
      const root = window.document.documentElement;
      if (action.payload === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
      return { ...state, theme: action.payload };
    case 'LOAD_DATA':
      return {
        ...state,
        subjects: action.payload.subjects || state.subjects,
        notes: action.payload.notes || state.notes,
        sessions: action.payload.sessions || state.sessions,
        isLoaded: true
      };
    case 'CLEAR_DATA':
      return {
        ...initialState,
        theme: state.theme
      };
    // Note: We don't need ADD_NOTE, etc., redurcers anymore because onSnapshot handles real-time updates automagically!
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const { currentUser } = useAuth();

  useEffect(() => {
    // Initial theme setup
    const root = window.document.documentElement;
    if (state.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [state.theme]);

  useEffect(() => {
    if (!currentUser) {
      dispatch({ type: 'CLEAR_DATA' });
      return;
    }

    if (currentUser.uid === 'demo_user') {
      dispatch({
        type: 'LOAD_DATA',
        payload: {
          subjects: MOCK_SUBJECTS,
          notes: MOCK_NOTES,
          sessions: MOCK_STUDY_SESSIONS
        }
      });
      return;
    }

    // Set up Realtime Listeners for Firestore
    const subjectsQuery = query(collection(db, 'subjects'), where('userId', '==', currentUser.uid));
    const unsubsSubjects = onSnapshot(subjectsQuery, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      dispatch({ type: 'LOAD_DATA', payload: { subjects: data } });
    });

    const notesQuery = query(collection(db, 'notes'), where('userId', '==', currentUser.uid));
    const unsubsNotes = onSnapshot(notesQuery, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      dispatch({ type: 'LOAD_DATA', payload: { notes: data } });
    });

    const sessionsQuery = query(collection(db, 'sessions'), where('userId', '==', currentUser.uid));
    const unsubsSessions = onSnapshot(sessionsQuery, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      dispatch({ type: 'LOAD_DATA', payload: { sessions: data } });
    });

    return () => {
      unsubsSubjects();
      unsubsNotes();
      unsubsSessions();
    };
  }, [currentUser]);

  const toggleTheme = () => {
    dispatch({ type: 'SET_THEME', payload: state.theme === 'light' ? 'dark' : 'light' });
  };

  // CRUD actions proxying directly to Firestore
  const addSubject = async (subject) => {
    if (currentUser?.uid === 'demo_user') return; // Demo is readonly
    const subjectRef = doc(db, 'subjects', subject.id);
    await setDoc(subjectRef, { ...subject, userId: currentUser.uid });
  };

  const addNote = async (note) => {
    if (currentUser?.uid === 'demo_user') return;
    const noteRef = doc(db, 'notes', note.id);
    await setDoc(noteRef, { ...note, userId: currentUser.uid });
  };

  const updateNote = async (note) => {
    if (currentUser?.uid === 'demo_user') return;
    const noteRef = doc(db, 'notes', note.id);
    await setDoc(noteRef, { ...note, userId: currentUser.uid }, { merge: true });
  };

  const addSession = async (session) => {
    if (currentUser?.uid === 'demo_user') return;
    const sessionRef = doc(db, 'sessions', session.id);
    await setDoc(sessionRef, { ...session, userId: currentUser.uid });
  };

  const deleteSubject = async (subjectId) => {
    if (currentUser?.uid === 'demo_user') return;
    await deleteDoc(doc(db, 'subjects', subjectId));
  };

  const value = {
    ...state,
    toggleTheme,
    addSubject,
    deleteSubject,
    addNote,
    updateNote,
    addSession
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}
