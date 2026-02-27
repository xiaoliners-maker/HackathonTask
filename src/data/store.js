// src/data/store.js  — centralized mock data + initial state

import { addDays, subDays, format, startOfWeek, isToday, isBefore, parseISO } from 'date-fns';

const today = new Date();
const fmt = (d) => format(d, 'yyyy-MM-dd');

// ── Medications master list ─────────────────────────────────────────────────
export const MEDICATION_CATALOG = [
  { id: 'med_1', name: 'Metformin',      dosage: '500mg',  category: 'Diabetes',        color: '#14b8a6' },
  { id: 'med_2', name: 'Lisinopril',     dosage: '10mg',   category: 'Hypertension',    color: '#3b82f6' },
  { id: 'med_3', name: 'Atorvastatin',   dosage: '20mg',   category: 'Cholesterol',     color: '#8b5cf6' },
  { id: 'med_4', name: 'Amlodipine',     dosage: '5mg',    category: 'Hypertension',    color: '#f59e0b' },
  { id: 'med_5', name: 'Omeprazole',     dosage: '20mg',   category: 'Gastric',         color: '#ec4899' },
  { id: 'med_6', name: 'Levothyroxine',  dosage: '50mcg',  category: 'Thyroid',         color: '#10b981' },
  { id: 'med_7', name: 'Aspirin',        dosage: '81mg',   category: 'Cardiovascular',  color: '#ef4444' },
  { id: 'med_8', name: 'Glipizide',      dosage: '5mg',    category: 'Diabetes',        color: '#06b6d4' },
];

// ── Patients ────────────────────────────────────────────────────────────────
export const INITIAL_PATIENTS = [
  {
    id: 'pat_1', name: 'Maria Santos',    age: 58, gender: 'F', avatar: 'MS',
    condition: 'Type 2 Diabetes, Hypertension',
    phone: '+63 917 234 5678', email: 'maria.santos@email.com',
    doctorId: 'doc_1',
    medications: [
      { id: 'pm_1', medId: 'med_1', times: ['08:00', '20:00'], startDate: fmt(subDays(today, 60)), active: true },
      { id: 'pm_2', medId: 'med_2', times: ['08:00'],           startDate: fmt(subDays(today, 45)), active: true },
    ],
    adherenceHistory: generateAdherenceHistory(0.93),
    streak: 23,
    lastSeen: fmt(subDays(today, 7)),
    alerts: [],
  },
  {
    id: 'pat_2', name: 'Robert Cruz',    age: 65, gender: 'M', avatar: 'RC',
    condition: 'Hypertension, High Cholesterol',
    phone: '+63 918 345 6789', email: 'robert.cruz@email.com',
    doctorId: 'doc_1',
    medications: [
      { id: 'pm_3', medId: 'med_2', times: ['07:00'],           startDate: fmt(subDays(today, 90)), active: true },
      { id: 'pm_4', medId: 'med_3', times: ['21:00'],           startDate: fmt(subDays(today, 90)), active: true },
      { id: 'pm_5', medId: 'med_4', times: ['07:00'],           startDate: fmt(subDays(today, 30)), active: true },
    ],
    adherenceHistory: generateAdherenceHistory(0.61),
    streak: 3,
    lastSeen: fmt(subDays(today, 14)),
    alerts: [{ id: 'al_1', type: 'missed', message: 'Missed 3 doses of Lisinopril this week', date: fmt(today), read: false }],
  },
  {
    id: 'pat_3', name: 'Ana Reyes',     age: 42, gender: 'F', avatar: 'AR',
    condition: 'Hypothyroidism',
    phone: '+63 919 456 7890', email: 'ana.reyes@email.com',
    doctorId: 'doc_1',
    medications: [
      { id: 'pm_6', medId: 'med_6', times: ['07:00'], startDate: fmt(subDays(today, 120)), active: true },
    ],
    adherenceHistory: generateAdherenceHistory(0.97),
    streak: 41,
    lastSeen: fmt(subDays(today, 3)),
    alerts: [],
  },
  {
    id: 'pat_4', name: 'Jose Dela Cruz', age: 71, gender: 'M', avatar: 'JD',
    condition: 'Type 2 Diabetes, Cardiovascular Disease',
    phone: '+63 920 567 8901', email: 'jose.dc@email.com',
    doctorId: 'doc_1',
    medications: [
      { id: 'pm_7', medId: 'med_1', times: ['08:00', '20:00'], startDate: fmt(subDays(today, 180)), active: true },
      { id: 'pm_8', medId: 'med_7', times: ['08:00'],           startDate: fmt(subDays(today, 180)), active: true },
      { id: 'pm_9', medId: 'med_8', times: ['12:00'],           startDate: fmt(subDays(today, 60)),  active: true },
    ],
    adherenceHistory: generateAdherenceHistory(0.45),
    streak: 0,
    lastSeen: fmt(subDays(today, 21)),
    alerts: [
      { id: 'al_2', type: 'critical', message: 'Adherence dropped below 50% — immediate attention required', date: fmt(today), read: false },
      { id: 'al_3', type: 'missed',   message: 'No doses logged for 2 consecutive days', date: fmt(subDays(today, 1)), read: false },
    ],
  },
  {
    id: 'pat_5', name: 'Linda Mercado', age: 53, gender: 'F', avatar: 'LM',
    condition: 'Gastric Reflux, Hypertension',
    phone: '+63 921 678 9012', email: 'linda.m@email.com',
    doctorId: 'doc_1',
    medications: [
      { id: 'pm_10', medId: 'med_5', times: ['07:30'],          startDate: fmt(subDays(today, 30)), active: true },
      { id: 'pm_11', medId: 'med_2', times: ['08:00'],          startDate: fmt(subDays(today, 30)), active: true },
    ],
    adherenceHistory: generateAdherenceHistory(0.80),
    streak: 8,
    lastSeen: fmt(subDays(today, 5)),
    alerts: [],
  },
];

