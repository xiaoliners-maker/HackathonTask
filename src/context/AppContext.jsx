// src/context/AppContext.jsx
import { createContext, useContext, useState, useCallback } from 'react';
import { USERS, INITIAL_PATIENTS, INITIAL_NOTIFICATIONS, buildTodaySchedule, MEDICATION_CATALOG } from '../data/store';
import { format } from 'date-fns';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [patients, setPatients] = useState(INITIAL_PATIENTS);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [logEntries, setLogEntries] = useState([]); // { key, loggedAt, skipped, note }
  const [alerts, setAlerts] = useState([]);

  // ── Auth ──────────────────────────────────────────────────────────────────
  const login = useCallback((email, password) => {
    const user = USERS.find((u) => u.email === email && u.password === password);
    if (!user) return false;
    setCurrentUser(user);
    return true;
  }, []);

  const logout = useCallback(() => setCurrentUser(null), []);

  // ── Patient helpers ───────────────────────────────────────────────────────
  const getPatient = useCallback((id) => patients.find((p) => p.id === id), [patients]);

  const getMyPatient = useCallback(() => {
    if (!currentUser || currentUser.role !== 'patient') return null;
    return patients.find((p) => p.id === currentUser.id);
  }, [currentUser, patients]);

  const getDoctorPatients = useCallback(() => {
    if (!currentUser || currentUser.role !== 'doctor') return [];
    return patients.filter((p) => p.doctorId === currentUser.id);
  }, [currentUser, patients]);

  // ── Log a dose ────────────────────────────────────────────────────────────
  const logDose = useCallback((key, pmId, skipped = false, note = '') => {
    const now = new Date();
    setLogEntries((prev) => {
      const existing = prev.findIndex((l) => l.key === key);
      const entry = { key, pmId, loggedAt: now.toISOString(), skipped, note };
      if (existing >= 0) {
        const next = [...prev];
        next[existing] = entry;
        return next;
      }
      return [...prev, entry];
    });

    // Update patient adherence history
    const today = format(now, 'yyyy-MM-dd');
    setPatients((prev) =>
      prev.map((p) => {
        const hasMed = p.medications.some((pm) => pm.id === pmId);
        if (!hasMed) return p;

        const history = [...p.adherenceHistory];
        const todayIdx = history.findIndex((h) => h.date === today);
        if (todayIdx >= 0) {
          if (!skipped) {
            history[todayIdx] = {
              ...history[todayIdx],
              taken: Math.min(history[todayIdx].taken + 1, history[todayIdx].total),
              rate: Math.min(100, history[todayIdx].rate + Math.round(100 / history[todayIdx].total)),
            };
          }
        } else {
          history.push({ date: today, rate: skipped ? 0 : 50, taken: skipped ? 0 : 1, total: 2 });
        }

        const newStreak = skipped ? p.streak : p.streak + 1;
        return { ...p, adherenceHistory: history, streak: skipped ? p.streak : newStreak };
      })
    );
  }, []);

  // ── Get today's schedule ──────────────────────────────────────────────────
  const getTodaySchedule = useCallback((patientId) => {
    const patient = patients.find((p) => p.id === patientId);
    if (!patient) return [];
    return buildTodaySchedule(patient.medications, logEntries);
  }, [patients, logEntries]);

  // ── Add medication to patient ─────────────────────────────────────────────
  const addMedication = useCallback((patientId, medId, times) => {
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id !== patientId) return p;
        const newMed = {
          id: `pm_${Date.now()}`,
          medId,
          times,
          startDate: format(new Date(), 'yyyy-MM-dd'),
          active: true,
        };
        return { ...p, medications: [...p.medications, newMed] };
      })
    );
  }, []);

  // ── Remove medication ─────────────────────────────────────────────────────
  const removeMedication = useCallback((patientId, pmId) => {
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id !== patientId) return p;
        return { ...p, medications: p.medications.filter((pm) => pm.id !== pmId) };
      })
    );
  }, []);

  // ── Mark notification read ────────────────────────────────────────────────
  const markNotificationRead = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  // ── Dismiss patient alert ────────────────────────────────────────────────
  const dismissAlert = useCallback((patientId, alertId) => {
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id !== patientId) return p;
        return { ...p, alerts: p.alerts.filter((a) => a.id !== alertId) };
      })
    );
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <AppContext.Provider value={{
      currentUser, login, logout,
      patients, getPatient, getMyPatient, getDoctorPatients,
      logEntries, logDose, getTodaySchedule,
      addMedication, removeMedication,
      notifications, unreadCount, markNotificationRead, markAllNotificationsRead,
      dismissAlert,
      MEDICATION_CATALOG,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
