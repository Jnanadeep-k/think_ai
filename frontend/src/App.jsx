import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import LandingPage from './pages/public/Landingpage';
import ProtectedRoute from './routes/ProtectedRoute';

// Import your new separated routes
import AdminRoutes from './routes/AdminRoutes';

function RolePlaceholder({ label }) {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-[#0B0F19] text-white">
      <p className="text-lg">{label} dashboard — coming soon.</p>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      {/* PUBLIC ROUTES */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/home" element={<Navigate to="/" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/org-login" element={<RolePlaceholder label="Organization login" />} />

      {/* ADMIN ROUTES */}
      {/* The /* is critical here. It tells React Router to pass routing down to AdminRoutes */}
      <Route 
        path="/admin/*" 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminRoutes />
          </ProtectedRoute>
        } 
      />

      {/* LEARNER ROUTES */}
      <Route 
        path="/learner/*" 
        element={
          <ProtectedRoute allowedRoles={['learner']}>
            <RolePlaceholder label="Learner" />
          </ProtectedRoute>
        } 
      />

      {/* INSTRUCTOR ROUTES */}
      <Route 
        path="/instructor/*" 
        element={
          <ProtectedRoute allowedRoles={['instructor']}>
            <RolePlaceholder label="Instructor" />
          </ProtectedRoute>
        } 
      />

      {/* TA ROUTES */}
      <Route 
        path="/ta/*" 
        element={
          <ProtectedRoute allowedRoles={['ta']}>
            <RolePlaceholder label="TA" />
          </ProtectedRoute>
        } 
      />

      {/* CATCH-ALL ROUTE */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
