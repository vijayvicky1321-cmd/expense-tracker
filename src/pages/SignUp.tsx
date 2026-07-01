import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Wallet, Eye, EyeOff, UserPlus } from 'lucide-react';
import { auth } from '../lib/firebase';
import toast, { Toaster } from 'react-hot-toast';

export const SignUp: React.FC = () => {
  const navigate = useNavigate();

  const [name,     setName]     = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [confirm,  setConfirm]  = useState('');
  const [showPwd,  setShowPwd]  = useState(false);
  const [loading,  setLoading]  = useState(false);

  const [nameErr,     setNameErr]     = useState('');
  const [emailErr,    setEmailErr]    = useState('');
  const [passwordErr, setPasswordErr] = useState('');
  const [confirmErr,  setConfirmErr]  = useState('');

  const validate = () => {
    let ok = true;
    if (!name.trim())                          { setNameErr('Full name is required');     ok = false; } else setNameErr('');
    if (!email.trim())                         { setEmailErr('Email is required');        ok = false; }
    else if (!/\S+@\S+\.\S+/.test(email))     { setEmailErr('Enter a valid email');      ok = false; } else setEmailErr('');
    if (!password)                             { setPasswordErr('Password is required');  ok = false; }
    else if (password.length < 6)             { setPasswordErr('Minimum 6 characters'); ok = false; } else setPasswordErr('');
    if (confirm !== password)                  { setConfirmErr('Passwords do not match'); ok = false; } else setConfirmErr('');
    return ok;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const cred = await auth.createUserWithEmailAndPassword(email.trim(), password);
      // Save display name to Firebase Auth profile
      await cred.user?.updateProfile({ displayName: name.trim() });
      toast.success('Account created! Welcome aboard.');
      navigate('/');
    } catch (err: any) {
      const code = err?.code ?? '';
      if (code === 'auth/email-already-in-use')
        toast.error('An account with this email already exists.');
      else if (code === 'auth/invalid-email')
        toast.error('Invalid email address.');
      else if (code === 'auth/weak-password')
        toast.error('Password is too weak. Use at least 6 characters.');
      else
        toast.error('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const strengthLevel =
    password.length === 0 ? 0 :
    password.length < 6   ? 1 :
    password.length < 8   ? 2 :
    password.length < 12  ? 3 : 4;

  const strengthLabel = ['', 'Too short', 'Weak', 'Good', 'Strong'][strengthLevel];
  const strengthColor = ['', 'bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-green-500'][strengthLevel];

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
          <p className="text-sm text-gray-500 mt-1">Create your free account</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Create account</h2>

          <form onSubmit={handleSubmit} noValidate>

            {/* Full Name */}
            <div className="mb-4">
              <label htmlFor="signup-name" className="block text-sm font-medium text-gray-700 mb-1">Full name</label>
              <input
                id="signup-name"
                name="name"
                type="text"
                autoComplete="name"
                autoCorrect="off"
                autoCapitalize="words"
                spellCheck={false}
                placeholder="John Doe"
                value={name}
                onChange={(e) => { setName(e.target.value); setNameErr(''); }}
                className={`w-full border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow ${nameErr ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white'}`}
              />
              {nameErr && <p className="text-xs text-red-500 mt-1">{nameErr}</p>}
            </div>

            {/* Email */}
            <div className="mb-4">
              <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
              <input
                id="signup-email"
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
            <div className="mb-4">
              <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  id="signup-password"
                  name="password"
                  type={showPwd ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Min. 6 characters"
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
              {password.length > 0 && (
                <div className="flex items-center gap-1 mt-2">
                  {[1, 2, 3, 4].map((lvl) => (
                    <div key={lvl} className={`h-1 flex-1 rounded-full transition-colors ${lvl <= strengthLevel ? strengthColor : 'bg-gray-100'}`} />
                  ))}
                  <span className="text-xs text-gray-400 ml-1 w-16 text-right">{strengthLabel}</span>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="mb-6">
              <label htmlFor="signup-confirm" className="block text-sm font-medium text-gray-700 mb-1">Confirm password</label>
              <input
                id="signup-confirm"
                name="confirm"
                type="password"
                autoComplete="new-password"
                placeholder="Re-enter password"
                value={confirm}
                onChange={(e) => { setConfirm(e.target.value); setConfirmErr(''); }}
                className={`w-full border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow ${confirmErr ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white'}`}
              />
              {confirmErr && <p className="text-xs text-red-500 mt-1">{confirmErr}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {loading
                ? <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
                : <UserPlus className="w-4 h-4" />}
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <Link to="/signin" className="text-primary-600 font-semibold hover:text-primary-700">Sign in</Link>
        </p>
      </div>
    </div>
  );
};
