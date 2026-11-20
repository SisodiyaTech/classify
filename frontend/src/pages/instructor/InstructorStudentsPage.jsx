import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/AppContext';
import { Users, Mail, Calendar, CheckCircle2, Award, Search } from 'lucide-react';
import Badge from '../../components/common/Badge';

export const InstructorStudentsPage = () => {
  const { user } = useAuth();
  const { enrollments } = useStore();

  const myStudents = enrollments.filter(
    (e) => e.instructorId === user?.id || user?.id === 'user-instructor-1'
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-900">Enrolled Students Management</h1>
          <p className="text-xs text-content-muted mt-1">
            Monitor attendance, homework completion, and progress for every student in your cohorts.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-edge shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-edge bg-surface-subtle text-content-muted uppercase tracking-wider text-[11px] font-semibold">
                <th className="py-3.5 px-4">Student</th>
                <th className="py-3.5 px-4">Cohort Batch</th>
                <th className="py-3.5 px-4">Enrolled On</th>
                <th className="py-3.5 px-4">Attendance</th>
                <th className="py-3.5 px-4">Progress</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-edge">
              {myStudents.map((s) => (
                <tr key={s.id} className="hover:bg-surface-subtle transition">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={s.studentAvatar}
                        alt={s.studentName}
                        className="w-8 h-8 rounded-full object-cover ring-1 ring-edge"
                      />
                      <div>
                        <p className="font-semibold text-brand-900">{s.studentName}</p>
                        <p className="text-[11px] text-content-muted">{s.studentEmail}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-medium text-brand-900">{s.batchName}</span>
                  </td>
                  <td className="py-3.5 px-4 text-content-muted">{s.enrolledAt}</td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      {s.attendanceRate || 92}%
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="w-24 space-y-1">
                      <div className="flex justify-between text-[10px]">
                        <span>{s.progressPercentage || 65}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-brand-500 rounded-full"
                          style={{ width: `${s.progressPercentage || 65}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => alert(`Opening student portfolio for ${s.studentName}`)}
                      className="text-xs font-semibold text-brand-600 hover:text-brand-900"
                    >
                      View Report Card
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InstructorStudentsPage;
