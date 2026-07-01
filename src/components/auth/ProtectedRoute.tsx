import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { useExpenseStore } from '../../store/useExpenseStore';

export const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, user } = useAuthStore();
  const { loadForUser, clearExpenses } = useExpenseStore();

  useEffect(() => {
    if (user?.uid) {
      loadForUser(user.uid);
    } else {
      clearExpenses();
    }
  }, [user?.uid]);

  if (!isAuthenticated) return <Navigate to="/signin" replace />;
  return <Outlet />;
};
