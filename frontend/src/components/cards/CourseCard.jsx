import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Users, CheckCircle, Clock } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import Badge from '../common/Badge';

export const CourseCard = ({ course, batches = [] }) => {
  // Find available batches for this course
  const courseBatches = batches.filter((b) => b.courseId === course.id);
  const activeBatch = courseBatches[0];
  const seatsLeft = activeBatch ? Math.max(0, activeBatch.maxCapacity - activeBatch.enrolledCount) : null;

  return (
    <div className="group flex flex-col bg-white rounded-2xl border border-edge hover:border-gray-300 shadow-subtle hover:shadow-card transition-all duration-200 overflow-hidden">
      {/* Thumbnail */}
      <Link to={`/courses/${course.id}`} className="relative block aspect-[16/10] overflow-hidden bg-gray-100">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <Badge variant="dark" size="sm" className="bg-brand-900/90 backdrop-blur-md text-white border-none font-medium">
            {course.category}
          </Badge>
          {seatsLeft !== null && seatsLeft > 0 && seatsLeft <= 3 && (
            <Badge variant="accent" size="sm" className="bg-amber-100/95 text-amber-900 font-semibold border-amber-300">
              Only {seatsLeft} seats left!
            </Badge>
          )}
        </div>
      </Link>

      {/* Body */}
      <div className="flex-1 flex flex-col p-5">
        {/* Instructor */}
        <Link 
          to={`/instructors/${course.instructorId}`}
          className="flex items-center gap-2 mb-2.5 group/inst"
        >
          <img
            src={course.instructorAvatar}
            alt={course.instructorName}
            className="w-6 h-6 rounded-full object-cover ring-1 ring-edge"
          />
          <span className="text-xs font-medium text-content-body group-hover/inst:text-brand-900 flex items-center gap-1 transition">
            {course.instructorName}
            {course.instructorVerified && (
              <CheckCircle className="w-3.5 h-3.5 text-brand-500 fill-brand-100" />
            )}
          </span>
        </Link>

        {/* Title */}
        <Link to={`/courses/${course.id}`} className="block mb-2">
          <h3 className="text-base font-semibold text-brand-900 line-clamp-2 leading-snug group-hover:text-brand-600 transition">
            {course.title}
          </h3>
        </Link>

        {/* Description snippet */}
        <p className="text-xs text-content-muted line-clamp-2 mb-4 leading-relaxed">
          {course.shortDescription}
        </p>

        {/* Small-Batch Meta Badge */}
        <div className="mt-auto pt-3 border-t border-edge flex items-center justify-between text-xs text-content-muted">
          <div className="flex items-center gap-1.5 font-medium text-brand-800 bg-brand-50/70 px-2.5 py-1 rounded-lg">
            <Users className="w-3.5 h-3.5 text-brand-600" />
            <span>Max {activeBatch ? activeBatch.maxCapacity : '12'} students/batch</span>
          </div>

          <div className="flex items-center gap-1 text-amber-600 font-semibold">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{course.rating.toFixed(1)}</span>
            <span className="text-gray-400 font-normal">({course.reviewsCount})</span>
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="pt-3 mt-2 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold text-brand-900">
                {formatCurrency(course.price)}
              </span>
              {course.originalPrice && (
                <span className="text-xs text-gray-400 line-through">
                  {formatCurrency(course.originalPrice)}
                </span>
              )}
            </div>
            <p className="text-[11px] text-content-muted">Live coaching cohort</p>
          </div>

          <Link
            to={`/courses/${course.id}`}
            className="inline-flex items-center justify-center px-3.5 py-2 text-xs font-semibold rounded-xl bg-brand-50 text-brand-700 hover:bg-brand-500 hover:text-white transition-all shadow-subtle"
          >
            View Batches
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
