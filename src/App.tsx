import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { Expenses } from './pages/Expenses';
import { Reports } from './pages/Reports';
import { Analytics } from './pages/Analytics';
import { SignIn } from './pages/SignIn';
import { SignUp } from './pages/SignUp';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { useAuthStore } from './store/useAuthStore';

function App() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return (
    <BrowserRouter basename="/expense-tracker">
      <Routes>
        {/* Public routes */}
        <Route path="/signin" element={isAuthenticated ? <Navigate to="/" replace /> : <SignIn />} />
        <Route path="/signup" element={isAuthenticated ? <Navigate to="/" replace /> : <SignUp />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="expenses" element={<Expenses />} />
            <Route path="reports" element={<Reports />} />
            <Route path="analytics" element={<Analytics />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to={isAuthenticated ? '/' : '/signin'} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
