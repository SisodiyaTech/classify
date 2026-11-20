import React from 'react';
import { Link } from 'react-router-dom';
import { Star, CheckCircle, Users, BookOpen } from 'lucide-react';
import Badge from '../common/Badge';

export const InstructorCard = ({ instructor }) => {
  return (
    <div className="flex flex-col bg-white rounded-2xl border border-edge hover:border-gray-300 p-6 shadow-subtle hover:shadow-card transition-all">
      <div className="flex items-start gap-4 mb-4">
        <img
          src={instructor.avatar}
          alt={instructor.name}
          className="w-16 h-16 rounded-2xl object-cover ring-2 ring-brand-100 shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <h4 className="text-base font-semibold text-brand-900 truncate">
              {instructor.name}
            </h4>
            {instructor.verificationStatus === 'Approved' && (
              <CheckCircle className="w-4 h-4 text-brand-500 fill-brand-100 shrink-0" />
            )}
          </div>
          <p className="text-xs text-brand-700 font-medium truncate mt-0.5">
            {instructor.headline}
          </p>
          <div className="flex items-center gap-2 mt-2 text-xs text-content-muted">
            <div className="flex items-center gap-1 text-amber-600 font-semibold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{instructor.rating || '4.9'}</span>
              <span className="text-gray-400 font-normal">({instructor.totalReviews || 20})</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              <span>{instructor.totalStudents || 50}+ taught</span>
            </div>
          </div>
        </div>
      </div>

      <p className="text-xs text-content-muted line-clamp-3 mb-4 leading-relaxed">
        {instructor.bio}
      </p>

      {/* Skills */}
      <div className="flex flex-wrap gap-1.5 mb-5 mt-auto">
        {instructor.skills?.slice(0, 3).map((skill, i) => (
          <Badge key={i} variant="neutral" size="sm">
            {skill}
          </Badge>
        ))}
      </div>

      <Link
        to={`/instructors/${instructor.id}`}
        className="w-full text-center py-2 px-3 text-xs font-semibold rounded-xl border border-edge text-brand-900 hover:bg-brand-50 hover:border-brand-300 transition"
      >
        View Profile & Classes
      </Link>
    </div>
  );
};

export const ReviewCard = ({ review }) => {
  return (
    <div className="p-5 rounded-2xl border border-edge bg-white shadow-subtle flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-1 text-amber-500 mb-2.5">
          {[...Array(review.rating || 5)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
          ))}
        </div>
        <p className="text-sm text-content-body leading-relaxed italic mb-4">
          "{review.comment}"
        </p>
      </div>

      <div className="flex items-center gap-3 pt-3 border-t border-edge">
        {review.studentAvatar ? (
          <img
            src={review.studentAvatar}
            alt={review.studentName}
            className="w-8 h-8 rounded-full object-cover ring-1 ring-edge"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-xs">
            {review.studentName?.[0]}
          </div>
        )}
        <div className="min-w-0">
          <p className="text-xs font-semibold text-brand-900 truncate">{review.studentName}</p>
          <p className="text-[11px] text-content-muted">{review.date}</p>
        </div>
      </div>
    </div>
  );
};

export default InstructorCard;
