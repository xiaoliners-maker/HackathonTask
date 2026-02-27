// src/pages/patient/PatientLogDose.jsx
import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SectionHeader } from '../../components/shared/UI';
import { CheckCircle, XCircle, ClipboardList } from 'lucide-react';
import { format } from 'date-fns';

export default function PatientLogDose() {
  const { getMyPatient, getTodaySchedule, logDose } = useApp();
  const patient = getMyPatient();
  const schedule = getTodaySchedule(patient?.id);
  const [lastLogged, setLastLogged] = useState(null);

  const handleLog = (item, skipped) => {
    logDose(item.key, item.pmId, skipped, '');
    setLastLogged({ name: item.med.name, skipped });
    setTimeout(() => setLastLogged(null), 2000);
  };

  if (!patient) return null;

  const pending = schedule.filter((s) => !s.taken && !s.skipped);
  const done = schedule.filter((s) => s.taken || s.skipped);

  return (
    <div className="p-4 lg:p-8 space-y-6 animate-fade-in">
      <SectionHeader title="Log a Dose" subtitle={format(new Date(), 'EEEE, MMMM d')} />

      {lastLogged && (
        <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border animate-fade-in ${lastLogged.skipped ? 'bg-slate-50 border-slate-200' : 'bg-emerald-50 border-emerald-200'}`}>
          {lastLogged.skipped ? <XCircle size={16} className="text-slate-500" /> : <CheckCircle size={16} className="text-emerald-500" />}
          <p className="text-sm font-medium text-slate-700">
            {lastLogged.skipped ? `${lastLogged.name} marked as skipped` : `${lastLogged.name} logged! Great job 🎉`}
          </p>
        </div>
      )}

      {/* Pending doses */}
      {pending.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-slate-600 mb-3">Pending ({pending.length})</h3>
          <div className="space-y-3">
            {pending.map((item) => (
              <div key={item.key} className="card p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center text-xl" style={{ backgroundColor: item.med.color + '20' }}>
                  💊
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800">{item.med.name} {item.med.dosage}</p>
                  <p className="text-xs text-slate-500">Scheduled for {item.time}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleLog(item, false)} className="btn-primary py-2 px-4">
                    <CheckCircle size={15} /> Take
                  </button>
                  <button onClick={() => handleLog(item, true)} className="btn-secondary py-2 px-3 text-slate-500">
                    <XCircle size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Done */}
      {done.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-slate-600 mb-3">Completed ({done.length})</h3>
          <div className="space-y-2">
            {done.map((item) => (
              <div key={item.key} className={`flex items-center gap-4 p-3 rounded-xl border ${item.skipped ? 'bg-slate-50 border-slate-200 opacity-60' : 'bg-emerald-50 border-emerald-100'}`}>
                <div className="w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center" style={{ backgroundColor: item.med.color + '20' }}>
                  💊
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-700">{item.med.name} {item.med.dosage}</p>
                  <p className="text-xs text-slate-500">{item.time} · {item.skipped ? 'Skipped' : `Taken at ${item.loggedAt ? format(new Date(item.loggedAt), 'h:mm a') : '—'}`}</p>
                </div>
                {item.skipped ? <XCircle size={18} className="text-slate-400" /> : <CheckCircle size={18} className="text-emerald-500" />}
              </div>
            ))}
          </div>
        </div>
      )}

      {schedule.length === 0 && (
        <div className="card p-16 text-center">
          <ClipboardList size={40} className="text-slate-300 mx-auto mb-3" />
          <p className="font-display font-semibold text-slate-600">No doses scheduled today</p>
          <p className="text-sm text-slate-500 mt-1">Your doctor will add your medications soon.</p>
        </div>
      )}

      {pending.length === 0 && schedule.length > 0 && (
        <div className="card p-10 text-center bg-emerald-50 border-emerald-200">
          <div className="text-5xl mb-3">🎉</div>
          <p className="font-display font-bold text-emerald-800 text-xl">All doses logged!</p>
          <p className="text-sm text-emerald-600 mt-1">Great job keeping up with your treatment plan.</p>
        </div>
      )}
    </div>
  );
}
