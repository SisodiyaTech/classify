import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import Button from '../../components/common/Button';

export const StudentSettingsPage = () => {
  const { addToast } = useToast();
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [smsNotifs, setSmsNotifs] = useState(true);
  const [classReminders, setClassReminders] = useState(true);

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-brand-900">Account Settings</h1>
        <p className="text-xs text-content-muted mt-1">
          Configure notifications, class reminders, and privacy preferences.
        </p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-edge shadow-subtle space-y-6">
        <h3 className="text-sm font-bold text-brand-900 border-b border-edge pb-2">
          Class Notifications & Reminders
        </h3>

        <div className="space-y-4 text-xs">
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="font-semibold text-brand-900">Live Class Start Alert</p>
              <p className="text-content-muted text-[11px]">Receive an email reminder 15 minutes before batch begins</p>
            </div>
            <input
              type="checkbox"
              checked={classReminders}
              onChange={() => setClassReminders(!classReminders)}
              className="w-4 h-4 text-brand-500 rounded border-edge focus:ring-brand-500"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="font-semibold text-brand-900">Assignment Feedback Notifications</p>
              <p className="text-content-muted text-[11px]">Get notified when instructor grades and leaves feedback</p>
            </div>
            <input
              type="checkbox"
              checked={emailNotifs}
              onChange={() => setEmailNotifs(!emailNotifs)}
              className="w-4 h-4 text-brand-500 rounded border-edge focus:ring-brand-500"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="font-semibold text-brand-900">SMS / WhatsApp Batch Updates</p>
              <p className="text-content-muted text-[11px]">Receive emergency schedule change alerts via SMS</p>
            </div>
            <input
              type="checkbox"
              checked={smsNotifs}
              onChange={() => setSmsNotifs(!smsNotifs)}
              className="w-4 h-4 text-brand-500 rounded border-edge focus:ring-brand-500"
            />
          </label>
        </div>

        <div className="flex justify-end pt-4 border-t border-edge">
          <Button
            onClick={() => addToast('Settings saved successfully!', 'success')}
            variant="primary"
          >
            Save Preferences
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StudentSettingsPage;
