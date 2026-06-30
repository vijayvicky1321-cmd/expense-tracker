import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Receipt,
  FileText,
  TrendingUp,
  X,
  Wallet,
} from 'lucide-react';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/expenses', icon: Receipt, label: 'Expenses' },
  { to: '/reports', icon: FileText, label: 'Reports' },
  { to: '/analytics', icon: TrendingUp, label: 'Analytics' },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => (
  <>
    {/* Overlay */}
    {isOpen && (
      <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={onClose} />
    )}

    <aside
      className={`fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-100 flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-5 py-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary-600 rounded-xl flex items-center justify-center">
            <Wallet className="w-4.5 h-4.5 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">ExpenseTracker</p>
            <p className="text-xs text-gray-400">Personal Finance</p>
          </div>
        </div>
        <button onClick={onClose} className="lg:hidden p-1 rounded-lg hover:bg-gray-100 text-gray-400">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-primary-600' : 'text-gray-400'}`} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <p className="text-xs text-gray-400 text-center">v1.0.0 · All data stored locally</p>
      </div>
    </aside>
  </>
);
