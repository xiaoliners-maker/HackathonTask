// src/pages/doctor/DoctorPatients.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { computeAdherence, adherenceColor } from '../../data/store';
import { Avatar, AdherenceBadge, ProgressRing, SectionHeader } from '../../components/shared/UI';
import { Search, Filter, ChevronRight, AlertTriangle } from 'lucide-react';

const FILTERS = ['All', 'At Risk', 'Moderate', 'Good'];

export default function DoctorPatients() {
  const { getDoctorPatients } = useApp();
  const patients = getDoctorPatients();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const filtered = patients.filter((p) => {
    const rate = computeAdherence(p);
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.condition.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === 'All' ? true :
      filter === 'At Risk' ? rate < 60 :
      filter === 'Moderate' ? (rate >= 60 && rate < 80) :
      rate >= 80;
    return matchSearch && matchFilter;
  });

  return (
    <div className="p-4 lg:p-8 space-y-6 animate-fade-in">
      <SectionHeader title="Patient Panel" subtitle={`${patients.length} patients under your care`} />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            className="input pl-9"
            placeholder="Search patients by name or condition…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-2 text-sm rounded-xl font-medium transition-all duration-150 ${filter === f ? 'bg-brand-500 text-white shadow-brand' : 'bg-white text-slate-600 border border-surface-200 hover:border-brand-300 hover:bg-brand-50'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Patient cards */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((patient) => {
          const rate = computeAdherence(patient);
          const col = adherenceColor(rate);
          const hasAlerts = patient.alerts.some((a) => !a.read);
          return (
            <Link key={patient.id} to={`/doctor/patients/${patient.id}`} className="card-hover p-5 block group">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar initials={patient.avatar} size="md" />
                    {hasAlerts && <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white" />}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">{patient.name}</p>
                    <p className="text-xs text-slate-500">{patient.age}y · {patient.gender === 'M' ? 'Male' : 'Female'}</p>
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <ProgressRing rate={rate} size={52} stroke={5} color={col.ring} />
                  <span className={`text-xs font-bold -mt-8 ${col.text}`}>{rate}%</span>
                </div>
              </div>
              <p className="text-xs text-slate-500 mb-3 leading-relaxed">{patient.condition}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-slate-500">Streak:</span>
                  <span className="text-xs font-semibold text-slate-700">🔥 {patient.streak}d</span>
                </div>
                <div className="flex items-center gap-2">
                  {hasAlerts && <span className="badge badge-danger flex items-center gap-1"><AlertTriangle size={10} />Alert</span>}
                  <AdherenceBadge rate={rate} />
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-surface-100 flex items-center justify-between">
                <span className="text-xs text-slate-400">{patient.medications.length} medication{patient.medications.length !== 1 ? 's' : ''}</span>
                <ChevronRight size={15} className="text-slate-300 group-hover:text-brand-500 transition-colors" />
              </div>
            </Link>
          );
        })}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-16">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-slate-500 text-sm">No patients match your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
