import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Camera, Save, Globe, Award, ShieldCheck } from 'lucide-react';
import Input, { Textarea } from '../../components/common/Input';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

export const InstructorProfilePage = () => {
  const { user, updateUser } = useAuth();
  const { addToast } = useToast();

  const [name, setName] = useState(user?.name || '');
  const [headline, setHeadline] = useState(user?.headline || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [location, setLocation] = useState(user?.location || 'Pune, India');
  const [phone, setPhone] = useState(user?.phone || '+91 98230 11223');
  const [skills, setSkills] = useState(user?.skills ? user.skills.join(', ') : '');

  const handleSave = (e) => {
    e.preventDefault();
    updateUser({
      name,
      headline,
      bio,
      location,
      phone,
      skills: skills.split(',').map((s) => s.trim())
    });
    addToast('Instructor profile updated successfully!', 'success');
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-brand-900">Instructor Public Profile</h1>
        <p className="text-xs text-content-muted mt-1">
          This information is displayed publicly to students discovering your live cohorts.
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 rounded-3xl border border-edge shadow-subtle space-y-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={user?.avatar}
              alt={user?.name}
              className="w-20 h-20 rounded-2xl object-cover ring-2 ring-brand-100"
            />
            <button
              type="button"
              className="absolute -bottom-1 -right-1 p-1.5 rounded-xl bg-brand-500 text-white shadow-subtle"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-brand-900">{user?.name}</h3>
              {user?.verificationStatus === 'Approved' && (
                <Badge variant="brand" size="sm" icon={ShieldCheck}>Verified</Badge>
              )}
            </div>
            <p className="text-xs text-content-muted">{user?.email}</p>
          </div>
        </div>

        <div className="space-y-4">
          <Input
            label="Public Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <Input
            label="Teaching / Craft Headline"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            placeholder="e.g. Artisanal Baker & Sourdough Consultant"
            required
          />

          <Textarea
            label="Instructor Biography & Teaching Style"
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            required
          />

          <Input
            label="Skills & Topics (Comma separated)"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
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
            Save Profile
          </Button>
        </div>
      </form>
    </div>
  );
};

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

export default InstructorProfilePage;