// ── Users (auth) ─────────────────────────────────────────────────────────────
export const USERS = [
  {
    id: 'doc_1', role: 'doctor',
    name: 'Dr. Elena Ramos', specialty: 'Internal Medicine',
    email: 'elena.ramos@meditrack.health', password: 'doctor123',
    avatar: 'ER', hospital: 'St. Luke\'s Medical Center',
  },
  {
    id: 'pat_1', role: 'patient',
    name: 'Maria Santos',
    email: 'maria.santos@email.com', password: 'patient123',
    avatar: 'MS',
  },
  {
    id: 'pat_2', role: 'patient',
    name: 'Robert Cruz',
    email: 'robert.cruz@email.com', password: 'patient123',
    avatar: 'RC',
  },
  {
    id: 'pat_3', role: 'patient',
    name: 'Ana Reyes',
    email: 'ana.reyes@email.com', password: 'patient123',
    avatar: 'AR',
  },
  {
    id: 'pat_4', role: 'patient',
    name: 'Jose Dela Cruz',
    email: 'jose.dc@email.com', password: 'patient123',
    avatar: 'JD',
  },
];

// ── Notifications ─────────────────────────────────────────────────────────────
export const INITIAL_NOTIFICATIONS = [
  { id: 'n1', type: 'alert',   patientId: 'pat_2', message: 'Robert Cruz missed 3 doses this week',                 time: '2 hours ago',  read: false },
  { id: 'n2', type: 'critical', patientId: 'pat_4', message: 'Jose Dela Cruz — critical adherence drop below 50%', time: '4 hours ago',  read: false },
  { id: 'n3', type: 'info',    patientId: 'pat_3', message: 'Ana Reyes achieved a 40-day streak! 🎉',               time: '1 day ago',    read: true  },
  { id: 'n4', type: 'alert',   patientId: 'pat_4', message: 'No doses logged for Jose Dela Cruz in 48 hours',      time: '2 days ago',   read: true  },
];

// ── Helper: generate 30-day adherence history ─────────────────────────────────
function generateAdherenceHistory(baseRate) {
  const history = [];
  for (let i = 29; i >= 0; i--) {
    const date = subDays(today, i);
    const variance = (Math.random() - 0.5) * 0.2;
    const rate = Math.min(1, Math.max(0, baseRate + variance));
    history.push({
      date: fmt(date),
      rate: Math.round(rate * 100),
      taken: Math.round(rate * 3),
      total: 3,
    });
  }
  return history;
}

// ── Build today's schedule for a patient ──────────────────────────────────────
export function buildTodaySchedule(patientMeds, logEntries) {
  const schedule = [];
  patientMeds.forEach((pm) => {
    const med = MEDICATION_CATALOG.find((m) => m.id === pm.medId);
    if (!med || !pm.active) return;
    pm.times.forEach((time) => {
      const logKey = `${fmt(today)}_${pm.id}_${time}`;
      const logged = logEntries.find((l) => l.key === logKey);
      schedule.push({
        key: logKey,
        pmId: pm.id,
        medId: pm.medId,
        med,
        time,
        taken: !!logged,
        loggedAt: logged?.loggedAt || null,
        skipped: logged?.skipped || false,
      });
    });
  });
  return schedule.sort((a, b) => a.time.localeCompare(b.time));
}

// ── Adherence color ───────────────────────────────────────────────────────────
export function adherenceColor(rate) {
  if (rate >= 80) return { text: 'text-emerald-600', bg: 'bg-emerald-100', ring: '#10b981', label: 'Good' };
  if (rate >= 60) return { text: 'text-amber-600',   bg: 'bg-amber-100',   ring: '#f59e0b', label: 'Moderate' };
  return           { text: 'text-red-600',    bg: 'bg-red-100',    ring: '#ef4444', label: 'At Risk' };
}

// ── Compute 30-day adherence rate for a patient ───────────────────────────────
export function computeAdherence(patient) {
  if (!patient?.adherenceHistory?.length) return 0;
  const last30 = patient.adherenceHistory.slice(-30);
  const avg = last30.reduce((s, d) => s + d.rate, 0) / last30.length;
  return Math.round(avg);
}
