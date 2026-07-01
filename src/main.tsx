import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { auth } from './lib/firebase';
import { useAuthStore } from './store/useAuthStore';

// Listen to Firebase auth state once before rendering
auth.onAuthStateChanged((user) => {
  useAuthStore.getState().setUser(user);
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
