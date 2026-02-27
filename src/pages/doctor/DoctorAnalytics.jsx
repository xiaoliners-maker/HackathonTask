// src/pages/doctor/DoctorAnalytics.jsx
import { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { computeAdherence } from '../../data/store';
import { SectionHeader, Avatar } from '../../components/shared/UI';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis } from 'recharts';
import { format, subDays } from 'date-fns';

const COLORS = ['#14b8a6', '#3b82f6', '#8b5cf6', '#f59e0b', '#ec4899'];

export default function DoctorAnalytics() {
  const { getDoctorPatients } = useApp();
  const patients = getDoctorPatients();

  // Panel adherence over 30 days per patient
  const lineData = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => {
      const date = subDays(new Date(), 29 - i);
      const key = format(date, 'yyyy-MM-dd');
      const obj = { date: format(date, 'MMM d') };
      patients.forEach((p, pi) => {
        const h = p.adherenceHistory.find((d) => d.date === key);
        obj[p.name.split(' ')[0]] = h ? h.rate : 0;
      });
      return obj;
    });
  }, [patients]);

  // Adherence distribution
  const distData = useMemo(() => {
    const buckets = { 'Good (≥80%)': 0, 'Moderate (60–79%)': 0, 'At Risk (<60%)': 0 };
    patients.forEach((p) => {
      const r = computeAdherence(p);
      if (r >= 80) buckets['Good (≥80%)']++;
      else if (r >= 60) buckets['Moderate (60–79%)']++;
      else buckets['At Risk (<60%)']++;
    });
    return Object.entries(buckets).map(([name, value]) => ({ name, value }));
  }, [patients]);

  // Per-patient comparison bar
  const patientBar = useMemo(() => patients.map((p) => ({
    name: p.name.split(' ')[0],
    adherence: computeAdherence(p),
    streak: p.streak,
  })), [patients]);

  // Medication category breakdown
  const conditionData = useMemo(() => {
    const map = {};
    patients.forEach((p) => {
      const r = computeAdherence(p);
      p.condition.split(',').forEach((c) => {
        const key = c.trim();
        if (!map[key]) map[key] = { total: 0, count: 0 };
        map[key].total += r;
        map[key].count++;
      });
    });
    return Object.entries(map).map(([subject, d]) => ({ subject, avg: Math.round(d.total / d.count) }));
  }, [patients]);

  const PIE_COLORS = ['#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="p-4 lg:p-8 space-y-6 animate-fade-in">
      <SectionHeader title="Analytics" subtitle="Panel-wide adherence insights and trends" />

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Panel Average', value: `${Math.round(patients.reduce((s, p) => s + computeAdherence(p), 0) / patients.length)}%`, color: 'text-brand-600' },
          { label: 'Best Adherence', value: `${Math.max(...patients.map((p) => computeAdherence(p)))}%`, color: 'text-emerald-600' },
          { label: 'Needs Attention', value: `${patients.filter((p) => computeAdherence(p) < 60).length}`, color: 'text-red-600' },
          { label: 'Avg Streak', value: `${Math.round(patients.reduce((s, p) => s + p.streak, 0) / patients.length)}d`, color: 'text-amber-600' },
        ].map((k) => (
          <div key={k.label} className="card p-5">
            <p className="text-xs text-slate-500 mb-1">{k.label}</p>
            <p className={`font-display text-3xl font-bold ${k.color}`}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* 30-day multi-patient trend */}
      <div className="card p-5">
        <SectionHeader title="30-Day Adherence per Patient" subtitle="Individual trends" />
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={lineData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} interval={4} />
            <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
            <Tooltip contentStyle={{ borderRadius: 10, fontSize: 12 }} formatter={(v) => [`${v}%`]} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            {patients.map((p, i) => (
              <Line key={p.id} type="monotone" dataKey={p.name.split(' ')[0]} stroke={COLORS[i % COLORS.length]} strokeWidth={2} dot={false} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Distribution pie */}
        <div className="card p-5">
          <SectionHeader title="Adherence Distribution" />
          <div className="flex items-center gap-6 justify-center">
            <PieChart width={180} height={180}>
              <Pie data={distData} cx={85} cy={85} innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value">
                {distData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
              </Pie>
            </PieChart>
            <div className="space-y-3">
              {distData.map((d, i) => (
                <div key={d.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: PIE_COLORS[i] }} />
                  <div>
                    <p className="text-xs font-semibold text-slate-700">{d.name}</p>
                    <p className="text-xs text-slate-500">{d.value} patient{d.value !== 1 ? 's' : ''}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Per-patient bar */}
        <div className="card p-5">
          <SectionHeader title="Patient Comparison" subtitle="Adherence & streak" />
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={patientBar} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ borderRadius: 10, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="adherence" fill="#14b8a6" radius={[4, 4, 0, 0]} name="Adherence %" />
              <Bar dataKey="streak" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Streak (days)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Condition radar */}
      {conditionData.length > 2 && (
        <div className="card p-5">
          <SectionHeader title="Adherence by Condition" subtitle="Average across all patients" />
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={conditionData}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#64748b' }} />
              <Radar dataKey="avg" stroke="#14b8a6" fill="#14b8a6" fillOpacity={0.25} strokeWidth={2} />
              <Tooltip contentStyle={{ borderRadius: 10, fontSize: 12 }} formatter={(v) => [`${v}%`, 'Avg Adherence']} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
