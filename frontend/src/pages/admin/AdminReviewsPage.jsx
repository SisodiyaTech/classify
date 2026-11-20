import React from 'react';
import { useToast } from '../../context/ToastContext';

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

export default AdminReviewsPage;
