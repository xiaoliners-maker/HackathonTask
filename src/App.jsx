// src/App.jsx — Root router with protected routes
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import AppShell from './components/layout/AppShell';

// Pages
import LoginPage from './pages/LoginPage';
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import DoctorPatients from './pages/doctor/DoctorPatients';
import PatientDetail from './pages/doctor/PatientDetail';
import DoctorAnalytics from './pages/doctor/DoctorAnalytics';
import DoctorAlerts from './pages/doctor/DoctorAlerts';
import PatientToday from './pages/patient/PatientToday';
import PatientMedications from './pages/patient/PatientMedications';
import PatientHistory from './pages/patient/PatientHistory';
import PatientLogDose from './pages/patient/PatientLogDose';
import SettingsPage from './pages/SettingsPage';

// Protected route wrapper
function ProtectedRoute({ children, role }) {
  const { currentUser } = useApp();
  if (!currentUser) return <Navigate to="/login" replace />;
  if (role && currentUser.role !== role) {
    return <Navigate to={currentUser.role === 'doctor' ? '/doctor' : '/patient'} replace />;
  }
  return <AppShell>{children}</AppShell>;
}

function RootRedirect() {
  const { currentUser } = useApp();
  if (!currentUser) return <Navigate to="/login" replace />;
  return <Navigate to={currentUser.role === 'doctor' ? '/doctor' : '/patient'} replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Doctor routes */}
      <Route path="/doctor" element={<ProtectedRoute role="doctor"><DoctorDashboard /></ProtectedRoute>} />
      <Route path="/doctor/patients" element={<ProtectedRoute role="doctor"><DoctorPatients /></ProtectedRoute>} />
      <Route path="/doctor/patients/:id" element={<ProtectedRoute role="doctor"><PatientDetail /></ProtectedRoute>} />
      <Route path="/doctor/analytics" element={<ProtectedRoute role="doctor"><DoctorAnalytics /></ProtectedRoute>} />
      <Route path="/doctor/alerts" element={<ProtectedRoute role="doctor"><DoctorAlerts /></ProtectedRoute>} />
      <Route path="/doctor/settings" element={<ProtectedRoute role="doctor"><SettingsPage /></ProtectedRoute>} />

      {/* Patient routes */}
      <Route path="/patient" element={<ProtectedRoute role="patient"><PatientToday /></ProtectedRoute>} />
      <Route path="/patient/medications" element={<ProtectedRoute role="patient"><PatientMedications /></ProtectedRoute>} />
      <Route path="/patient/history" element={<ProtectedRoute role="patient"><PatientHistory /></ProtectedRoute>} />
      <Route path="/patient/log" element={<ProtectedRoute role="patient"><PatientLogDose /></ProtectedRoute>} />
      <Route path="/patient/settings" element={<ProtectedRoute role="patient"><SettingsPage /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  );
}
