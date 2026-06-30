import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Wallet, Eye, EyeOff, UserPlus } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import toast, { Toaster } from 'react-hot-toast';

export const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const register = useAuthStore((s) => s.register);

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (field: string, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: '' }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Minimum 6 characters';
    if (form.confirm !== form.password) e.confirm = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      const result = register(form.name, form.email, form.password);
      setLoading(false);
      if (result.success) {
        toast.success('Account created! Welcome aboard.');
        navigate('/');
      } else {
        toast.error(result.error ?? 'Registration failed');
      }
    }, 400);
  };

  const Field = ({
    label, field, type = 'text', placeholder, autoComplete,
    extra,
  }: {
    label: string; field: string; type?: string; placeholder: string; autoComplete?: string;
    extra?: React.ReactNode;
  }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        <input
          type={type}
          autoComplete={autoComplete}
          value={(form as any)[field]}
          onChange={(e) => set(field, e.target.value)}
          placeholder={placeholder}
          className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${(form as any)[field] && errors[field] ? 'border-red-400 bg-red-50' : 'border-gray-200'} ${extra ? 'pr-11' : ''}`}
        />
        {extra}
      </div>
      {errors[field] && <p className="text-xs text-red-500 mt-1">{errors[field]}</p>}
    </div>
  );

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

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <Field label="Full name" field="name" placeholder="John Doe" autoComplete="name" />
            <Field label="Email address" field="email" type="email" placeholder="you@example.com" autoComplete="email" />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={form.password}
                  onChange={(e) => set('password', e.target.value)}
                  placeholder="Min. 6 characters"
                  className={`w-full border rounded-xl px-4 py-3 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${errors.password ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm password</label>
              <input
                type="password"
                autoComplete="new-password"
                value={form.confirm}
                onChange={(e) => set('confirm', e.target.value)}
                placeholder="Re-enter password"
                className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${errors.confirm ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
              />
              {errors.confirm && <p className="text-xs text-red-500 mt-1">{errors.confirm}</p>}
            </div>

            {/* Password strength hint */}
            {form.password && (
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((lvl) => (
                  <div
                    key={lvl}
                    className={`h-1 flex-1 rounded-full transition-colors ${
                      form.password.length >= lvl * 3
                        ? form.password.length >= 12 ? 'bg-green-500' : form.password.length >= 8 ? 'bg-yellow-400' : 'bg-red-400'
                        : 'bg-gray-100'
                    }`}
                  />
                ))}
                <span className="text-xs text-gray-400 ml-1">
                  {form.password.length < 6 ? 'Too short' : form.password.length < 8 ? 'Weak' : form.password.length < 12 ? 'Good' : 'Strong'}
                </span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
              ) : <UserPlus className="w-4 h-4" />}
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <Link to="/signin" className="text-primary-600 font-semibold hover:text-primary-700">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};
