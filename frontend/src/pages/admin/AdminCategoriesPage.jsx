import React, { useState } from 'react';
import { mockCategories } from '../../data/mockCourses';
import { useToast } from '../../context/ToastContext';
import { FolderTree, Plus, Edit, Trash2 } from 'lucide-react';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

export const AdminCategoriesPage = () => {
  const { addToast } = useToast();
  const [categories, setCategories] = useState(mockCategories);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-900">Learning Categories</h1>
          <p className="text-xs text-content-muted mt-1">
            Organize skills taxonomy and landing page catalog shelves.
          </p>
        </div>
        <Button onClick={() => addToast('Create category modal opened.', 'info')} variant="primary" size="sm" icon={Plus}>
          Add Category
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((c) => (
          <div key={c.id} className="p-5 rounded-2xl bg-white border border-edge shadow-subtle flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-lg">
                  {c.count} Batches
                </span>
              </div>
              <h3 className="text-base font-bold text-brand-900">{c.name}</h3>
              <p className="text-[11px] text-content-muted font-mono mt-0.5">Slug: {c.id}</p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-edge text-xs">
              <button
                onClick={() => addToast(`Editing category: ${c.name}`, 'info')}
                className="text-brand-600 hover:text-brand-800 font-semibold"
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const AdminReviewsPage = () => {
  const { addToast } = useToast();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-900">Student Reviews Moderation</h1>
        <p className="text-xs text-content-muted mt-1">
          Monitor learner ratings and resolve disputed reviews across live cohorts.
        </p>
      </div>
      <div className="p-8 rounded-2xl bg-white border border-edge shadow-subtle text-center text-xs text-content-muted">
        All 142 student reviews across active cohorts meet platform community standards.
      </div>
    </div>
  );
};

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

export const AdminSettingsPage = () => {
  const { addToast } = useToast();
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-brand-900">Platform Governance Settings</h1>
        <p className="text-xs text-content-muted mt-1">
          Configure business rules, fee structures, and cohort capacity ceilings.
        </p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-edge shadow-subtle space-y-6 text-xs">
        <div className="space-y-4">
          <div className="flex justify-between items-center py-2 border-b border-edge">
            <div>
              <p className="font-bold text-brand-900">Platform Commission Rate</p>
              <p className="text-content-muted text-[11px]">Percentage retained from gross batch enrollments</p>
            </div>
            <span className="font-mono font-bold text-brand-900 text-sm bg-brand-50 px-3 py-1 rounded-lg">15%</span>
          </div>

          <div className="flex justify-between items-center py-2 border-b border-edge">
            <div>
              <p className="font-bold text-brand-900">Maximum Batch Capacity Ceiling</p>
              <p className="text-content-muted text-[11px]">Hard ceiling enforced across all cohort creations</p>
            </div>
            <span className="font-mono font-bold text-brand-900 text-sm bg-brand-50 px-3 py-1 rounded-lg">50 Students</span>
          </div>

          <div className="flex justify-between items-center py-2 border-b border-edge">
            <div>
              <p className="font-bold text-brand-900">Recommended Batch Size Range</p>
              <p className="text-content-muted text-[11px]">Default suggestion in batch creation wizard</p>
            </div>
            <span className="font-mono font-bold text-brand-900 text-sm bg-brand-50 px-3 py-1 rounded-lg">10–15 Students</span>
          </div>

          <div className="flex justify-between items-center py-2">
            <div>
              <p className="font-bold text-brand-900">Mandatory Instructor Verification</p>
              <p className="text-content-muted text-[11px]">Instructors must be admin-approved before publishing courses</p>
            </div>
            <input type="checkbox" defaultChecked className="w-4 h-4 text-brand-500 rounded" />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-edge">
          <Button onClick={() => addToast('System governance policies saved!', 'success')} variant="primary">
            Save Platform Policy
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminCategoriesPage;
