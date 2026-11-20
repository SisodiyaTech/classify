import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/AppContext';
import { 
  Users, 
  BookOpen, 
  Layers, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Video, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowRight,
  Plus
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from 'recharts';
import { formatCurrency } from '../../utils/formatters';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

export const InstructorOverviewPage = () => {
  const { user } = useAuth();
  const { courses, batches, enrollments, liveClasses } = useStore();

  const myCourses = courses.filter((c) => c.instructorId === user?.id || user?.id === 'user-instructor-1');
  const myBatches = batches.filter((b) => b.instructorId === user?.id || user?.id === 'user-instructor-1');
  const myLiveClasses = liveClasses.filter((c) => c.instructorId === user?.id || user?.id === 'user-instructor-1');

  const totalStudents = myCourses.reduce((sum, c) => sum + (c.totalEnrolledStudents || 0), 0) || 58;
  const isApproved = user?.verificationStatus === 'Approved';

  // Realistic monthly cohort revenue data for Recharts
  const monthlyRevenueData = [
    { month: 'Jun', revenue: 28000, students: 8 },
    { month: 'Jul', revenue: 42000, students: 12 },
    { month: 'Aug', revenue: 56000, students: 16 },
    { month: 'Sep', revenue: 64500, students: 18 },
    { month: 'Oct', revenue: 78000, students: 22 },
    { month: 'Nov', revenue: 94500, students: 26 },
  ];

  return (
    <div className="space-y-8">
      {/* Verification Warning Alert if not approved */}
      {!isApproved && (
        <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold">Verification Status: {user?.verificationStatus || 'Pending Review'}</h3>
                <Badge variant="warning" size="sm">Action Required</Badge>
              </div>
              <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                Before you can schedule and publish live small-group cohorts, complete your identity and credentials review.
              </p>
            </div>
          </div>
          <Link to="/instructor/verification">
            <Button variant="primary" size="sm">
              Complete Verification Form
            </Button>
          </Link>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-brand-900">
              Instructor Dashboard
            </h1>
            {isApproved && (
              <Badge variant="brand" size="sm" icon={CheckCircle2}>
                Verified
              </Badge>
            )}
          </div>
          <p className="text-xs text-content-muted mt-1">
            Welcome back, {user?.name}. Here is an overview of your active small-batch cohorts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/instructor/batches">
            <Button variant="outline" size="sm" icon={Plus}>
              Create Batch
            </Button>
          </Link>
          <Link to="/instructor/courses">
            <Button variant="primary" size="sm" icon={Plus}>
              Create Course
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-edge shadow-subtle">
          <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mb-3">
            <Users className="w-5 h-5" />
          </div>
          <p className="text-2xl font-bold text-brand-900">{totalStudents}</p>
          <p className="text-xs text-content-muted mt-0.5">Total Enrolled Students</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-edge shadow-subtle">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
            <Layers className="w-5 h-5" />
          </div>
          <p className="text-2xl font-bold text-brand-900">{myBatches.length}</p>
          <p className="text-xs text-content-muted mt-0.5">Active Cohorts (Batches)</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-edge shadow-subtle">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
            <DollarSign className="w-5 h-5" />
          </div>
          <p className="text-2xl font-bold text-brand-900">{formatCurrency(user?.totalEarnings || 384500)}</p>
          <p className="text-xs text-content-muted mt-0.5">Gross Cohort Earnings</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-edge shadow-subtle">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
            <TrendingUp className="w-5 h-5" />
          </div>
          <p className="text-2xl font-bold text-brand-900">{formatCurrency(user?.availableBalance || 42000)}</p>
          <p className="text-xs text-content-muted mt-0.5">Available for Payout</p>
        </div>
      </div>

      {/* Live Class Immediate Start Card */}
      {myLiveClasses.length > 0 && (
        <div className="p-6 rounded-2xl bg-white border-2 border-brand-500/30 shadow-subtle flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
              <Video className="w-6 h-6 text-brand-600" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-bold text-brand-600 uppercase tracking-wider">
                  Upcoming Live Session
                </span>
                <Badge variant="brand" size="sm">
                  {myLiveClasses[0].batchName}
                </Badge>
              </div>
              <h3 className="text-base font-bold text-brand-900">{myLiveClasses[0].title}</h3>
              <p className="text-xs text-content-muted mt-0.5">
                {myLiveClasses[0].date} at {myLiveClasses[0].time} • {myLiveClasses[0].participantsCount || 10} students attending
              </p>
            </div>
          </div>

          <Link to={`/classroom/${myLiveClasses[0].batchId}`}>
            <Button variant="primary" size="md" icon={Video}>
              Start Live Class
            </Button>
          </Link>
        </div>
      )}

      {/* Monthly Revenue Recharts Section */}
      <div className="bg-white p-6 rounded-2xl border border-edge shadow-subtle space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-brand-900">Cohort Revenue Growth</h3>
            <p className="text-xs text-content-muted">Monthly earnings from small-batch enrollments</p>
          </div>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
            +21% vs last month
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyRevenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#176B5B" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#176B5B" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F2F4F7" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#667085' }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#667085' }} tickFormatter={(val) => `₹${val/1000}k`} />
              <Tooltip 
                formatter={(value) => [formatCurrency(value), 'Revenue']}
                contentStyle={{ backgroundColor: '#102A2A', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
              />
              <Area type="monotone" dataKey="revenue" stroke="#176B5B" strokeWidth={2.5} fillOpacity={1} fill="url(#revenueGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Active Batches List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-brand-900">My Active Batches</h3>
          <Link to="/instructor/batches" className="text-xs font-semibold text-brand-600 hover:text-brand-800">
            Manage All Batches →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {myBatches.map((batch) => (
            <div key={batch.id} className="p-5 rounded-2xl bg-white border border-edge shadow-subtle space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-base font-bold text-brand-900">{batch.name}</h4>
                  <p className="text-xs text-content-muted mt-0.5">{batch.courseTitle}</p>
                </div>
                <Badge variant="brand" size="sm">{batch.status}</Badge>
              </div>

              <div className="flex justify-between text-xs py-2 border-y border-edge">
                <span className="text-content-muted">Schedule: {batch.daysDisplay} ({batch.timing})</span>
                <span className="font-semibold text-brand-900">
                  {batch.enrolledCount} / {batch.maxCapacity} Seats
                </span>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-sm font-bold text-brand-900">{formatCurrency(batch.fee)} / student</span>
                <Link to={`/classroom/${batch.id}`}>
                  <Button variant="outline" size="sm" icon={Video}>
                    Start Session
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InstructorOverviewPage;
