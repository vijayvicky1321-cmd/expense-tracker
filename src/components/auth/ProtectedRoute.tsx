import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { useExpenseStore } from '../../store/useExpenseStore';

export const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, user } = useAuthStore();
  const loadForUser = useExpenseStore((s) => s.loadForUser);

  React.useEffect(() => {
    if (user) loadForUser(user.id);
  }, [user?.id]);

  if (!isAuthenticated) return <Navigate to="/signin" replace />;
  return <Outlet />;
};
