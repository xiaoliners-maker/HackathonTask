// src/pages/LoginPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

const DEMO_ACCOUNTS = [
  { role: 'Doctor',   email: 'elena.ramos@meditrack.health', password: 'doctor123',  label: 'Dr. Elena Ramos', sub: 'Internal Medicine' },
  { role: 'Patient',  email: 'maria.santos@email.com',        password: 'patient123', label: 'Maria Santos',    sub: '93% adherence' },
  { role: 'Patient',  email: 'robert.cruz@email.com',         password: 'patient123', label: 'Robert Cruz',     sub: '61% adherence — At Risk' },
  { role: 'Patient',  email: 'jose.dc@email.com',             password: 'patient123', label: 'Jose Dela Cruz',  sub: '45% — Critical' },
];

export default function LoginPage() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    const ok = login(email.trim(), password);
    setLoading(false);
    if (!ok) { setError('Invalid email or password. Try a demo account below.'); return; }
    const user = { email: email.trim() };
    // redirect based on role
    const found = DEMO_ACCOUNTS.find((a) => a.email === email.trim());
    if (found?.role === 'Doctor') navigate('/doctor');
    else navigate('/patient');
  };

  const fillDemo = (acc) => {
    setEmail(acc.email);
    setPassword(acc.password);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-sky-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left: branding */}
        <div className="hidden lg:block">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-brand-500 flex items-center justify-center shadow-brand-lg">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L12 22M2 12L22 12" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="2" opacity="0.6"/>
              </svg>
            </div>
            <div>
              <div className="font-display font-bold text-2xl text-slate-800">MediTrack</div>
              <div className="text-sm text-slate-500">Medication Adherence Platform</div>
            </div>
          </div>
          <h1 className="font-display text-4xl font-bold text-slate-800 leading-tight mb-4">
            Closing the<br />
            <span className="text-brand-500">Medication</span><br />
            Adherence Gap
          </h1>
          <p className="text-slate-500 leading-relaxed mb-8">
            Real-time tracking for patients. Live adherence dashboards for physicians. Better outcomes for everyone.
          </p>
          {/* Feature pills */}
          <div className="flex flex-wrap gap-2">
            {['📱 Smart Reminders', '📊 Live Dashboard', '🔔 Missed Dose Alerts', '🔐 HIPAA Secure', '📈 Analytics'].map((f) => (
              <span key={f} className="text-xs bg-white border border-surface-200 text-slate-600 px-3 py-1.5 rounded-full shadow-card font-medium">{f}</span>
            ))}
          </div>
        </div>

        {/* Right: login form */}
        <div className="card p-8 shadow-xl">
          <div className="lg:hidden flex items-center gap-2 mb-6">
            <div className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L12 22M2 12L22 12" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="font-display font-bold text-xl text-slate-800">MediTrack</span>
          </div>

          <h2 className="font-display font-bold text-2xl text-slate-800 mb-1">Welcome back</h2>
          <p className="text-sm text-slate-500 mb-6">Sign in to your account</p>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-5">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email Address</label>
              <input className="input" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input className="input pr-10" type={showPass ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600" onClick={() => setShowPass((v) => !v)}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 text-base">
              {loading ? (
                <span className="flex items-center gap-2"><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4"/><path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Signing in…</span>
              ) : 'Sign In'}
            </button>
          </form>

          {/* Demo accounts */}
          <div className="mt-6 pt-5 border-t border-surface-100">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Quick Demo Accounts</p>
            <div className="space-y-2">
              {DEMO_ACCOUNTS.map((acc) => (
                <button
                  key={acc.email}
                  onClick={() => fillDemo(acc)}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl border border-surface-200 hover:border-brand-300 hover:bg-brand-50 transition-all duration-150 group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white ${acc.role === 'Doctor' ? 'bg-brand-500' : 'bg-violet-500'}`}>
                      {acc.label.charAt(0)}
                    </div>
                    <div className="text-left">
                      <div className="text-xs font-semibold text-slate-700">{acc.label}</div>
                      <div className="text-xs text-slate-400">{acc.sub}</div>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${acc.role === 'Doctor' ? 'bg-brand-100 text-brand-700' : 'bg-violet-100 text-violet-700'}`}>
                    {acc.role}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
