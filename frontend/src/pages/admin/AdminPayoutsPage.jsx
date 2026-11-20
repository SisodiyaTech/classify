import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { DollarSign, CheckCircle2, Clock, ArrowUpRight } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

export const AdminPayoutsPage = () => {
  const { addToast } = useToast();
  const [payouts, setPayouts] = useState([
    { id: 'PAY-4091', instructor: 'Dr. Ananya Roy', amount: 42000, bank: 'HDFC Bank •••• 9210', date: '2026-11-16', status: 'Pending Approval' },
    { id: 'PAY-4090', instructor: 'Rohan Varma', amount: 31000, bank: 'ICICI Bank •••• 4412', date: '2026-11-15', status: 'Completed' },
    { id: 'PAY-4089', instructor: 'Sunita Deshmukh', amount: 16500, bank: 'SBI •••• 1089', date: '2026-11-12', status: 'Completed' },
  ]);

  const handleApprove = (id) => {
    setPayouts(payouts.map(p => p.id === id ? { ...p, status: 'Completed' } : p));
    addToast(`Payout ${id} approved and transmitted via NEFT / IMPS.`, 'success');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-900">Instructor Bank Payouts</h1>
        <p className="text-xs text-content-muted mt-1">
          Review withdrawal requests from instructors and authorize bank batch settlements.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-edge shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-edge bg-surface-subtle text-content-muted uppercase tracking-wider text-[11px] font-semibold">
                <th className="py-3.5 px-4">Payout Ref</th>
                <th className="py-3.5 px-4">Instructor</th>
                <th className="py-3.5 px-4">Net Amount</th>
                <th className="py-3.5 px-4">Destination Bank</th>
                <th className="py-3.5 px-4">Request Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-edge">
              {payouts.map((p) => (
                <tr key={p.id} className="hover:bg-surface-subtle transition">
                  <td className="py-3.5 px-4 font-mono font-medium text-brand-900">{p.id}</td>
                  <td className="py-3.5 px-4 font-semibold text-brand-900">{p.instructor}</td>
                  <td className="py-3.5 px-4 font-bold text-brand-700">{formatCurrency(p.amount)}</td>
                  <td className="py-3.5 px-4 text-content-muted">{p.bank}</td>
                  <td className="py-3.5 px-4 text-content-muted">{p.date}</td>
                  <td className="py-3.5 px-4">
                    <Badge variant={p.status === 'Completed' ? 'success' : 'warning'} size="sm">
                      {p.status}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {p.status === 'Pending Approval' ? (
                      <Button onClick={() => handleApprove(p.id)} variant="primary" size="sm">
                        Release Funds
                      </Button>
                    ) : (
                      <span className="text-emerald-700 font-semibold text-[11px]">Settled ✓</span>
                    )}
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

export default AdminPayoutsPage;
