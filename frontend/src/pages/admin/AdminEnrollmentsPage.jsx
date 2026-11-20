import React from 'react';
import { useStore } from '../../context/AppContext';
import { GraduationCap, CheckCircle2 } from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';
import Badge from '../../components/common/Badge';

export const AdminEnrollmentsPage = () => {
  const { enrollments } = useStore();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-900">Student Enrollments Master Log</h1>
        <p className="text-xs text-content-muted mt-1">
          Full roster of verified seat reservations across all small batches.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-edge shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-edge bg-surface-subtle text-content-muted uppercase tracking-wider text-[11px] font-semibold">
                <th className="py-3.5 px-4">Enrollment ID</th>
                <th className="py-3.5 px-4">Student</th>
                <th className="py-3.5 px-4">Cohort Batch</th>
                <th className="py-3.5 px-4">Instructor</th>
                <th className="py-3.5 px-4">Amount Paid</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4 text-right">Payment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-edge">
              {enrollments.map((enr) => (
                <tr key={enr.id} className="hover:bg-surface-subtle transition">
                  <td className="py-3.5 px-4 font-mono font-medium text-brand-900">{enr.id}</td>
                  <td className="py-3.5 px-4 font-semibold text-brand-900">{enr.studentName}</td>
                  <td className="py-3.5 px-4 text-content-body">{enr.batchName}</td>
                  <td className="py-3.5 px-4 text-content-body">{enr.instructorName}</td>
                  <td className="py-3.5 px-4 font-bold text-brand-900">{formatCurrency(enr.amountPaid)}</td>
                  <td className="py-3.5 px-4 text-content-muted">{enr.enrolledAt}</td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-semibold border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3" /> Paid
                    </span>
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

export default AdminEnrollmentsPage;
