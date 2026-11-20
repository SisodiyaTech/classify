import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/AppContext';
import { CreditCard, Download, CheckCircle2, Clock, ExternalLink } from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

export const StudentPaymentsPage = () => {
  const { user } = useAuth();
  const { payments } = useStore();

  const studentPayments = payments.filter(
    (p) => p.studentId === user?.id || p.studentName === user?.name
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-900">Payments & Invoices</h1>
        <p className="text-xs text-content-muted mt-1">
          Detailed history of batch enrollments and simulated payment receipts.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-edge shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-edge bg-surface-subtle text-content-muted uppercase tracking-wider text-[11px] font-semibold">
                <th className="py-3.5 px-4">Transaction ID</th>
                <th className="py-3.5 px-4">Cohort & Course</th>
                <th className="py-3.5 px-4">Instructor</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-edge">
              {studentPayments.map((p) => (
                <tr key={p.id} className="hover:bg-surface-subtle transition">
                  <td className="py-3.5 px-4 font-mono font-medium text-brand-900">{p.id}</td>
                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-brand-900">{p.courseTitle}</p>
                    <p className="text-[11px] text-content-muted">{p.batchName}</p>
                  </td>
                  <td className="py-3.5 px-4 text-content-body font-medium">{p.instructorName}</td>
                  <td className="py-3.5 px-4 text-content-muted">{formatDate(p.date)}</td>
                  <td className="py-3.5 px-4 font-bold text-brand-900">{formatCurrency(p.amount)}</td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-semibold border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3" /> Paid
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => alert(`Downloaded Tax Invoice for ${p.id}`)}
                      className="p-1.5 rounded-lg border border-edge hover:bg-gray-100 text-gray-600 transition"
                      title="Download Invoice"
                    >
                      <Download className="w-3.5 h-3.5" />
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

export default StudentPaymentsPage;
