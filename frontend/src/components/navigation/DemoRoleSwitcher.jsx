import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import { Shield, GraduationCap, Sparkles, User, ChevronUp, ChevronDown, Check, RefreshCw } from 'lucide-react';

export const DemoRoleSwitcher = () => {
  const { user, role, switchDemoRole } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const roles = [
    {
      id: 'student',
      label: 'Student',
      sub: 'Priya Sharma (Enrolled in 2 Cohorts)',
      icon: GraduationCap,
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      dashboardPath: '/student/overview'
    },
    {
      id: 'instructor',
      label: 'Instructor (Approved)',
      sub: 'Dr. Ananya Roy (Can publish & teach)',
      icon: Sparkles,
      color: 'text-brand-700 bg-brand-50 border-brand-200',
      dashboardPath: '/instructor/overview'
    },
    {
      id: 'instructor-pending',
      label: 'Instructor (Pending Verification)',
      sub: 'Sunita Deshmukh (Test Admin approval)',
      icon: Sparkles,
      color: 'text-amber-700 bg-amber-50 border-amber-200',
      dashboardPath: '/instructor/verification'
    },
    {
      id: 'admin',
      label: 'Admin Platform Head',
      sub: 'Arjun Mehta (Approve instructors & courses)',
      icon: Shield,
      color: 'text-purple-700 bg-purple-50 border-purple-200',
      dashboardPath: '/admin/overview'
    },
    {
      id: 'guest',
      label: 'Guest / Public Visitor',
      sub: 'Explore platform logged out',
      icon: User,
      color: 'text-gray-700 bg-gray-50 border-gray-200',
      dashboardPath: '/'
    }
  ];

  const handleRoleSelect = (roleItem) => {
    switchDemoRole(roleItem.id);
    addToast(`Switched demo perspective to: ${roleItem.label}`, 'info');
    setIsOpen(false);
    navigate(roleItem.dashboardPath);
  };

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <div className="relative">
        {/* Dropup Menu */}
        {isOpen && (
          <div className="absolute bottom-12 left-0 mb-2 w-80 bg-white rounded-2xl shadow-elevated border border-edge p-2.5 animate-in slide-in-from-bottom-2 duration-150">
            <div className="px-3 py-2 border-b border-edge mb-2">
              <p className="text-xs font-bold uppercase tracking-wider text-brand-900">
                Demo Role Switcher
              </p>
              <p className="text-[11px] text-content-muted">
                Switch user persona instantly to test dashboards, permissions & workflows.
              </p>
            </div>

            <div className="space-y-1">
              {roles.map((item) => {
                const Icon = item.icon;
                const isCurrent =
                  (item.id === 'guest' && !user) ||
                  (item.id === 'student' && user?.id === 'user-student-1') ||
                  (item.id === 'instructor' && user?.id === 'user-instructor-1') ||
                  (item.id === 'instructor-pending' && user?.id === 'user-instructor-2') ||
                  (item.id === 'admin' && user?.role === 'admin');

                return (
                  <button
                    key={item.id}
                    onClick={() => handleRoleSelect(item)}
                    className={`w-full flex items-start gap-2.5 p-2.5 rounded-xl text-left transition-all ${
                      isCurrent
                        ? 'bg-brand-50/80 border border-brand-200'
                        : 'hover:bg-surface-subtle border border-transparent'
                    }`}
                  >
                    <div className={`p-1.5 rounded-lg border ${item.color} shrink-0 mt-0.5`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-brand-900 truncate">
                          {item.label}
                        </span>
                        {isCurrent && <Check className="w-3.5 h-3.5 text-brand-600" />}
                      </div>
                      <span className="block text-[11px] text-content-muted truncate mt-0.5">
                        {item.sub}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Floating trigger button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-brand-900 text-white shadow-elevated hover:bg-brand-950 transition-all text-xs font-semibold border border-brand-700/50"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-accent ${isOpen ? 'rotate-180 transition-transform' : ''}`} />
          <span>Role: <strong className="text-accent capitalize">{user ? `${user.role} (${user.name.split(' ')[0]})` : 'Guest'}</strong></span>
          {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
};

export default DemoRoleSwitcher;
