import React from "react";
import { Routes, Route } from "react-router-dom";

import LearnerLayout from "../layouts/LearnerLayout";
import LearnerDashboard from "../pages/learner/LearnerDashboard";
import CoursePlayer from "../pages/learner/CoursePlayer";
import LearnerCoursesPage from "../pages/learner/LearnerCoursesPage";
import CodePlayground from "../pages/learner/CodePlayground/Codeplayground";
import AssessmentSubmissionPage from "../pages/learner/assessment/AssessmentSubmissionPage";
import LiveClassJoinPage from "../pages/learner/live-class/LiveClassJoinPage";
import LiveClassesListPage from "../pages/learner/live-class/LiveClassesListPage";
import AssignmentsPage from "../pages/learner/assessment/AssignmentsPage";

function LearnerRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LearnerLayout />}>
        <Route index element={<LearnerDashboard />} />
        <Route path="courses/:courseId" element={<CoursePlayer />} />
        <Route path="courses" element={<LearnerCoursesPage />} />
        <Route path="playground" element={<CodePlayground />} />
        <Route path="assessments/:assessmentId" element={<AssessmentSubmissionPage />} />
        <Route path="assignments" element={<AssignmentsPage />} />
        <Route path="live" element={<LiveClassesListPage />} />
        <Route path="live/:classId" element={<LiveClassJoinPage />} />
      </Route>
    </Routes>
  );
}

export default LearnerRoutes;