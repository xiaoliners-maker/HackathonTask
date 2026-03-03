// src/pages/doctor/DoctorDashboard.jsx
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { computeAdherence, adherenceColor } from '../../data/store';
import { Avatar, ProgressRing, AdherenceBadge, SectionHeader } from '../../components/shared/UI';
import { Users, AlertTriangle, TrendingUp, Activity, ChevronRight, Bell } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { format, subDays } from 'date-fns';

function StatCard({ icon: Icon, label, value, sub, color }) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-slate-500">{label}</span>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color}`}>
          <Icon size={18} className="text-white" />
        </div>
      </div>
      <div className="font-display text-3xl font-bold text-slate-800">{value}</div>
      <div className="text-xs text-slate-500 mt-1">{sub}</div>
    </div>
  );
}

function PatientRow({ patient }) {
  const rate = computeAdherence(patient);
  const col = adherenceColor(rate);
  const hasAlerts = patient.alerts.some((a) => !a.read);
  return (
    <Link to={`/doctor/patients/${patient.id}`} className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-50 transition-colors group">
      <div className="relative">
        <Avatar initials={patient.avatar} size="md" />
        {hasAlerts && <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-slate-800 truncate">{patient.name}</span>
          {hasAlerts && <span className="badge badge-danger text-xs">!</span>}
        </div>
        <p className="text-xs text-slate-500 truncate">{patient.condition}</p>
      </div>
      <div className="flex items-center gap-3">
        <AdherenceBadge rate={rate} />
        <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
      </div>
    </Link>
  );
}

export default function DoctorDashboard() {
  const { currentUser, getDoctorPatients, notifications } = useApp();
  const patients = getDoctorPatients();

  const stats = useMemo(() => {
    const rates = patients.map((p) => computeAdherence(p));
    const avg = rates.length ? Math.round(rates.reduce((s, r) => s + r, 0) / rates.length) : 0;
    const atRisk = patients.filter((p) => computeAdherence(p) < 60).length;
    const withAlerts = patients.filter((p) => p.alerts.some((a) => !a.read)).length;
    return { total: patients.length, avg, atRisk, withAlerts };
  }, [patients]);

  // Build chart data from last 14 days across all patients
  const chartData = useMemo(() => {
    return Array.from({ length: 14 }, (_, i) => {
      const date = subDays(new Date(), 13 - i);
      const key = format(date, 'yyyy-MM-dd');
      const rates = patients.map((p) => {
        const h = p.adherenceHistory.find((d) => d.date === key);
        return h ? h.rate : null;
      }).filter((r) => r !== null);
      const avg = rates.length ? Math.round(rates.reduce((s, r) => s + r, 0) / rates.length) : 0;
      return { date: format(date, 'MMM d'), avg };
    });
  }, [patients]);

  const recentNotifs = notifications.filter((n) => !n.read).slice(0, 4);

  return (
    <div className="p-4 lg:p-8 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="page-title">Good morning, {currentUser?.name?.split(' ')[0]} </h1>
          <p className="text-slate-500 text-sm mt-1">Here's your patient panel overview for today.</p>
        </div>
        <Link to="/doctor/alerts" className="btn-secondary relative">
          <Bell size={16} />
          Alerts
          {notifications.filter((n) => !n.read).length > 0 && (
            <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold px-1">
              {notifications.filter((n) => !n.read).length}
            </span>
          )}
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users}          label="Total Patients"   value={stats.total}       sub="Under your care"          color="bg-brand-500" />
        <StatCard icon={TrendingUp}     label="Avg. Adherence"   value={`${stats.avg}%`}   sub="Last 30 days"             color="bg-sky-500" />
        <StatCard icon={AlertTriangle}  label="At Risk"          value={stats.atRisk}      sub="Below 60% adherence"      color="bg-amber-500" />
        <StatCard icon={Activity}       label="Active Alerts"    value={stats.withAlerts}  sub="Patients needing attention" color="bg-red-500" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Adherence trend chart */}
        <div className="card p-5 lg:col-span-2">
          <SectionHeader title="Panel Adherence Trend" subtitle="14-day average across all patients" />
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gradTeal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} interval={2} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }}
                formatter={(v) => [`${v}%`, 'Avg Adherence']}
              />
              <Area type="monotone" dataKey="avg" stroke="#14b8a6" strokeWidth={2.5} fill="url(#gradTeal)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Alerts panel */}
        <div className="card p-5">
          <SectionHeader title="Recent Alerts" action={<Link to="/doctor/alerts" className="text-xs text-brand-600 hover:underline font-medium">See all</Link>} />
          {recentNotifs.length === 0 ? (
            <div className="text-center py-10">
              <div className="text-3xl mb-2">🎉</div>
              <p className="text-sm text-slate-500">No active alerts</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentNotifs.map((n) => {
                const patient = patients.find((p) => p.id === n.patientId);
                return (
                  <div key={n.id} className={`flex gap-3 p-3 rounded-xl border ${n.type === 'critical' ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'}`}>
                    {patient && <Avatar initials={patient.avatar} size="sm" />}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-700 leading-snug">{n.message}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{n.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Patient list */}
      <div className="card p-5">
        <SectionHeader
          title="Patient Panel"
          subtitle={`${patients.length} patients`}
          action={<Link to="/doctor/patients" className="btn-secondary"><Users size={15} /> View All</Link>}
        />
        <div className="divide-y divide-surface-100">
          {patients.map((p) => <PatientRow key={p.id} patient={p} />)}
        </div>
      </div>
    </div>
  );
}
