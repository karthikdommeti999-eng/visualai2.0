import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { AICoach } from './pages/AICoach';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { FaceScan } from './pages/FaceScan';
import { AuthProvider } from './context/AuthContext';

import { About } from './pages/About';

import { ProtectedRoute } from './components/ProtectedRoute';

import { ToastProvider } from './context/ToastContext';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/scan"
              element={
                <ProtectedRoute>
                  <FaceScan />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ai-coach"
              element={
                <ProtectedRoute>
                  <AICoach />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/about" element={<About />} />
            {/* Fallbacks can go here */}
            <Route path="*" element={<Home />} />
          </Routes>
        </Layout>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
