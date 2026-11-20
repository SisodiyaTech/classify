import React from 'react';
import { useStore } from '../../context/AppContext';
import { Layers, Calendar, Clock, Users, Video } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import Badge from '../../components/common/Badge';

export const AdminBatchesPage = () => {
  const { batches } = useStore();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-900">Cohort & Batch Oversight</h1>
        <p className="text-xs text-content-muted mt-1">
          Monitor all live cohorts across instructors. System strictly enforces a maximum capacity of 50 students per cohort.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-edge shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-edge bg-surface-subtle text-content-muted uppercase tracking-wider text-[11px] font-semibold">
                <th className="py-3.5 px-4">Batch Name</th>
                <th className="py-3.5 px-4">Course</th>
                <th className="py-3.5 px-4">Instructor</th>
                <th className="py-3.5 px-4">Schedule</th>
                <th className="py-3.5 px-4">Enrolled / Capacity</th>
                <th className="py-3.5 px-4">Tuition</th>
                <th className="py-3.5 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-edge">
              {batches.map((b) => (
                <tr key={b.id} className="hover:bg-surface-subtle transition">
                  <td className="py-3.5 px-4 font-semibold text-brand-900">{b.name}</td>
                  <td className="py-3.5 px-4 text-content-body">{b.courseTitle}</td>
                  <td className="py-3.5 px-4 font-medium text-brand-700">{b.instructorName}</td>
                  <td className="py-3.5 px-4 text-content-muted">
                    {b.daysDisplay} ({b.timing})
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-brand-900">
                      {b.enrolledCount} / {b.maxCapacity}
                    </span>{' '}
                    <span className="text-[10px] text-content-muted">
                      ({Math.max(0, b.maxCapacity - b.enrolledCount)} open)
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-brand-900">{formatCurrency(b.fee)}</td>
                  <td className="py-3.5 px-4 text-right">
                    <Badge variant="brand" size="sm">{b.status}</Badge>
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

export default AdminBatchesPage;
