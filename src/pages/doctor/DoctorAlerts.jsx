// src/pages/doctor/DoctorAlerts.jsx
import { useApp } from '../../context/AppContext';
import { Avatar, SectionHeader } from '../../components/shared/UI';
import { Bell, AlertTriangle, Info, CheckCircle, CheckCheck, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const TYPE_STYLES = {
  critical: { bg: 'bg-red-50', border: 'border-red-200', icon: <AlertTriangle size={16} className="text-red-500" />, badge: 'badge-danger' },
  alert:    { bg: 'bg-amber-50', border: 'border-amber-200', icon: <Bell size={16} className="text-amber-500" />, badge: 'badge-warning' },
  info:     { bg: 'bg-blue-50', border: 'border-blue-200', icon: <Info size={16} className="text-blue-500" />, badge: 'badge-info' },
};

export default function DoctorAlerts() {
  const { notifications, markNotificationRead, markAllNotificationsRead, getDoctorPatients } = useApp();
  const patients = getDoctorPatients();
  const unread = notifications.filter((n) => !n.read);
  const read = notifications.filter((n) => n.read);

  const getPatient = (id) => patients.find((p) => p.id === id);

  return (
    <div className="p-4 lg:p-8 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <SectionHeader title="Alerts & Notifications" subtitle={`${unread.length} unread`} />
        </div>
        {unread.length > 0 && (
          <button onClick={markAllNotificationsRead} className="btn-ghost text-brand-600">
            <CheckCheck size={16} /> Mark all read
          </button>
        )}
      </div>

      {/* Unread */}
      {unread.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Unread ({unread.length})</p>
          <div className="space-y-3">
            {unread.map((n) => {
              const style = TYPE_STYLES[n.type] || TYPE_STYLES.alert;
              const patient = getPatient(n.patientId);
              return (
                <div key={n.id} className={`flex items-start gap-4 p-4 rounded-2xl border ${style.bg} ${style.border}`}>
                  <div className="mt-0.5">{style.icon}</div>
                  {patient && <Avatar initials={patient.avatar} size="sm" />}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800">{n.message}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{n.time}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {patient && (
                      <Link to={`/doctor/patients/${patient.id}`} className="btn-ghost py-1.5 px-2.5 text-xs">
                        <ExternalLink size={12} /> View
                      </Link>
                    )}
                    <button onClick={() => markNotificationRead(n.id)} className="btn-ghost py-1.5 px-2.5 text-xs text-emerald-600">
                      <CheckCircle size={12} /> Dismiss
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Read */}
      {read.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Earlier</p>
          <div className="space-y-2">
            {read.map((n) => {
              const style = TYPE_STYLES[n.type] || TYPE_STYLES.alert;
              const patient = getPatient(n.patientId);
              return (
                <div key={n.id} className="flex items-start gap-4 p-4 rounded-2xl bg-surface-50 border border-surface-200 opacity-70">
                  <div className="mt-0.5">{style.icon}</div>
                  {patient && <Avatar initials={patient.avatar} size="sm" />}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-600">{n.message}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{n.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {notifications.length === 0 && (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🔕</div>
          <p className="font-display font-semibold text-slate-700 text-lg">All clear!</p>
          <p className="text-sm text-slate-500 mt-1">No alerts at this time.</p>
        </div>
      )}
    </div>
  );
}
