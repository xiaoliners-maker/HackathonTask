// src/pages/doctor/PatientDetail.jsx
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { computeAdherence, adherenceColor, MEDICATION_CATALOG } from '../../data/store';
import { Avatar, ProgressRing, Modal, SectionHeader, AdherenceBadge } from '../../components/shared/UI';
import { ArrowLeft, Plus, Trash2, Phone, Mail, AlertTriangle, X, CheckCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { format, subDays } from 'date-fns';

export default function PatientDetail() {
  const { id } = useParams();
  const { getPatient, addMedication, removeMedication, dismissAlert } = useApp();
  const patient = getPatient(id);
  const [showAddMed, setShowAddMed] = useState(false);
  const [newMedId, setNewMedId] = useState('');
  const [newTimes, setNewTimes] = useState(['08:00']);
  const [saved, setSaved] = useState(false);

  if (!patient) return (
    <div className="p-8 text-center">
      <p className="text-slate-500">Patient not found.</p>
      <Link to="/doctor/patients" className="btn-primary mt-4 inline-flex">Back to patients</Link>
    </div>
  );

  const rate = computeAdherence(patient);
  const col = adherenceColor(rate);

  const last14 = patient.adherenceHistory.slice(-14).map((d) => ({
    date: format(new Date(d.date), 'MMM d'),
    rate: d.rate,
  }));

  const handleAddMed = () => {
    if (!newMedId) return;
    addMedication(patient.id, newMedId, newTimes.filter(Boolean));
    setShowAddMed(false);
    setNewMedId('');
    setNewTimes(['08:00']);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const addTimeSlot = () => setNewTimes((t) => [...t, '12:00']);
  const removeTimeSlot = (i) => setNewTimes((t) => t.filter((_, idx) => idx !== i));
  const updateTime = (i, val) => setNewTimes((t) => t.map((v, idx) => idx === i ? val : v));

  return (
    <div className="p-4 lg:p-8 space-y-6 animate-fade-in">
      {saved && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-white border border-emerald-200 rounded-xl shadow-lg px-4 py-3 animate-fade-in">
          <CheckCircle size={16} className="text-emerald-500" />
          <span className="text-sm text-slate-700 font-medium">Medication added successfully</span>
        </div>
      )}

      <Link to="/doctor/patients" className="btn-ghost inline-flex -ml-1">
        <ArrowLeft size={16} /> Back to Patients
      </Link>

      {/* Patient header */}
      <div className="card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          <div className="relative">
            <ProgressRing rate={rate} size={80} stroke={7} color={col.ring} />
            <div className="absolute inset-0 flex items-center justify-center">
              <Avatar initials={patient.avatar} size="md" />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap mb-1">
              <h1 className="page-title">{patient.name}</h1>
              <AdherenceBadge rate={rate} />
              {patient.alerts.some((a) => !a.read) && <span className="badge badge-danger flex items-center gap-1"><AlertTriangle size={11} />Has Alerts</span>}
            </div>
            <p className="text-sm text-slate-500 mb-3">{patient.condition} · Age {patient.age} · {patient.gender === 'M' ? 'Male' : 'Female'}</p>
            <div className="flex flex-wrap gap-4 text-sm text-slate-600">
              <a href={`tel:${patient.phone}`} className="flex items-center gap-1.5 hover:text-brand-600"><Phone size={14} />{patient.phone}</a>
              <a href={`mailto:${patient.email}`} className="flex items-center gap-1.5 hover:text-brand-600"><Mail size={14} />{patient.email}</a>
            </div>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="font-display text-4xl font-bold text-slate-800">{rate}%</div>
            <div className="text-xs text-slate-500">30-day adherence</div>
            <div className="mt-2 text-sm font-semibold text-orange-500">🔥 {patient.streak} day streak</div>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {patient.alerts.filter((a) => !a.read).length > 0 && (
        <div className="space-y-2">
          {patient.alerts.filter((a) => !a.read).map((alert) => (
            <div key={alert.id} className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${alert.type === 'critical' ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'}`}>
              <AlertTriangle size={16} className={alert.type === 'critical' ? 'text-red-500' : 'text-amber-500'} />
              <p className="flex-1 text-sm font-medium text-slate-700">{alert.message}</p>
              <button onClick={() => dismissAlert(patient.id, alert.id)} className="p-1 rounded-lg hover:bg-white transition-colors text-slate-400 hover:text-slate-600">
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* 14-day adherence chart */}
        <div className="card p-5">
          <SectionHeader title="14-Day Adherence" subtitle="Daily dose completion rate" />
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={last14} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} interval={1} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
              <Tooltip contentStyle={{ borderRadius: 10, fontSize: 12 }} formatter={(v) => [`${v}%`, 'Adherence']} />
              <Bar dataKey="rate" radius={[4, 4, 0, 0]}>
                {last14.map((entry, i) => (
                  <Cell key={i} fill={entry.rate >= 80 ? '#10b981' : entry.rate >= 60 ? '#f59e0b' : '#ef4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Medications */}
        <div className="card p-5">
          <SectionHeader
            title="Medications"
            subtitle={`${patient.medications.length} prescribed`}
            action={
              <button onClick={() => setShowAddMed(true)} className="btn-primary">
                <Plus size={15} /> Add Med
              </button>
            }
          />
          <div className="space-y-2.5">
            {patient.medications.map((pm) => {
              const med = MEDICATION_CATALOG.find((m) => m.id === pm.medId);
              if (!med) return null;
              return (
                <div key={pm.id} className="flex items-center gap-3 p-3 bg-surface-50 rounded-xl border border-surface-100">
<div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: med.color }}>
  <img 
    src="https://cdn-icons-png.flaticon.com/512/655/655968.png" 
    alt="medicine" 
    className="w-5 h-5 object-contain"
  />
</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800">{med.name} <span className="text-slate-500 font-normal">{med.dosage}</span></p>
                    <p className="text-xs text-slate-500">{pm.times.join(' · ')} · Since {pm.startDate}</p>
                  </div>
                  <button onClick={() => removeMedication(patient.id, pm.id)} className="p-1.5 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              );
            })}
            {patient.medications.length === 0 && (
              <p className="text-sm text-slate-400 text-center py-6">No medications prescribed yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Add Medication Modal */}
      <Modal open={showAddMed} onClose={() => setShowAddMed(false)} title="Add Medication">
        <div className="space-y-4">
          <div>
            <label className="label">Select Medication</label>
            <select className="input" value={newMedId} onChange={(e) => setNewMedId(e.target.value)}>
              <option value="">Choose a medication…</option>
              {MEDICATION_CATALOG.map((m) => (
                <option key={m.id} value={m.id}>{m.name} {m.dosage} — {m.category}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Dosing Times</label>
            <div className="space-y-2">
              {newTimes.map((t, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input type="time" className="input" value={t} onChange={(e) => updateTime(i, e.target.value)} />
                  {newTimes.length > 1 && (
                    <button onClick={() => removeTimeSlot(i)} className="p-2 rounded-lg text-red-400 hover:bg-red-50"><X size={14} /></button>
                  )}
                </div>
              ))}
            </div>
            {newTimes.length < 4 && (
              <button onClick={addTimeSlot} className="btn-ghost mt-2 text-brand-600"><Plus size={14} /> Add time</button>
            )}
          </div>
          <div className="flex gap-2 pt-2">
            <button onClick={() => setShowAddMed(false)} className="btn-secondary flex-1 justify-center">Cancel</button>
            <button onClick={handleAddMed} className="btn-primary flex-1 justify-center" disabled={!newMedId}>Prescribe</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
