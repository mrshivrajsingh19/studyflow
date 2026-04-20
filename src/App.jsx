import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';

// Layouts & UI
import { AppLayout } from './components/layout/AppLayout';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { Spinner } from './components/ui';
import { ErrorBoundary } from './components/ErrorBoundary';

// Pages - Eager loaded for critical path
import { Login } from './pages/Auth/Login';
import { Signup } from './pages/Auth/Signup';
import { Dashboard } from './pages/Dashboard/Dashboard';

// Pages - Lazy loaded
const Subjects = lazy(() => import('./pages/Subjects/Subjects').then(module => ({ default: module.Subjects })));
const Notes = lazy(() => import('./pages/Notes/Notes').then(module => ({ default: module.Notes })));
const StudyRoom = lazy(() => import('./pages/StudyRoom/StudyRoom').then(module => ({ default: module.StudyRoom })));
const Profile = lazy(() => import('./pages/Profile/Profile').then(module => ({ default: module.Profile })));

const SuspenseFallback = () => (
  <div className="flex h-full w-full items-center justify-center p-12">
    <Spinner size="lg" />
  </div>
);

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Protected Routes inside AppLayout */}
            <Route element={<ProtectedRoute />}>
              <Route element={<ErrorBoundary><AppLayout /></ErrorBoundary>}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/subjects" element={
                  <Suspense fallback={<SuspenseFallback />}>
                    <Subjects />
                  </Suspense>
                } />
                <Route path="/notes" element={
                  <Suspense fallback={<SuspenseFallback />}>
                    <Notes />
                  </Suspense>
                } />
                <Route path="/study-room" element={
                  <Suspense fallback={<SuspenseFallback />}>
                    <StudyRoom />
                  </Suspense>
                } />
                <Route path="/profile" element={
                  <Suspense fallback={<SuspenseFallback />}>
                    <Profile />
                  </Suspense>
                } />
              </Route>
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
