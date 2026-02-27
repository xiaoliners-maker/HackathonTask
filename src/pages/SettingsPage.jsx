// src/pages/SettingsPage.jsx
import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Avatar, SectionHeader } from '../components/shared/UI';
import { Bell, Shield, User, Moon, Globe, ChevronRight, Check } from 'lucide-react';

function ToggleSetting({ label, description, value, onChange }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-surface-100 last:border-0">
      <div>
        <p className="text-sm font-medium text-slate-800">{label}</p>
        {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${value ? 'bg-brand-500' : 'bg-slate-200'}`}
      >
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${value ? 'translate-x-5' : 'translate-x-0'}`} />
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const { currentUser } = useApp();
  const [settings, setSettings] = useState({
    doseReminders: true,
    missedAlerts: true,
    weeklyReport: false,
    darkMode: false,
    biometric: false,
    twoFactor: false,
  });

  const toggle = (key) => (val) => setSettings((s) => ({ ...s, [key]: val }));
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-4 lg:p-8 space-y-6 animate-fade-in max-w-2xl">
      <SectionHeader title="Settings" subtitle="Manage your account and preferences" />

      {/* Profile card */}
      <div className="card p-5 flex items-center gap-4">
        <Avatar initials={currentUser?.avatar || '?'} size="lg" />
        <div className="flex-1">
          <p className="font-display font-bold text-slate-800 text-lg">{currentUser?.name}</p>
          <p className="text-sm text-slate-500">{currentUser?.email}</p>
          {currentUser?.specialty && <p className="text-xs text-brand-600 font-medium mt-0.5">{currentUser?.specialty} · {currentUser?.hospital}</p>}
        </div>
        <button className="btn-secondary">Edit Profile</button>
      </div>

      {/* Notifications */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Bell size={18} className="text-brand-500" />
          <h2 className="section-title">Notifications</h2>
        </div>
        <ToggleSetting label="Dose Reminders" description="Get notified when it's time to take your medication" value={settings.doseReminders} onChange={toggle('doseReminders')} />
        <ToggleSetting label="Missed Dose Alerts" description="Alert when a dose window has passed without logging" value={settings.missedAlerts} onChange={toggle('missedAlerts')} />
        <ToggleSetting label="Weekly Adherence Report" description="Receive a weekly summary of your adherence" value={settings.weeklyReport} onChange={toggle('weeklyReport')} />
      </div>

      {/* Security */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Shield size={18} className="text-brand-500" />
          <h2 className="section-title">Security & Privacy</h2>
        </div>
        <ToggleSetting label="Biometric Login" description="Use fingerprint or face ID to sign in" value={settings.biometric} onChange={toggle('biometric')} />
        <ToggleSetting label="Two-Factor Authentication" description="Add an extra layer of security to your account" value={settings.twoFactor} onChange={toggle('twoFactor')} />
        <div className="pt-3">
          <button className="btn-ghost text-red-500 hover:bg-red-50 hover:text-red-600">Change Password</button>
        </div>
      </div>

      {/* Preferences */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Globe size={18} className="text-brand-500" />
          <h2 className="section-title">Preferences</h2>
        </div>
        <div className="space-y-3">
          <div>
            <label className="label">Time Zone</label>
            <select className="input">
              <option>Asia/Manila (GMT+8)</option>
              <option>America/New_York (GMT-5)</option>
              <option>Europe/London (GMT+0)</option>
            </select>
          </div>
          <div>
            <label className="label">Language</label>
            <select className="input">
              <option>English</option>
              <option>Filipino</option>
              <option>Spanish</option>
            </select>
          </div>
        </div>
      </div>

      {/* HIPAA notice */}
      <div className="card p-4 bg-slate-50 border-slate-200">
        <div className="flex items-start gap-2">
          <Shield size={15} className="text-slate-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-slate-500 leading-relaxed">
            MediTrack is fully HIPAA-compliant. Your health data is encrypted with AES-256, stored securely, and never shared with third parties without your explicit consent. You can request a full data export or deletion at any time.
          </p>
        </div>
      </div>

      <button onClick={handleSave} className="btn-primary w-full justify-center py-3">
        {saved ? <><Check size={16} /> Saved!</> : 'Save Changes'}
      </button>
    </div>
  );
}
