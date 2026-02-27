// src/components/layout/AppShell.jsx
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Pill, BarChart2, Bell, Users, Settings,
  LogOut, Menu, X, ChevronRight, Activity, ClipboardList,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Avatar } from '../shared/UI';

const DOCTOR_NAV = [
  { to: '/doctor',           label: 'Dashboard',    icon: LayoutDashboard },
  { to: '/doctor/patients',  label: 'Patients',     icon: Users },
  { to: '/doctor/analytics', label: 'Analytics',    icon: BarChart2 },
  { to: '/doctor/alerts',    label: 'Alerts',       icon: Bell },
  { to: '/doctor/settings',  label: 'Settings',     icon: Settings },
];

const PATIENT_NAV = [
  { to: '/patient',              label: 'Today',       icon: LayoutDashboard },
  { to: '/patient/medications',  label: 'Medications', icon: Pill },
  { to: '/patient/history',      label: 'My History',  icon: Activity },
  { to: '/patient/log',          label: 'Log Dose',    icon: ClipboardList },
  { to: '/patient/settings',     label: 'Settings',    icon: Settings },
];

function SidebarItem({ item, onClick }) {
  return (
    <NavLink
      to={item.to}
      end={item.to.split('/').length <= 2}
      onClick={onClick}
      className={({ isActive }) => isActive ? 'sidebar-link-active' : 'sidebar-link'}
    >
      <item.icon size={18} />
      <span>{item.label}</span>
    </NavLink>
  );
}

export default function AppShell({ children }) {
  const { currentUser, logout, unreadCount } = useApp();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = currentUser?.role === 'doctor' ? DOCTOR_NAV : PATIENT_NAV;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-surface-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-brand-500 flex items-center justify-center flex-shrink-0 shadow-brand">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L12 22M2 12L22 12" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
              <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="2" opacity="0.6"/>
            </svg>
          </div>
          <div>
            <div className="font-display font-bold text-slate-800 leading-none">MediTrack</div>
            <div className="text-xs text-slate-500 leading-none mt-0.5 capitalize">{currentUser?.role} Portal</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => (
          <div key={item.to} className="relative">
            {item.label === 'Alerts' && unreadCount > 0 && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 z-10 min-w-[18px] h-[18px] bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold px-1">
                {unreadCount}
              </span>
            )}
            <SidebarItem item={item} onClick={() => setSidebarOpen(false)} />
          </div>
        ))}
      </nav>

      {/* User card */}
      <div className="px-3 py-4 border-t border-surface-100">
        <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-surface-50 transition-colors">
          <Avatar initials={currentUser?.avatar || '??'} size="sm" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-800 truncate">{currentUser?.name}</p>
            <p className="text-xs text-slate-500 truncate capitalize">{currentUser?.role}</p>
          </div>
          <button onClick={handleLogout} className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors" title="Logout">
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-surface-50 overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-60 flex-col bg-white border-r border-surface-200 flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-72 bg-white shadow-2xl flex flex-col animate-slide-in">
            <button className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-500 hover:bg-surface-100" onClick={() => setSidebarOpen(false)}>
              <X size={18} />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile topbar */}
        <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-surface-200">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg text-slate-500 hover:bg-surface-50">
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-brand-500 flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L12 22M2 12L22 12" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="font-display font-bold text-slate-800">MediTrack</span>
          </div>
          <Avatar initials={currentUser?.avatar || '??'} size="sm" />
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
