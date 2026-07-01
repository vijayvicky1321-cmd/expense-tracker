import { create } from 'zustand';
import { auth } from '../lib/firebase';
import type firebase from 'firebase/compat/app';

interface AuthState {
  user: firebase.User | null;
  isAuthenticated: boolean;
  loading: boolean;                // true while Firebase resolves initial auth state
  setUser: (user: firebase.User | null) => void;
  setLoading: (v: boolean) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  isAuthenticated: false,
  loading: true,

  setUser: (user) => set({ user, isAuthenticated: !!user, loading: false }),
  setLoading: (loading) => set({ loading }),

  logout: async () => {
    await auth.signOut();
    set({ user: null, isAuthenticated: false });
  },
}));
