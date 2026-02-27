// src/components/shared/UI.jsx — reusable primitive components

import { X, AlertTriangle, CheckCircle, Info, AlertCircle } from 'lucide-react';

// ── Avatar ─────────────────────────────────────────────────────────────────
const AVATAR_COLORS = [
  'bg-brand-500', 'bg-violet-500', 'bg-sky-500', 'bg-amber-500',
  'bg-rose-500', 'bg-emerald-500', 'bg-orange-500', 'bg-indigo-500',
];
function colorForInitials(initials) {
  const code = initials.charCodeAt(0) + (initials.charCodeAt(1) || 0);
  return AVATAR_COLORS[code % AVATAR_COLORS.length];
}

export function Avatar({ initials, size = 'md', className = '' }) {
  const sizes = { xs: 'w-6 h-6 text-xs', sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-12 h-12 text-base', xl: 'w-16 h-16 text-xl' };
  return (
    <div className={`${sizes[size]} ${colorForInitials(initials)} rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 ${className}`}>
      {initials}
    </div>
  );
}

// ── Progress Ring ─────────────────────────────────────────────────────────
export function ProgressRing({ rate, size = 80, stroke = 7, color }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (rate / 100) * circ;
  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={stroke} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color || '#14b8a6'}
        strokeWidth={stroke}
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.8s ease' }}
      />
    </svg>
  );
}

// ── Modal ─────────────────────────────────────────────────────────────────
export function Modal({ open, onClose, title, children, maxWidth = 'max-w-md' }) {
  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`modal ${maxWidth} w-full`}>
        <div className="flex items-center justify-between p-5 border-b border-surface-100">
          <h2 className="font-display font-bold text-slate-800 text-lg">{title}</h2>
          <button onClick={onClose} className="btn-ghost p-1.5 rounded-lg"><X size={18} /></button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

// ── Toast ─────────────────────────────────────────────────────────────────
export function Toast({ message, type = 'success', onClose }) {
  const icons = { success: <CheckCircle size={18} className="text-emerald-500" />, error: <AlertCircle size={18} className="text-red-500" />, warning: <AlertTriangle size={18} className="text-amber-500" />, info: <Info size={18} className="text-blue-500" /> };
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-white border border-surface-200 rounded-xl shadow-lg px-4 py-3 animate-fade-in max-w-xs">
      {icons[type]}
      <span className="text-sm text-slate-700 font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 text-slate-400 hover:text-slate-600"><X size={14} /></button>
    </div>
  );
}

// ── Empty State ────────────────────────────────────────────────────────────
export function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="font-display font-semibold text-slate-700 text-lg mb-2">{title}</h3>
      <p className="text-sm text-slate-500 max-w-xs mb-6">{description}</p>
      {action}
    </div>
  );
}

// ── Pill badge ─────────────────────────────────────────────────────────────
export function AdherenceBadge({ rate }) {
  if (rate >= 80) return <span className="badge badge-success">{rate}% Good</span>;
  if (rate >= 60) return <span className="badge badge-warning">{rate}% Moderate</span>;
  return <span className="badge badge-danger">{rate}% At Risk</span>;
}

// ── Loading spinner ────────────────────────────────────────────────────────
export function Spinner({ size = 20 }) {
  return (
    <svg className="animate-spin text-brand-500" width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

// ── Section header ─────────────────────────────────────────────────────────
export function SectionHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-start justify-between mb-5">
      <div>
        <h2 className="section-title">{title}</h2>
        {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
