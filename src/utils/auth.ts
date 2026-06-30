import type { StoredUser } from '../types/auth';

const USERS_KEY = 'et_users';

// Simple deterministic hash (not cryptographic — for client-side demo only)
export const hashPassword = (password: string): string => {
  let hash = 0;
  const salted = `et_salt_${password}_et`;
  for (let i = 0; i < salted.length; i++) {
    const char = salted.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return `h_${Math.abs(hash).toString(36)}_${salted.length}`;
};

export const getStoredUsers = (): StoredUser[] => {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) ?? '[]');
  } catch {
    return [];
  }
};

export const saveStoredUsers = (users: StoredUser[]) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const findUserByEmail = (email: string): StoredUser | undefined =>
  getStoredUsers().find((u) => u.email.toLowerCase() === email.toLowerCase());

export const createUser = (name: string, email: string, password: string): StoredUser => {
  const user: StoredUser = {
    id: `user_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    name: name.trim(),
    email: email.toLowerCase().trim(),
    passwordHash: hashPassword(password),
    createdAt: new Date().toISOString(),
  };
  const users = getStoredUsers();
  users.push(user);
  saveStoredUsers(users);
  return user;
};

export const verifyPassword = (password: string, hash: string): boolean =>
  hashPassword(password) === hash;

// Per-user expense storage key
export const userExpenseKey = (userId: string) => `et_expenses_${userId}`;
