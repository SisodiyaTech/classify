import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  FileText, 
  Upload, 
  ExternalLink 
} from 'lucide-react';
import VerificationForm from '../../components/forms/VerificationForm';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';

export const InstructorVerificationPage = () => {
  const { user, updateUser } = useAuth();
  const { submitInstructorApplication } = useStore();
  const { addToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const status = user?.verificationStatus || 'Not Submitted';

  const handleApplicationSubmit = (formData) => {
    setIsSubmitting(true);
    setTimeout(() => {
      submitInstructorApplication(user.id, formData);
      updateUser({
        verificationStatus: 'Pending Review',
        ...formData
      });
      setIsSubmitting(false);
      addToast('Verification application submitted! Admin team will review within 24 hours.', 'success');
    }, 800);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-brand-900">
            Instructor Verification Application
          </h1>
          {status === 'Approved' && (
            <Badge variant="brand" size="sm" icon={CheckCircle2}>
              Approved
            </Badge>
          )}
          {status === 'Pending Review' && (
            <Badge variant="warning" size="sm" icon={Clock}>
              Pending Review
            </Badge>
          )}
          {status === 'Rejected' && (
            <Badge variant="danger" size="sm" icon={XCircle}>
              Changes Requested
            </Badge>
          )}
        </div>
        <p className="text-xs text-content-muted mt-1">
          Identity and credential review ensures high quality and safety for all live small-batch learners.
        </p>
      </div>

      {/* Status Alert Banner */}
      {status === 'Approved' && (
        <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-emerald-900">
              Your Instructor Account is Verified & Approved!
            </h4>
            <p className="text-xs text-emerald-800 mt-1 leading-relaxed">
              You have full privileges to create courses, schedule small-batch cohorts, conduct interactive live video classes, and receive automated payouts.
            </p>
          </div>
        </div>
      )}

      {status === 'Pending Review' && (
        <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 flex items-start gap-3">
          <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-amber-900">
              Application Under Review by Classify Administrators
            </h4>
            <p className="text-xs text-amber-800 mt-1 leading-relaxed">
              Thank you for submitting your identity proof and credentials. An administrator is currently reviewing your documents. You can test approving this application by switching to the <strong>Admin</strong> persona using the Demo Role Switcher at the bottom-left!
            </p>
          </div>
        </div>
      )}

      {status === 'Not Submitted' && (
        <div className="p-5 rounded-2xl bg-blue-50 border border-blue-200 text-blue-950 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-blue-900">
              Action Required: Submit Verification to Publish Courses
            </h4>
            <p className="text-xs text-blue-800 mt-1 leading-relaxed">
              In accordance with our platform business rules, instructors must be approved before courses and batches can go live for student enrollments.
            </p>
          </div>
        </div>
      )}

      {/* Verification Form Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-edge shadow-subtle">
        <VerificationForm
          currentUser={user}
          onSubmit={handleApplicationSubmit}
          isLoading={isSubmitting}
        />
      </div>
    </div>
  );
};

export default InstructorVerificationPage;
