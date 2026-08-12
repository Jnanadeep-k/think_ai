import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import LandingPage from "./pages/public/Landingpage";

import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoutes from "./routes/AdminRoutes";

import { fetchCurrentUser } from "./features/auth/authSlice";
import RolePlaceholder from "./components/common/RolePlaceholder";
import CoursePlayer from "./pages/learner/CoursePlayer";
import LearnerLayout from "./layouts/LearnerLayout";
import LearnerDashboard  from "./pages/learner/LearnerDashboard"

function App() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    if (token && !isAuthenticated) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, token, isAuthenticated]);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/home" element={<Navigate to="/" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route
        path="/org-login"
        element={<RolePlaceholder label="Organization Login" />}
      />

      {/* Admin */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <AdminRoutes />
          </ProtectedRoute>
        }
      />

      {/* Learner */}
      <Route
        path="/learner"
        element={
          <ProtectedRoute allowedRoles={["Learner"]}>
            <LearnerLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<LearnerDashboard />} />
        <Route path="courses/:courseId" element={<CoursePlayer />} />
      </Route>

      {/* Instructor */}
      <Route
        path="/instructor/*"
        element={
          <ProtectedRoute allowedRoles={["Instructor"]}>
            <RolePlaceholder label="Instructor" />
          </ProtectedRoute>
        }
      />

      {/* TA */}
      <Route
        path="/ta/*"
        element={
          <ProtectedRoute allowedRoles={["TA"]}>
            <RolePlaceholder label="TA" />
          </ProtectedRoute>
        }
      />

      {/* 404 */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;