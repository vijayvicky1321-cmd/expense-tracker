import React, { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Wallet, Eye, EyeOff, LogIn } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import toast, { Toaster } from 'react-hot-toast';

export const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const login = useAuthStore(useCallback((s) => s.login, []));

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPwd,  setShowPwd]  = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [emailErr,    setEmailErr]    = useState('');
  const [passwordErr, setPasswordErr] = useState('');

  const validate = () => {
    let ok = true;
    if (!email.trim())                        { setEmailErr('Email is required');    ok = false; } else setEmailErr('');
    if (!/\S+@\S+\.\S+/.test(email))         { setEmailErr('Enter a valid email');  ok = false; }
    if (!password)                            { setPasswordErr('Password is required'); ok = false; } else setPasswordErr('');
    return ok;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      const result = login(email, password);
      setLoading(false);
      if (result.success) {
        toast.success('Welcome back!');
        navigate('/');
      } else {
        toast.error(result.error ?? 'Login failed');
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-blue-50 flex items-center justify-center p-4">
      <Toaster position="top-right" toastOptions={{ style: { borderRadius: '12px', fontSize: '14px' } }} />

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-primary-600 rounded-2xl flex items-center justify-center shadow-lg mb-4">
            <Wallet className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">ExpenseTracker</h1>
          <p className="text-sm text-gray-500 mt-1">Sign in to manage your expenses</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Welcome back</h2>

          <form onSubmit={handleSubmit} noValidate>

            {/* Email */}
            <div className="mb-4">
              <label htmlFor="signin-email" className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input
                id="signin-email"
                name="email"
                type="email"
                autoComplete="email"
                autoCorrect="off"
                autoCapitalize="none"
                spellCheck={false}
                placeholder="you@example.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setEmailErr(''); }}
                className={`w-full border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow ${emailErr ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white'}`}
              />
              {emailErr && <p className="text-xs text-red-500 mt-1">{emailErr}</p>}
            </div>

            {/* Password */}
            <div className="mb-6">
              <label htmlFor="signin-password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="signin-password"
                  name="password"
                  type={showPwd ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setPasswordErr(''); }}
                  className={`w-full border rounded-xl px-4 py-3 pr-11 text-sm outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow ${passwordErr ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white'}`}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPwd((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {passwordErr && <p className="text-xs text-red-500 mt-1">{passwordErr}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {loading
                ? <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
                : <LogIn className="w-4 h-4" />
              }
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account?{' '}
          <Link to="/signup" className="text-primary-600 font-semibold hover:text-primary-700">
            Create one free
          </Link>
        </p>
      </div>
    </div>
  );
};
