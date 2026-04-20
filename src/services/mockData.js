import { addDays } from '../utils/dateHelpers';

const today = new Date();

export const MOCK_USER = {
  uid: 'user_123',
  displayName: 'Alex Student',
  email: 'alex@example.com',
  photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
  weeklyGoal: 10, // hours
  streak: 5,
  badges: ['First Note', '3-Day Streak'],
};

export const MOCK_SUBJECTS = [
  { id: 'sub_1', name: 'Computer Science', color: '#3b82f6', createdAt: today.getTime() - 86400000 * 10 },
  { id: 'sub_2', name: 'Physics', color: '#10b981', createdAt: today.getTime() - 86400000 * 8 },
  { id: 'sub_3', name: 'History', color: '#f59e0b', createdAt: today.getTime() - 86400000 * 5 },
];

export const MOCK_NOTES = [
  {
    id: 'note_1',
    subjectId: 'sub_1',
    title: 'React Hooks basics',
    content: 'useState is for local state. useEffect is for side effects. useCallback caches functions.',
    confidence: 3,
    interval: 1,
    easiness: 2.5,
    nextReviewDate: addDays(today, -1).toISOString(), // Overdue
    reviewCount: 2,
    createdAt: new Date(today.getTime() - 86400000 * 5).toISOString(),
    updatedAt: new Date(today.getTime() - 86400000 * 2).toISOString(),
  },
  {
    id: 'note_2',
    subjectId: 'sub_1',
    title: 'Virtual DOM',
    content: 'React keeps a lightweight representation of the real DOM in memory to calculate diffs efficiently.',
    confidence: 5,
    interval: 6,
    easiness: 2.7,
    nextReviewDate: addDays(today, 2).toISOString(), // Not due
    reviewCount: 3,
    createdAt: new Date(today.getTime() - 86400000 * 10).toISOString(),
    updatedAt: new Date(today.getTime() - 86400000 * 2).toISOString(),
  },
  {
    id: 'note_3',
    subjectId: 'sub_2',
    title: 'Newton s First Law',
    content: 'An object at rest stays at rest and an object in motion stays in motion with the same speed and in the same direction unless acted upon by an unbalanced force.',
    confidence: 1,
    interval: 1,
    easiness: 2.3,
    nextReviewDate: today.toISOString(), // Due today
    reviewCount: 1,
    createdAt: new Date(today.getTime() - 86400000 * 1).toISOString(),
    updatedAt: new Date(today.getTime() - 86400000 * 1).toISOString(),
  }
];

export const MOCK_STUDY_SESSIONS = [
  {
    id: 'session_1',
    subjectId: 'sub_1',
    goalText: 'Revise React Hooks',
    durationMinutes: 25,
    startedAt: new Date(today.getTime() - 86400000 * 1).toISOString(),
    endedAt: new Date(today.getTime() - 86400000 * 1 + 25 * 60000).toISOString(),
  },
  {
    id: 'session_2',
    subjectId: 'sub_2',
    goalText: 'Physics Chapter 2',
    durationMinutes: 50,
    startedAt: new Date(today.getTime() - 86400000 * 2).toISOString(),
    endedAt: new Date(today.getTime() - 86400000 * 2 + 50 * 60000).toISOString(),
  }
];
