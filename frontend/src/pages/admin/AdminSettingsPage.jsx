import React from 'react';
import { useToast } from '../../context/ToastContext';
import Button from '../../components/common/Button';

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

export default AdminSettingsPage;
