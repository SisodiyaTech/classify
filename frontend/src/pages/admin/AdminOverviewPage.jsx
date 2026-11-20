import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../context/AppContext';
import { 
  Users, 
  ShieldAlert, 
  BookOpen, 
  Layers, 
  DollarSign, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { formatCurrency } from '../../utils/formatters';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

export const AdminOverviewPage = () => {
  const { courses, batches, enrollments, payments, users, updateInstructorVerification, updateCourseStatus } = useStore();

  const instructors = users.filter((u) => u.role === 'instructor');
  const pendingInstructors = instructors.filter((u) => u.verificationStatus === 'Pending Review');
  const pendingCourses = courses.filter((c) => c.status === 'Pending Review');

  const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0) + 740000;
  const platformCommission = totalRevenue * 0.15;

  const monthlyEnrollmentChart = [
    { month: 'Jun', enrollments: 45, revenue: 157000 },
    { month: 'Jul', enrollments: 72, revenue: 251000 },
    { month: 'Aug', enrollments: 98, revenue: 342000 },
    { month: 'Sep', enrollments: 124, revenue: 433000 },
    { month: 'Oct', enrollments: 160, revenue: 559000 },
    { month: 'Nov', enrollments: 215, revenue: 752000 },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Badge variant="brand" size="sm" className="mb-2">
          Administrator Command Center
        </Badge>
        <h1 className="text-2xl font-bold text-brand-900">
          Platform Overview & Operations
        </h1>
        <p className="text-xs text-content-muted mt-1">
          Monitor marketplace health, verify instructor applications, and manage batch standards.
        </p>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-edge shadow-subtle">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center mb-3">
            <Users className="w-5 h-5" />
          </div>
          <p className="text-2xl font-bold text-brand-900">{users.length + 180}</p>
          <p className="text-xs text-content-muted mt-0.5">Total Users</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-edge shadow-subtle">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-3">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <p className="text-2xl font-bold text-brand-900">{pendingInstructors.length}</p>
          <p className="text-xs text-content-muted mt-0.5">Pending Instructor Reviews</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-edge shadow-subtle">
          <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mb-3">
            <Layers className="w-5 h-5" />
          </div>
          <p className="text-2xl font-bold text-brand-900">{batches.length}</p>
          <p className="text-xs text-content-muted mt-0.5">Active Cohorts (Batches)</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-edge shadow-subtle">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
            <DollarSign className="w-5 h-5" />
          </div>
          <p className="text-2xl font-bold text-emerald-800">{formatCurrency(platformCommission)}</p>
          <p className="text-xs text-content-muted mt-0.5">Net Platform Revenue (15%)</p>
        </div>
      </div>

      {/* Action Queues */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Instructors Queue */}
        <div className="bg-white p-6 rounded-2xl border border-edge shadow-subtle space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-brand-900">
                Instructor Applications
              </h3>
              {pendingInstructors.length > 0 && (
                <Badge variant="warning" size="sm">
                  {pendingInstructors.length} Action Needed
                </Badge>
              )}
            </div>
            <Link to="/admin/instructors" className="text-xs font-semibold text-brand-600 hover:text-brand-900">
              View All →
            </Link>
          </div>

          {pendingInstructors.length > 0 ? (
            <div className="space-y-3">
              {pendingInstructors.map((inst) => (
                <div
                  key={inst.id}
                  className="p-3.5 rounded-xl bg-surface-subtle border border-edge flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={inst.avatar}
                      alt={inst.name}
                      className="w-9 h-9 rounded-xl object-cover ring-1 ring-edge shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-semibold text-brand-900 truncate">{inst.name}</p>
                      <p className="text-[11px] text-content-muted truncate">{inst.headline}</p>
                    </div>
                  </div>

                  <Link to="/admin/instructors">
                    <Button variant="primary" size="sm">
                      Review Docs
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-content-muted py-4 text-center">
              All instructor verification applications are up to date.
            </p>
          )}
        </div>

        {/* Pending Courses Queue */}
        <div className="bg-white p-6 rounded-2xl border border-edge shadow-subtle space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-brand-900">
                Course Moderation
              </h3>
              {pendingCourses.length > 0 && (
                <Badge variant="accent" size="sm">
                  {pendingCourses.length} Pending
                </Badge>
              )}
            </div>
            <Link to="/admin/courses" className="text-xs font-semibold text-brand-600 hover:text-brand-900">
              View All →
            </Link>
          </div>

          {pendingCourses.length > 0 ? (
            <div className="space-y-3">
              {pendingCourses.map((c) => (
                <div
                  key={c.id}
                  className="p-3.5 rounded-xl bg-surface-subtle border border-edge flex items-center justify-between gap-3 text-xs"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-brand-900 truncate">{c.title}</p>
                    <p className="text-[11px] text-content-muted">By {c.instructorName} • {c.category}</p>
                  </div>

                  <Link to="/admin/courses">
                    <Button variant="outline" size="sm">
                      Inspect
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-content-muted py-4 text-center">
              No courses awaiting administrator moderation.
            </p>
          )}
        </div>
      </div>

      {/* Platform Monthly Growth Chart */}
      <div className="bg-white p-6 rounded-2xl border border-edge shadow-subtle space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-brand-900">Platform Enrollment Trajectory</h3>
            <p className="text-xs text-content-muted">Monthly student cohort registrations across all categories</p>
          </div>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
            +34% Cohort Growth
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyEnrollmentChart} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F2F4F7" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#667085' }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#667085' }} />
              <Tooltip 
                formatter={(val) => [`${val} students`, 'Monthly Cohort Enrollments']}
                contentStyle={{ backgroundColor: '#102A2A', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
              />
              <Bar dataKey="enrollments" fill="#176B5B" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminOverviewPage;
