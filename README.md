# MediTrack — Full Web Application

A complete medication adherence platform with **Patient** and **Doctor** portals.

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Open **http://localhost:5173**

---

## 🔐 Demo Accounts

| Role    | Email                              | Password    | Notes                     |
|---------|------------------------------------|-------------|---------------------------|
| Doctor  | elena.ramos@meditrack.health       | doctor123   | Full patient panel access |
| Patient | maria.santos@email.com             | patient123  | 93% adherence — Good      |
| Patient | robert.cruz@email.com              | patient123  | 61% — Moderate/At Risk    |
| Patient | jose.dc@email.com                  | patient123  | 45% — Critical            |
| Patient | ana.reyes@email.com                | patient123  | 97% — Excellent           |

---

## 🏥 Features

### Doctor Portal
- **Dashboard** — Panel overview, adherence trend chart, active alerts
- **Patient Panel** — Search/filter patients by adherence level, patient cards with progress rings
- **Patient Detail** — 14-day bar chart, medication management (add/remove), alert dismissal
- **Analytics** — 30-day multi-patient trend, distribution pie chart, condition radar, comparison bar
- **Alerts** — Read/dismiss notifications, link directly to patient profiles

### Patient Portal
- **Today** — Daily schedule with one-tap dose logging, progress ring, streak tracker
- **Medications** — View all active prescriptions with schedules
- **My History** — Adherence trend charts, calendar heatmap, 7/14/30-day views
- **Log Dose** — Quick log interface with Take/Skip actions
- **Settings** — Notification toggles, security, preferences

---

## 📁 Project Structure

```
src/
├── App.jsx                    # Root router + protected routes
├── main.jsx
├── index.css                  # Global styles + Tailwind directives
├── context/
│   └── AppContext.jsx          # Global state (auth, patients, logs)
├── data/
│   └── store.js               # Mock data + utility functions
├── components/
│   ├── layout/
│   │   └── AppShell.jsx        # Sidebar + mobile nav
│   └── shared/
│       └── UI.jsx              # Avatar, ProgressRing, Modal, Toast…
└── pages/
    ├── LoginPage.jsx
    ├── SettingsPage.jsx
    ├── doctor/
    │   ├── DoctorDashboard.jsx
    │   ├── DoctorPatients.jsx
    │   ├── PatientDetail.jsx
    │   ├── DoctorAnalytics.jsx
    │   └── DoctorAlerts.jsx
    └── patient/
        ├── PatientToday.jsx
        ├── PatientMedications.jsx
        ├── PatientHistory.jsx
        └── PatientLogDose.jsx
```

---

## 🛠 Tech Stack

- **React 18** + **Vite** — Fast development
- **React Router v6** — Client-side routing with protected routes
- **Tailwind CSS** — Utility-first styling
- **Recharts** — Area, Bar, Line, Pie, Radar charts
- **Lucide React** — Icons
- **date-fns** — Date utilities
- **Context API** — Lightweight global state (no Redux needed)

---

## 🔧 Production Build

```bash
npm run build    # outputs to /dist
npm run preview  # preview the build locally
```
