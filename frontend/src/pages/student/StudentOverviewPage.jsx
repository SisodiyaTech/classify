import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/AppContext';
import { 
  BookOpen, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Video, 
  TrendingUp, 
  ArrowRight, 
  Award,
  Users,
  AlertCircle
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

export const StudentOverviewPage = () => {
  const { user } = useAuth();
  const { enrollments, liveClasses } = useStore();

  const studentEnrollments = enrollments.filter(
    (e) => e.studentId === user?.id || !e.studentId
  );

  const upcomingClasses = liveClasses.filter((c) => c.status !== 'Completed');

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-brand-900 via-brand-800 to-brand-700 text-white shadow-elevated flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <Badge variant="accent" size="sm">
            Student Hub
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-bold">
            Welcome back, {user?.name.split(' ')[0]}! 👋
          </h1>
          <p className="text-xs sm:text-sm text-gray-200 leading-relaxed">
            You are enrolled in <strong className="text-white">{studentEnrollments.length} active small batches</strong>. Your next live coaching session begins soon.
          </p>
        </div>

        <Link to="/courses">
          <Button variant="accent" size="md" iconRight={ArrowRight}>
            Explore More Batches
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-edge shadow-subtle">
          <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mb-3">
            <BookOpen className="w-5 h-5" />
          </div>
          <p className="text-2xl font-bold text-brand-900">{studentEnrollments.length}</p>
          <p className="text-xs text-content-muted mt-0.5">Enrolled Cohorts</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-edge shadow-subtle">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
            <Calendar className="w-5 h-5" />
          </div>
          <p className="text-2xl font-bold text-brand-900">{upcomingClasses.length}</p>
          <p className="text-xs text-content-muted mt-0.5">Upcoming Live Classes</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-edge shadow-subtle">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <p className="text-2xl font-bold text-brand-900">94%</p>
          <p className="text-xs text-content-muted mt-0.5">Attendance Rate</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-edge shadow-subtle">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
            <Award className="w-5 h-5" />
          </div>
          <p className="text-2xl font-bold text-brand-900">1</p>
          <p className="text-xs text-content-muted mt-0.5">Certificates Earned</p>
        </div>
      </div>

      {/* Next Up Live Class Spotlight Banner */}
      {upcomingClasses.length > 0 && (
        <div className="p-5 sm:p-6 rounded-2xl bg-white border-2 border-brand-500/30 shadow-subtle flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-200">
              <Video className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-bold text-rose-600 uppercase tracking-wider flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" /> Next Scheduled Live Class
                </span>
                <Badge variant="brand" size="sm">
                  {upcomingClasses[0].batchName}
                </Badge>
              </div>
              <h3 className="text-base font-bold text-brand-900">
                {upcomingClasses[0].title}
              </h3>
              <p className="text-xs text-content-muted mt-1 flex items-center gap-2">
                <span>Instructor: <strong className="text-brand-900">{upcomingClasses[0].instructorName}</strong></span>
                <span>•</span>
                <span>{upcomingClasses[0].date} at {upcomingClasses[0].time}</span>
              </p>
            </div>
          </div>

          <Link to={`/classroom/${upcomingClasses[0].batchId}`}>
            <Button variant="primary" size="md" icon={Video}>
              Join Live Classroom
            </Button>
          </Link>
        </div>
      )}

      {/* Active Enrolled Cohorts */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-brand-900">My Enrolled Cohorts</h3>
          <Link to="/student/courses" className="text-xs font-semibold text-brand-600 hover:text-brand-800">
            View All ({studentEnrollments.length}) →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {studentEnrollments.map((enr) => (
            <div
              key={enr.id}
              className="p-5 rounded-2xl bg-white border border-edge shadow-subtle hover:border-gray-300 transition space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Badge variant="brand" size="sm" className="mb-1.5">
                    {enr.batchName}
                  </Badge>
                  <h4 className="text-base font-bold text-brand-900 leading-snug">
                    {enr.courseTitle}
                  </h4>
                  <p className="text-xs text-content-muted mt-0.5">
                    Instructor: {enr.instructorName}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-brand-700">
                    {enr.progressPercentage || 65}% Done
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-500 rounded-full transition-all"
                  style={{ width: `${enr.progressPercentage || 65}%` }}
                />
              </div>

              <div className="pt-2 flex items-center justify-between text-xs border-t border-edge">
                <span className="text-content-muted">
                  Attendance: <strong className="text-emerald-700">{enr.attendanceRate || 92}%</strong>
                </span>
                <Link
                  to={`/classroom/${enr.batchId}`}
                  className="text-xs font-semibold text-brand-600 hover:text-brand-900"
                >
                  Enter Room →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentOverviewPage;
