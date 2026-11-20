import React from 'react';
import { useToast } from '../../context/ToastContext';
import Button from '../../components/common/Button';

export const InstructorSettingsPage = () => {
  const { addToast } = useToast();
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-brand-900">Instructor Settings</h1>
        <p className="text-xs text-content-muted mt-1">
          Manage classroom defaults, student notification automation, and banking.
        </p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-edge shadow-subtle space-y-6">
        <h3 className="text-sm font-bold text-brand-900 border-b border-edge pb-2">
          Classroom Defaults
        </h3>
        <div className="space-y-3 text-xs">
          <label className="flex items-center justify-between">
            <span>Auto-record all live cohort sessions for student review</span>
            <input type="checkbox" defaultChecked className="w-4 h-4 text-brand-500 rounded" />
          </label>
          <label className="flex items-center justify-between">
            <span>Mute students automatically on entry to avoid background noise</span>
            <input type="checkbox" defaultChecked className="w-4 h-4 text-brand-500 rounded" />
          </label>
          <label className="flex items-center justify-between">
            <span>Send automated SMS 30 mins before every live session</span>
            <input type="checkbox" defaultChecked className="w-4 h-4 text-brand-500 rounded" />
          </label>
        </div>

        <div className="flex justify-end pt-4 border-t border-edge">
          <Button onClick={() => addToast('Settings updated!', 'success')} variant="primary">
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InstructorSettingsPage;
