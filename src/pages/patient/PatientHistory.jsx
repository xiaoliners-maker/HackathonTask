// src/pages/patient/PatientHistory.jsx
import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SectionHeader } from '../../components/shared/UI';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { format } from 'date-fns';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function PatientHistory() {
  const { getMyPatient } = useApp();
  const patient = getMyPatient();
  const [view, setView] = useState('30');

  if (!patient) return null;

  const days = parseInt(view);
  const history = patient.adherenceHistory.slice(-days);

  const chartData = history.map((d) => ({
    date: format(new Date(d.date), days > 14 ? 'MMM d' : 'EEE d'),
    rate: d.rate,
    taken: d.taken,
    total: d.total,
  }));

  const avg = Math.round(history.reduce((s, d) => s + d.rate, 0) / (history.length || 1));
  const prev = patient.adherenceHistory.slice(-(days * 2), -days);
  const prevAvg = prev.length ? Math.round(prev.reduce((s, d) => s + d.rate, 0) / prev.length) : avg;
  const trend = avg - prevAvg;

  const best = Math.max(...history.map((d) => d.rate));
  const worst = Math.min(...history.map((d) => d.rate));
  const perfect = history.filter((d) => d.rate === 100).length;

  return (
    <div className="p-4 lg:p-8 space-y-6 animate-fade-in">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <SectionHeader title="My Adherence History" subtitle="Track your medication consistency over time" />
        <div className="flex gap-1 bg-surface-100 p-1 rounded-xl">
          {['7', '14', '30'].map((d) => (
            <button
              key={d}
              onClick={() => setView(d)}
              className={`px-4 py-1.5 text-sm rounded-lg font-medium transition-all ${view === d ? 'bg-white shadow-card text-brand-600' : 'text-slate-500 hover:text-slate-800'}`}
            >
              {d}d
            </button>
          ))}
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: `${days}-day Avg`, value: `${avg}%`, sub: trend > 0 ? `+${trend}% vs prev period` : trend < 0 ? `${trend}% vs prev period` : 'No change', icon: trend > 0 ? <TrendingUp size={16} className="text-emerald-500" /> : trend < 0 ? <TrendingDown size={16} className="text-red-500" /> : <Minus size={16} className="text-slate-400" />, color: trend > 0 ? 'text-emerald-600' : trend < 0 ? 'text-red-600' : 'text-slate-500' },
          { label: 'Best Day', value: `${best}%`, sub: 'Highest single day', icon: '🏆', color: 'text-amber-600' },
          { label: 'Streak', value: `${patient.streak}d`, sub: 'Current streak', icon: '🔥', color: 'text-orange-500' },
          { label: 'Perfect Days', value: perfect, sub: `In last ${days} days`, icon: '⭐', color: 'text-blue-600' },
        ].map((k) => (
          <div key={k.label} className="card p-4">
            <div className="flex items-center gap-1.5 mb-2">
              <span className="text-lg">{typeof k.icon === 'string' ? k.icon : k.icon}</span>
              <span className="text-xs text-slate-500">{k.label}</span>
            </div>
            <p className={`font-display text-2xl font-bold ${k.color}`}>{k.value}</p>
            <p className="text-xs text-slate-400 mt-0.5 leading-tight">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Area chart */}
      <div className="card p-5">
        <h3 className="section-title mb-4">Adherence Trend</h3>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="patGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} interval={Math.floor(days / 7)} />
            <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
            <Tooltip contentStyle={{ borderRadius: 10, fontSize: 12 }} formatter={(v) => [`${v}%`, 'Adherence']} />
            <Area type="monotone" dataKey="rate" stroke="#14b8a6" strokeWidth={2.5} fill="url(#patGrad)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Daily bars */}
      {days <= 14 && (
        <div className="card p-5">
          <h3 className="section-title mb-4">Daily Breakdown</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
              <Tooltip contentStyle={{ borderRadius: 10, fontSize: 12 }} formatter={(v) => [`${v}%`, 'Adherence']} />
              <Bar dataKey="rate" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, i) => (
                  <Cell key={i} fill={entry.rate >= 80 ? '#10b981' : entry.rate >= 60 ? '#f59e0b' : '#ef4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Calendar-style history */}
      <div className="card p-5">
        <h3 className="section-title mb-4">Log Calendar (last {days} days)</h3>
        <div className="flex flex-wrap gap-2">
          {history.map((d) => (
            <div
              key={d.date}
              title={`${format(new Date(d.date), 'MMM d')}: ${d.rate}%`}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold text-white cursor-default transition-transform hover:scale-110"
              style={{ backgroundColor: d.rate >= 80 ? '#10b981' : d.rate >= 60 ? '#f59e0b' : '#ef4444', opacity: d.rate === 0 ? 0.3 : 1 }}
            >
              {d.rate === 100 ? '✓' : `${Math.round(d.rate / 10) * 10}%`.replace('0%', '0')}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4 mt-4 text-xs text-slate-500">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-emerald-500 inline-block" /> Good (≥80%)</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-amber-500 inline-block" /> Moderate</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-red-500 inline-block" /> Missed</span>
        </div>
      </div>
    </div>
  );
}
