import React from 'react';
import { useStore } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { CreditCard, CheckCircle2, DollarSign, Download } from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

export const AdminPaymentsPage = () => {
  const { payments } = useStore();
  const { addToast } = useToast();

  const handleRefund = (id) => {
    if (confirm(`Process refund for transaction ${id}?`)) {
      addToast(`Refund initiated for transaction ${id}.`, 'info');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-900">Platform Payments & Fee Settlements</h1>
          <p className="text-xs text-content-muted mt-1">
            Tracking customer transactions, 15% platform commissions, and instructor net proceeds.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-edge shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-edge bg-surface-subtle text-content-muted uppercase tracking-wider text-[11px] font-semibold">
                <th className="py-3.5 px-4">Transaction ID</th>
                <th className="py-3.5 px-4">Student</th>
                <th className="py-3.5 px-4">Instructor</th>
                <th className="py-3.5 px-4">Gross Fee</th>
                <th className="py-3.5 px-4">Platform (15%)</th>
                <th className="py-3.5 px-4">Instructor (85%)</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-edge">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-surface-subtle transition">
                  <td className="py-3.5 px-4 font-mono font-medium text-brand-900">{p.id}</td>
                  <td className="py-3.5 px-4 font-semibold text-brand-900">{p.studentName}</td>
                  <td className="py-3.5 px-4 text-content-body">{p.instructorName}</td>
                  <td className="py-3.5 px-4 font-bold text-brand-900">{formatCurrency(p.amount)}</td>
                  <td className="py-3.5 px-4 font-semibold text-emerald-700">
                    {formatCurrency(p.platformFee || p.amount * 0.15)}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-brand-900">
                    {formatCurrency(p.instructorPayout || p.amount * 0.85)}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleRefund(p.id)}
                      className="text-xs font-semibold text-rose-600 hover:text-rose-800"
                    >
                      Refund
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

export default AdminPaymentsPage;
