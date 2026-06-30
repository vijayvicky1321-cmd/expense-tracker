import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthState, User } from '../types/auth';
import { findUserByEmail, createUser, verifyPassword } from '../utils/auth';

const AUTH_SESSION_KEY = 'et_session';

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: (email, password) => {
        const stored = findUserByEmail(email);
        if (!stored) {
          return { success: false, error: 'No account found with this email.' };
        }
        if (!verifyPassword(password, stored.passwordHash)) {
          return { success: false, error: 'Incorrect password.' };
        }
        const user: User = {
          id: stored.id,
          name: stored.name,
          email: stored.email,
          createdAt: stored.createdAt,
        };
        set({ user, isAuthenticated: true });
        return { success: true };
      },

      register: (name, email, password) => {
        if (!name.trim()) return { success: false, error: 'Name is required.' };
        if (!email.trim()) return { success: false, error: 'Email is required.' };
        if (password.length < 6) return { success: false, error: 'Password must be at least 6 characters.' };
        const existing = findUserByEmail(email);
        if (existing) return { success: false, error: 'An account with this email already exists.' };

        const stored = createUser(name, email, password);
        const user: User = {
          id: stored.id,
          name: stored.name,
          email: stored.email,
          createdAt: stored.createdAt,
        };
        set({ user, isAuthenticated: true });
        return { success: true };
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: AUTH_SESSION_KEY,
      // Only persist user identity, not actions
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
