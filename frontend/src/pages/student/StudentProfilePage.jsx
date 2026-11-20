import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { User, Mail, Phone, MapPin, Camera, Save } from 'lucide-react';
import Input, { Textarea } from '../../components/common/Input';
import Button from '../../components/common/Button';

export const StudentProfilePage = () => {
  const { user, updateUser } = useAuth();
  const { addToast } = useToast();

  const [name, setName] = useState(user?.name || '');
  const [headline, setHeadline] = useState(user?.headline || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [location, setLocation] = useState(user?.location || 'Bangalore, India');
  const [phone, setPhone] = useState(user?.phone || '+91 98765 43210');

  const handleSave = (e) => {
    e.preventDefault();
    updateUser({ name, headline, bio, location, phone });
    addToast('Profile updated successfully!', 'success');
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-brand-900">Student Profile</h1>
        <p className="text-xs text-content-muted mt-1">
          Manage how instructors and peers in your live cohorts see you.
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 rounded-3xl border border-edge shadow-subtle space-y-6">
        {/* Avatar section */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={user?.avatar}
              alt={user?.name}
              className="w-20 h-20 rounded-2xl object-cover ring-2 ring-brand-100"
            />
            <button
              type="button"
              className="absolute -bottom-1 -right-1 p-1.5 rounded-xl bg-brand-500 text-white shadow-subtle hover:bg-brand-600 transition"
              title="Change Avatar"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>
          <div>
            <h3 className="text-sm font-bold text-brand-900">{user?.name}</h3>
            <p className="text-xs text-content-muted">{user?.email}</p>
          </div>
        </div>

        <div className="space-y-4">
          <Input
            label="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <Input
            label="Learner Headline"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            placeholder="e.g. Lifelong Learner & Culinary Enthusiast"
          />

          <Textarea
            label="About Me & Learning Goals"
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Share a bit about what skills you love learning..."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <Input
              label="Contact Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-edge">
          <Button type="submit" variant="primary" icon={Save}>
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
};

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
              <p className="text-content-muted text-[11px]">Get notified when instructor grades and leaves audio/text feedback</p>
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
              <p className="text-content-muted text-[11px]">Receive schedule change or emergency batch notices via SMS</p>
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

export default StudentProfilePage;
