import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import PublicLayout from '../layouts/PublicLayout';
import StudentLayout from '../layouts/StudentLayout';
import InstructorLayout from '../layouts/InstructorLayout';
import AdminLayout from '../layouts/AdminLayout';

// Guard wrappers
import ProtectedRoute from './ProtectedRoute';
import RoleRoute from './RoleRoute';

// Public Pages
import HomePage from '../pages/public/HomePage';
import CourseDiscoveryPage from '../pages/public/CourseDiscoveryPage';
import CourseDetailsPage from '../pages/public/CourseDetailsPage';
import InstructorProfilePage from '../pages/public/InstructorProfilePage';

// Auth Pages
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage';
import VerifyEmailPage from '../pages/auth/VerifyEmailPage';

// Classroom
import LiveClassroom from '../components/classroom/LiveClassroom';

// Student Pages
import StudentOverviewPage from '../pages/student/StudentOverviewPage';
import StudentCoursesPage from '../pages/student/StudentCoursesPage';
import StudentClassesPage from '../pages/student/StudentClassesPage';
import StudentAssignmentsPage from '../pages/student/StudentAssignmentsPage';
import StudentCertificatesPage from '../pages/student/StudentCertificatesPage';
import StudentPaymentsPage from '../pages/student/StudentPaymentsPage';
import StudentProfilePage from '../pages/student/StudentProfilePage';
import StudentSettingsPage from '../pages/student/StudentSettingsPage';

// Instructor Dashboard Pages
import InstructorOverviewPage from '../pages/instructor/InstructorOverviewPage';
import InstructorVerificationPage from '../pages/instructor/InstructorVerificationPage';
import InstructorCoursesPage from '../pages/instructor/InstructorCoursesPage';
import InstructorBatchesPage from '../pages/instructor/InstructorBatchesPage';
import InstructorClassesPage from '../pages/instructor/InstructorClassesPage';
import InstructorStudentsPage from '../pages/instructor/InstructorStudentsPage';
import InstructorAssignmentsPage from '../pages/instructor/InstructorAssignmentsPage';
import InstructorEarningsPage from '../pages/instructor/InstructorEarningsPage';
import InstructorReviewsPage from '../pages/instructor/InstructorReviewsPage';
import InstructorDashboardProfilePage from '../pages/instructor/InstructorProfilePage';
import InstructorSettingsPage from '../pages/instructor/InstructorSettingsPage';

// Admin Pages
import AdminOverviewPage from '../pages/admin/AdminOverviewPage';
import AdminInstructorsPage from '../pages/admin/AdminInstructorsPage';
import AdminCoursesPage from '../pages/admin/AdminCoursesPage';
import AdminBatchesPage from '../pages/admin/AdminBatchesPage';
import AdminEnrollmentsPage from '../pages/admin/AdminEnrollmentsPage';
import AdminUsersPage from '../pages/admin/AdminUsersPage';
import AdminCategoriesPage from '../pages/admin/AdminCategoriesPage';
import AdminPaymentsPage from '../pages/admin/AdminPaymentsPage';
import AdminPayoutsPage from '../pages/admin/AdminPayoutsPage';
import AdminReviewsPage from '../pages/admin/AdminReviewsPage';
import AdminReportsPage from '../pages/admin/AdminReportsPage';
import AdminSettingsPage from '../pages/admin/AdminSettingsPage';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/courses" element={<CourseDiscoveryPage />} />
        <Route path="/courses/:id" element={<CourseDetailsPage />} />
        <Route path="/instructors/:id" element={<InstructorProfilePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
      </Route>

      {/* Live Classroom Experience (Fullscreen immersion) */}
      <Route
        path="/classroom/:batchId"
        element={
          <ProtectedRoute>
            <LiveClassroom />
          </ProtectedRoute>
        }
      />

      {/* Student Dashboard */}
      <Route
        path="/student"
        element={
          <RoleRoute allowedRoles={['student', 'admin']}>
            <StudentLayout />
          </RoleRoute>
        }
      >
        <Route index element={<Navigate to="/student/overview" replace />} />
        <Route path="overview" element={<StudentOverviewPage />} />
        <Route path="courses" element={<StudentCoursesPage />} />
        <Route path="classes" element={<StudentClassesPage />} />
        <Route path="assignments" element={<StudentAssignmentsPage />} />
        <Route path="certificates" element={<StudentCertificatesPage />} />
        <Route path="payments" element={<StudentPaymentsPage />} />
        <Route path="profile" element={<StudentProfilePage />} />
        <Route path="settings" element={<StudentSettingsPage />} />
      </Route>

      {/* Instructor Dashboard */}
      <Route
        path="/instructor"
        element={
          <RoleRoute allowedRoles={['instructor', 'admin']}>
            <InstructorLayout />
          </RoleRoute>
        }
      >
        <Route index element={<Navigate to="/instructor/overview" replace />} />
        <Route path="overview" element={<InstructorOverviewPage />} />
        <Route path="verification" element={<InstructorVerificationPage />} />
        <Route path="courses" element={<InstructorCoursesPage />} />
        <Route path="batches" element={<InstructorBatchesPage />} />
        <Route path="classes" element={<InstructorClassesPage />} />
        <Route path="students" element={<InstructorStudentsPage />} />
        <Route path="assignments" element={<InstructorAssignmentsPage />} />
        <Route path="earnings" element={<InstructorEarningsPage />} />
        <Route path="reviews" element={<InstructorReviewsPage />} />
        <Route path="profile" element={<InstructorDashboardProfilePage />} />
        <Route path="settings" element={<InstructorSettingsPage />} />
      </Route>

      {/* Admin Dashboard */}
      <Route
        path="/admin"
        element={
          <RoleRoute allowedRoles={['admin']}>
            <AdminLayout />
          </RoleRoute>
        }
      >
        <Route index element={<Navigate to="/admin/overview" replace />} />
        <Route path="overview" element={<AdminOverviewPage />} />
        <Route path="instructors" element={<AdminInstructorsPage />} />
        <Route path="courses" element={<AdminCoursesPage />} />
        <Route path="batches" element={<AdminBatchesPage />} />
        <Route path="enrollments" element={<AdminEnrollmentsPage />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="categories" element={<AdminCategoriesPage />} />
        <Route path="payments" element={<AdminPaymentsPage />} />
        <Route path="payouts" element={<AdminPayoutsPage />} />
        <Route path="reviews" element={<AdminReviewsPage />} />
        <Route path="reports" element={<AdminReportsPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
      </Route>

      {/* Catch-all redirect to Home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
