import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  FileCheck,
  Award,
  CreditCard,
  User,
  Settings,
  Compass,
  Layers,
  Users,
  DollarSign,
  Star,
  ShieldAlert,
  GraduationCap,
  Sparkles,
  LogOut,
  FolderTree,
  AlertTriangle,
  CheckCircle,
  FileText
} from 'lucide-react';
import Badge from '../common/Badge';

export const Sidebar = ({ role = 'student' }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Student links
  const studentLinks = [
    { label: 'Overview', to: '/student/overview', icon: LayoutDashboard },
    { label: 'My Learning', to: '/student/courses', icon: BookOpen },
    { label: 'My Classes', to: '/student/classes', icon: Calendar },
    { label: 'Explore Classes', to: '/courses', icon: Compass },
    { label: 'Assignments', to: '/student/assignments', icon: FileCheck },
    { label: 'Certificates', to: '/student/certificates', icon: Award },
    { label: 'Payments', to: '/student/payments', icon: CreditCard },
    { label: 'Profile', to: '/student/profile', icon: User },
    { label: 'Settings', to: '/student/settings', icon: Settings },
  ];

  // Instructor links
  const instructorLinks = [
    { label: 'Overview', to: '/instructor/overview', icon: LayoutDashboard },
    { 
      label: 'Verification', 
      to: '/instructor/verification', 
      icon: ShieldAlert,
      badge: user?.verificationStatus || 'Pending'
    },
    { label: 'My Courses', to: '/instructor/courses', icon: BookOpen },
    { label: 'My Batches', to: '/instructor/batches', icon: Layers },
    { label: 'Live Classes', to: '/instructor/classes', icon: Calendar },
    { label: 'Students', to: '/instructor/students', icon: Users },
    { label: 'Assignments', to: '/instructor/assignments', icon: FileCheck },
    { label: 'Earnings', to: '/instructor/earnings', icon: DollarSign },
    { label: 'Reviews', to: '/instructor/reviews', icon: Star },
    { label: 'Profile', to: '/instructor/profile', icon: User },
    { label: 'Settings', to: '/instructor/settings', icon: Settings },
  ];

  // Admin links
  const adminLinks = [
    { label: 'Overview', to: '/admin/overview', icon: LayoutDashboard },
    { label: 'Instructors Review', to: '/admin/instructors', icon: ShieldAlert, badge: 'Review' },
    { label: 'Courses Review', to: '/admin/courses', icon: BookOpen },
    { label: 'Users Directory', to: '/admin/users', icon: Users },
    { label: 'Batches', to: '/admin/batches', icon: Layers },
    { label: 'Enrollments', to: '/admin/enrollments', icon: GraduationCap },
    { label: 'Categories', to: '/admin/categories', icon: FolderTree },
    { label: 'Payments', to: '/admin/payments', icon: CreditCard },
    { label: 'Payouts', to: '/admin/payouts', icon: DollarSign },
    { label: 'Reviews', to: '/admin/reviews', icon: Star },
    { label: 'Reports', to: '/admin/reports', icon: FileText },
    { label: 'Settings', to: '/admin/settings', icon: Settings },
  ];

  const links =
    role === 'instructor'
      ? instructorLinks
      : role === 'admin'
      ? adminLinks
      : studentLinks;

  const roleTitle =
    role === 'instructor'
      ? 'Instructor Portal'
      : role === 'admin'
      ? 'Admin Headquarters'
      : 'Student Hub';

  return (
    <aside className="w-64 bg-white border-r border-edge flex flex-col shrink-0 min-h-[calc(100vh-4rem)]">
      {/* Brand Header inside sidebar */}
      <div className="p-5 border-b border-edge">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-brand-500 text-white flex items-center justify-center shadow-subtle">
            <GraduationCap className="w-5 h-5 text-accent" />
          </div>
          <div>
            <span className="text-base font-bold text-brand-900 block leading-tight">Classify</span>
            <span className="text-[11px] font-semibold text-brand-600 block">{roleTitle}</span>
          </div>
        </Link>
      </div>

      {/* Instructor Verification Alert Banner (if pending or not submitted) */}
      {role === 'instructor' && user?.verificationStatus !== 'Approved' && (
        <div className="mx-3 mt-3 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900">
          <div className="flex items-center gap-1.5 text-xs font-semibold mb-1">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Verification: {user?.verificationStatus || 'Action Needed'}</span>
          </div>
          <p className="text-[11px] text-amber-800 leading-tight mb-2">
            Complete identity and skill verification to publish live cohorts.
          </p>
          <Link
            to="/instructor/verification"
            className="block text-center py-1 px-2 text-[11px] font-semibold bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition"
          >
            Review Status
          </Link>
        </div>
      )}

      {/* Navigation Links */}
      <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-brand-50 text-brand-900 font-semibold shadow-subtle'
                    : 'text-content-body hover:bg-surface-subtle hover:text-brand-900'
                }`
              }
            >
              <div className="flex items-center gap-2.5 truncate">
                <Icon className="w-4 h-4 text-brand-600 shrink-0" />
                <span className="truncate">{link.label}</span>
              </div>
              {link.badge && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-md font-semibold bg-amber-100 text-amber-800 shrink-0">
                  {link.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* User profile bottom footer */}
      {user && (
        <div className="p-3 border-t border-edge bg-surface-subtle/50">
          <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-white border border-edge">
            <div className="flex items-center gap-2 min-w-0">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-lg object-cover ring-1 ring-edge shrink-0"
              />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-brand-900 truncate">{user.name}</p>
                <p className="text-[10px] text-content-muted capitalize truncate">{user.role}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
