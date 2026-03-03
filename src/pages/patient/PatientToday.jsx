// src/pages/patient/PatientToday.jsx
import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MEDICATION_CATALOG } from '../../data/store';
import { ProgressRing, Avatar, Modal } from '../../components/shared/UI';
import { CheckCircle, XCircle, Clock, Flame, Star, ChevronDown, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';

function DoseCard({ item, onLog }) {
  const [showSkipModal, setShowSkipModal] = useState(false);
  const [note, setNote] = useState('');
  const isPast = new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit', hour12: false }) > item.time;

  const handleTake = () => onLog(item.key, item.pmId, false, '');
  const handleSkip = () => { onLog(item.key, item.pmId, true, note); setShowSkipModal(false); setNote(''); };

  return (
    <>
      <div className={`flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200 ${
        item.taken && !item.skipped ? 'bg-emerald-50 border-emerald-200' :
        item.skipped ? 'bg-slate-50 border-slate-200 opacity-60' :
        isPast ? 'bg-red-50 border-red-200' :
        'bg-white border-surface-200 hover:border-brand-200 hover:bg-brand-50'
      }`}>
        {/* Pill icon */}
<div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: item.med.color + '20' }}>
  <img 
    src="https://cdn-icons-png.flaticon.com/512/655/655968.png" 
    alt="medicine" 
    className="w-7 h-7 object-contain"
    style={{ filter: `opacity(0.85)` }}
  />
</div>
        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-slate-800 text-sm">{item.med.name} <span className="text-slate-500 font-normal">{item.med.dosage}</span></p>
          <div className="flex items-center gap-2 mt-0.5">
            <Clock size={12} className="text-slate-400" />
            <span className="text-xs text-slate-500">{item.time}</span>
            {item.taken && !item.skipped && item.loggedAt && (
              <span className="text-xs text-emerald-600">· Taken at {format(new Date(item.loggedAt), 'h:mm a')}</span>
            )}
            {item.skipped && <span className="text-xs text-slate-500">· Skipped</span>}
            {!item.taken && isPast && <span className="text-xs text-red-500 font-medium">· Overdue</span>}
          </div>
        </div>
        {/* Action */}
        {!item.taken && !item.skipped ? (
          <div className="flex gap-2 flex-shrink-0">
            <button onClick={handleTake} className="flex items-center gap-1 bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold px-3 py-2 rounded-xl shadow-brand transition-all active:scale-95">
              <CheckCircle size={14} /> Take
            </button>
            <button onClick={() => setShowSkipModal(true)} className="flex items-center gap-1 bg-white hover:bg-surface-50 text-slate-500 text-xs font-medium px-3 py-2 rounded-xl border border-surface-200 transition-all">
              <XCircle size={14} /> Skip
            </button>
          </div>
        ) : item.taken && !item.skipped ? (
          <div className="flex items-center gap-1.5 text-emerald-600 flex-shrink-0">
            <CheckCircle size={18} className="fill-emerald-100" />
            <span className="text-xs font-semibold">Done</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-slate-400 flex-shrink-0">
            <XCircle size={18} />
            <span className="text-xs">Skipped</span>
          </div>
        )}
      </div>

      <Modal open={showSkipModal} onClose={() => setShowSkipModal(false)} title="Skip this dose?">
        <div className="space-y-4">
          <p className="text-sm text-slate-500">Let your doctor know why you're skipping this dose. This helps them understand your treatment better.</p>
          <div>
            <label className="label">Reason (optional)</label>
            <textarea className="input resize-none h-24" placeholder="e.g. Ran out of medication, side effects, forgot…" value={note} onChange={(e) => setNote(e.target.value)} />
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowSkipModal(false)} className="btn-secondary flex-1 justify-center">Cancel</button>
            <button onClick={handleSkip} className="btn-danger flex-1 justify-center">Confirm Skip</button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default function PatientToday() {
  const { currentUser, getMyPatient, getTodaySchedule, logDose } = useApp();
  const patient = getMyPatient();
  const schedule = getTodaySchedule(patient?.id);

  if (!patient) return <div className="p-8 text-center text-slate-500">Patient data not found.</div>;

  const taken = schedule.filter((s) => s.taken && !s.skipped).length;
  const total = schedule.length;
  const pct = total > 0 ? Math.round((taken / total) * 100) : 0;

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const last7 = patient.adherenceHistory.slice(-7);
  const weekAvg = last7.length ? Math.round(last7.reduce((s, d) => s + d.rate, 0) / last7.length) : 0;

  return (
    <div className="p-4 lg:p-8 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-500 text-sm">{format(new Date(), 'EEEE, MMMM d')}</p>
          <h1 className="page-title">{greeting()}, {patient.name.split(' ')[0]} </h1>
        </div>
        <Avatar initials={patient.avatar} size="lg" />
      </div>

      {/* Today summary card */}
      <div className="card p-6 bg-gradient-to-r from-brand-500 to-brand-600 border-brand-500 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-brand-100 text-sm mb-1">Today's Progress</p>
            <div className="font-display text-4xl font-bold mb-1">{taken} / {total} doses</div>
            <p className="text-brand-100 text-sm">{taken === total && total > 0 ? '🎉 All done for today!' : `${total - taken} dose${total - taken !== 1 ? 's' : ''} remaining`}</p>
          </div>
          <div className="relative">
            <ProgressRing rate={pct} size={100} stroke={9} color="rgba(255,255,255,0.9)" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="font-display text-2xl font-bold text-white">{pct}%</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="card p-4 text-center">
          <Flame size={20} className="text-orange-400 mx-auto mb-1" />
          <p className="font-display text-2xl font-bold text-slate-800">{patient.streak}</p>
          <p className="text-xs text-slate-500">day streak</p>
        </div>
        <div className="card p-4 text-center">
          <Star size={20} className="text-amber-400 mx-auto mb-1" />
          <p className="font-display text-2xl font-bold text-slate-800">{weekAvg}%</p>
          <p className="text-xs text-slate-500">this week</p>
        </div>
        <div className="card p-4 text-center">
          <CheckCircle size={20} className="text-brand-500 mx-auto mb-1" />
          <p className="font-display text-2xl font-bold text-slate-800">{total}</p>
          <p className="text-xs text-slate-500">today's doses</p>
        </div>
      </div>

      {/* Schedule */}
      <div>
        <h2 className="section-title mb-4">Today's Schedule</h2>
        {schedule.length === 0 ? (
          <div className="card p-10 text-center">
            <div className="text-4xl mb-3">🎉</div>
            <p className="font-display font-semibold text-slate-700">No medications today</p>
            <p className="text-sm text-slate-500 mt-1">Enjoy your day!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {schedule.map((item) => (
              <DoseCard key={item.key} item={item} onLog={logDose} />
            ))}
          </div>
        )}
      </div>

      {/* Mini tip */}
      {pct < 100 && total > 0 && (
        <div className="card p-4 bg-sky-50 border-sky-200 flex items-start gap-3">
          <MessageSquare size={16} className="text-sky-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-sky-700">
            <span className="font-semibold">Tip:</span> Taking your medications consistently at the same time each day helps maintain steady levels in your system.
          </p>
        </div>
      )}
    </div>
  );
}
