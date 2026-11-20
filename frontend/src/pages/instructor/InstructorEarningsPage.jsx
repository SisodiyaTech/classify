import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { DollarSign, TrendingUp, Download, ArrowUpRight, CheckCircle2, Clock } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { formatCurrency, formatDate } from '../../utils/formatters';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';

export const InstructorEarningsPage = () => {
  const { user } = useAuth();
  const { payments } = useStore();
  const { addToast } = useToast();

  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState('42000');
  const [bankAccount, setBankAccount] = useState('HDFC Bank •••• 9210');

  const myEarnings = payments.filter(
    (p) => p.instructorId === user?.id || user?.id === 'user-instructor-1'
  );

  const earningsChartData = [
    { month: 'Jun', payout: 24000 },
    { month: 'Jul', payout: 36000 },
    { month: 'Aug', payout: 48000 },
    { month: 'Sep', payout: 55000 },
    { month: 'Oct', payout: 66000 },
    { month: 'Nov', payout: 81000 },
  ];

  const handleRequestPayout = (e) => {
    e.preventDefault();
    setIsPayoutModalOpen(false);
    addToast(`Payout request for ${formatCurrency(Number(payoutAmount))} submitted! Transferred within 2 banking days.`, 'success');
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-900">Earnings & Financial Payouts</h1>
          <p className="text-xs text-content-muted mt-1">
            Track small-batch revenue, platform commission settlements, and direct bank transfers.
          </p>
        </div>

        <Button
          onClick={() => setIsPayoutModalOpen(true)}
          variant="primary"
          size="sm"
          icon={ArrowUpRight}
        >
          Request Bank Payout
        </Button>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-6 rounded-2xl bg-white border border-edge shadow-subtle">
          <span className="text-xs text-content-muted">Gross Cohort Revenue</span>
          <p className="text-2xl font-bold text-brand-900 mt-1">
            {formatCurrency(user?.totalEarnings || 384500)}
          </p>
          <span className="text-[11px] text-emerald-700 font-semibold block mt-1">
            +18% from last month
          </span>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-edge shadow-subtle">
          <span className="text-xs text-content-muted">Available Balance</span>
          <p className="text-2xl font-bold text-brand-700 mt-1">
            {formatCurrency(user?.availableBalance || 42000)}
          </p>
          <span className="text-[11px] text-content-muted block mt-1">
            Ready to withdraw to bank
          </span>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-edge shadow-subtle">
          <span className="text-xs text-content-muted">Platform Commission (15%)</span>
          <p className="text-2xl font-bold text-content-body mt-1">
            {formatCurrency(57675)}
          </p>
          <span className="text-[11px] text-content-muted block mt-1">
            Covers live video rooms & merchant fee
          </span>
        </div>
      </div>

      {/* Recharts Bar Chart */}
      <div className="bg-white p-6 rounded-2xl border border-edge shadow-subtle space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-brand-900">Monthly Payout Trends</h3>
            <p className="text-xs text-content-muted">Net instructor payouts received</p>
          </div>
          <span className="text-xs font-semibold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-lg">
            85% Instructor Net Share
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={earningsChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F2F4F7" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#667085' }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#667085' }} tickFormatter={(val) => `₹${val/1000}k`} />
              <Tooltip 
                formatter={(val) => [formatCurrency(val), 'Net Payout']}
                contentStyle={{ backgroundColor: '#102A2A', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
              />
              <Bar dataKey="payout" fill="#176B5B" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Payout Modal */}
      {isPayoutModalOpen && (
        <Modal
          isOpen={isPayoutModalOpen}
          onClose={() => setIsPayoutModalOpen(false)}
          title="Withdraw Available Balance"
          subtitle="Direct deposit to your linked bank account."
        >
          <form onSubmit={handleRequestPayout} className="space-y-4">
            <Input
              label="Withdrawal Amount (₹ INR)"
              type="number"
              value={payoutAmount}
              onChange={(e) => setPayoutAmount(e.target.value)}
              helperText={`Available for payout: ${formatCurrency(user?.availableBalance || 42000)}`}
              required
            />

            <Input
              label="Linked Bank Account"
              value={bankAccount}
              onChange={(e) => setBankAccount(e.target.value)}
              required
            />

            <div className="p-3 rounded-xl bg-surface-subtle border border-edge text-xs space-y-1 text-content-muted">
              <p>• Payouts are settled every Tuesday and Friday.</p>
              <p>• Zero withdrawal transaction fees.</p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" onClick={() => setIsPayoutModalOpen(false)} variant="outline" size="sm">
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm">
                Confirm Bank Transfer
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default InstructorEarningsPage;
