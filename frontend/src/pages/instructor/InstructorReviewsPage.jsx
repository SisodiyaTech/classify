import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/AppContext';
import { Star, MessageSquare } from 'lucide-react';
import { mockReviews } from '../../data/mockEnrollments';
import { ReviewCard } from '../../components/cards/InstructorCard';

export const InstructorReviewsPage = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-900">Student Reviews & Ratings</h1>
          <p className="text-xs text-content-muted mt-1">
            Read feedback from learners who attended your live small-batch sessions.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-edge shadow-subtle text-amber-600 font-bold">
          <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
          <span className="text-lg">{user?.rating || 4.95}</span>
          <span className="text-xs text-content-muted font-normal">({user?.totalReviews || 40} reviews)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockReviews.map((rev) => (
          <ReviewCard key={rev.id} review={rev} />
        ))}
      </div>
    </div>
  );
};

export default InstructorReviewsPage;
