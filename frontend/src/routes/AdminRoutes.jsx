import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import AdminLayout from "../layouts/AdminLayout";
import AdminDashboardHome from "../pages/admin/AdminDashboardHome";
import AdminUsersPage from "../pages/admin/AdminUsersPage";
import CoursesPage from "../pages/courses/CoursesPage";
import CourseDetails from "../pages/courses/CourseDetails";
import AdminProfilePage from "../pages/admin/AdminProfilePage";
import AdminEditProfilePage from "../pages/admin/AdminEditProfilePage";

import BatchList from "../pages/batches/BatchList";
import AddBatch from "../pages/batches/AddBatch";
import EditBatch from "../pages/batches/EditBatch";
import BatchDetails from "../pages/batches/BatchDetails";

import AddEnrollment from "../pages/enrollments/AddEnrollment";
import EnrollmentDetails from "../pages/enrollments/EnrollmentDetails";
import EnrollmentList from "../pages/enrollments/EnrollmentList";
import EditEnrollment from "../pages/enrollments/EditEnrollment";



function AdminRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboardHome />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="profile" element={<AdminProfilePage />} />
        <Route path="profile/edit" element={<AdminEditProfilePage />} />

        <Route path="courses" element={<CoursesPage />} />
        <Route path="courses/:id" element={<CourseDetails />} />
        

        <Route path="batches" element={<BatchList />} />
        <Route path="batches/add" element={<AddBatch />} />
        <Route path="batches/edit/:id" element={<EditBatch />} />
        <Route path="batches/:id" element={<BatchDetails />} />

        <Route path="enrollments" element={<EnrollmentList />} />
        <Route path="enrollments/add" element={<AddEnrollment />} />
        <Route path="enrollments/edit/:id" element={<EditEnrollment />} />
        <Route path="enrollments/:id" element={<EnrollmentDetails />} />

      </Route>
    </Routes>
  );
}

export default AdminRoutes;