// src/pages/patient/PatientMedications.jsx
import { useApp } from '../../context/AppContext';
import { MEDICATION_CATALOG } from '../../data/store';
import { SectionHeader } from '../../components/shared/UI';
import { Clock, Calendar, Info } from 'lucide-react';

export default function PatientMedications() {
  const { getMyPatient } = useApp();
  const patient = getMyPatient();
  if (!patient) return null;

  return (
    <div className="p-4 lg:p-8 space-y-6 animate-fade-in">
      <SectionHeader title="My Medications" subtitle={`${patient.medications.length} active prescriptions`} />

      <div className="grid sm:grid-cols-2 gap-4">
        {patient.medications.filter((pm) => pm.active).map((pm) => {
          const med = MEDICATION_CATALOG.find((m) => m.id === pm.medId);
          if (!med) return null;
          return (
            <div key={pm.id} className="card p-5">
              {/* Header */}
              <div className="flex items-start gap-3 mb-4">
<div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: med.color + '20' }}>
  <img 
    src="https://cdn-icons-png.flaticon.com/512/655/655968.png" 
    alt="medicine" 
    className="w-7 h-7 object-contain"
  />
</div>
                <div>
                  <h3 className="font-display font-bold text-slate-800 text-lg">{med.name}</h3>
                  <p className="text-sm text-slate-500">{med.dosage} · {med.category}</p>
                </div>
              </div>

              {/* Times */}
              <div className="mb-4">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Dosing Schedule</p>
                <div className="flex flex-wrap gap-2">
                  {pm.times.map((t) => (
                    <div key={t} className="flex items-center gap-1.5 bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold px-3 py-1.5 rounded-xl">
                      <Clock size={12} />
                      {t}
                    </div>
                  ))}
                </div>
              </div>

              {/* Meta */}
              <div className="pt-3 border-t border-surface-100 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <Calendar size={12} />
                  <span>Started {pm.startDate}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Info size={12} />
                  <span>{pm.times.length}x daily</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {patient.medications.length === 0 && (
        <div className="card p-16 text-center">
          <div className="text-4xl mb-3">💊</div>
          <p className="font-display font-semibold text-slate-700">No medications prescribed</p>
          <p className="text-sm text-slate-500 mt-1">Your doctor will add medications to your profile during your next visit.</p>
        </div>
      )}

      {/* Info banner */}
      <div className="card p-4 bg-sky-50 border-sky-200">
        <div className="flex items-start gap-3">
          <Info size={16} className="text-sky-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-sky-800">Important</p>
            <p className="text-sm text-sky-700 mt-0.5">Do not stop or change your medications without consulting your doctor first. If you experience side effects, contact your care team immediately.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
