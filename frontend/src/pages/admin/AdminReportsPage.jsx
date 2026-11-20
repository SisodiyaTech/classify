import React from 'react';
import Button from '../../components/common/Button';

export const AdminReportsPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-900">Financial & Operational Reports</h1>
        <p className="text-xs text-content-muted mt-1">
          Export monthly GST, TDS, instructor payout schedules, and batch attendance logs.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-edge shadow-subtle space-y-3">
          <h4 className="font-bold text-brand-900 text-sm">Monthly Revenue & Commission</h4>
          <p className="text-xs text-content-muted">Complete audit trail of all transactions and 15% platform commissions.</p>
          <Button onClick={() => alert('Exporting CSV...')} variant="outline" size="sm" className="w-full">
            Export CSV
          </Button>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-edge shadow-subtle space-y-3">
          <h4 className="font-bold text-brand-900 text-sm">Batch Capacity Compliance</h4>
          <p className="text-xs text-content-muted">Verification that no cohort exceeded 50 students, with average sizes around 12.</p>
          <Button onClick={() => alert('Exporting Audit...')} variant="outline" size="sm" className="w-full">
            Export Audit
          </Button>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-edge shadow-subtle space-y-3">
          <h4 className="font-bold text-brand-900 text-sm">Instructor Verification Archive</h4>
          <p className="text-xs text-content-muted">Identity proofs, approval dates, and background check logs.</p>
          <Button onClick={() => alert('Exporting Logs...')} variant="outline" size="sm" className="w-full">
            Export Logs
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminReportsPage;
