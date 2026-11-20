import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useStore } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Star, 
  Users, 
  Calendar, 
  Clock, 
  CheckCircle, 
  ShieldCheck, 
  BookOpen, 
  ChevronRight, 
  ArrowRight,
  Layers,
  Sparkles,
  Award
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { mockReviews } from '../../data/mockEnrollments';
import BatchCard from '../../components/cards/BatchCard';
import EnrollmentModal from '../../components/forms/EnrollmentModal';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

export const CourseDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { courses, batches, enrollments } = useStore();
  const { user } = useAuth();

  const course = courses.find((c) => c.id === id) || courses[0];
  const courseBatches = batches.filter((b) => b.courseId === course.id);

  // Selected batch for enrollment
  const [selectedBatch, setSelectedBatch] = useState(courseBatches[0] || null);
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);

  // Check if current logged-in user is already enrolled
  const isEnrolledInCourse = enrollments.some(
    (e) => e.courseId === course.id && e.studentId === user?.id
  );

  const reviews = mockReviews.filter((r) => r.courseId === course.id || course.id === 'course-1');

  const handleEnrollClick = (batchToEnroll) => {
    if (batchToEnroll) {
      setSelectedBatch(batchToEnroll);
    }
    setIsEnrollModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-content-muted">
        <Link to="/" className="hover:text-brand-900 transition">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <Link to="/courses" className="hover:text-brand-900 transition">Courses</Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-brand-900 font-medium truncate">{course.title}</span>
      </nav>

      {/* Hero Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        {/* Left 2 Cols: Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="dark" size="md">
              {course.category}
            </Badge>
            <Badge variant="brand" size="md">
              {course.level}
            </Badge>
            <Badge variant="accent" size="md">
              {course.language}
            </Badge>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-brand-900 leading-tight">
            {course.title}
          </h1>

          <p className="text-base text-content-body leading-relaxed">
            {course.shortDescription}
          </p>

          {/* Instructor Quick Banner */}
          <Link
            to={`/instructors/${course.instructorId}`}
            className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-edge hover:border-brand-300 shadow-subtle transition group"
          >
            <img
              src={course.instructorAvatar}
              alt={course.instructorName}
              className="w-12 h-12 rounded-xl object-cover ring-1 ring-edge shrink-0"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-semibold text-brand-900 group-hover:text-brand-600 transition">
                  {course.instructorName}
                </span>
                {course.instructorVerified && (
                  <CheckCircle className="w-4 h-4 text-brand-500 fill-brand-100" />
                )}
              </div>
              <p className="text-xs text-content-muted truncate mt-0.5">
                {course.instructorHeadline}
              </p>
            </div>
            <div className="text-right shrink-0 pr-2">
              <div className="flex items-center gap-1 text-amber-600 font-bold text-sm">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{course.rating.toFixed(1)}</span>
              </div>
              <span className="text-[11px] text-content-muted">
                {course.reviewsCount} reviews
              </span>
            </div>
          </Link>

          {/* Course Description */}
          <div className="bg-white p-6 rounded-2xl border border-edge shadow-subtle space-y-4">
            <h3 className="text-lg font-bold text-brand-900">Why Learn in this Cohort?</h3>
            <div className="text-sm text-content-body leading-relaxed whitespace-pre-line">
              {course.fullDescription}
            </div>
          </div>

          {/* Learning Outcomes */}
          <div className="bg-white p-6 rounded-2xl border border-edge shadow-subtle space-y-4">
            <h3 className="text-lg font-bold text-brand-900">What You Will Master</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {course.learningOutcomes?.map((outcome, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-brand-900 font-medium">
                  <div className="p-1 rounded-md bg-emerald-50 text-emerald-600 shrink-0 mt-0.5">
                    <CheckCircle className="w-3.5 h-3.5" />
                  </div>
                  <span className="leading-relaxed">{outcome}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Course Syllabus */}
          <div className="bg-white p-6 rounded-2xl border border-edge shadow-subtle space-y-4">
            <h3 className="text-lg font-bold text-brand-900">Cohort Syllabus & Roadmap</h3>
            <div className="space-y-3">
              {course.curriculum?.map((mod, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-surface-subtle border border-edge text-xs space-y-2">
                  <div className="flex items-center justify-between font-semibold text-brand-900">
                    <span className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-brand-100 text-brand-800 flex items-center justify-center text-xs">
                        {mod.week}
                      </span>
                      {mod.title}
                    </span>
                    <span className="text-content-muted text-[11px]">
                      {mod.sessions} Live Sessions • {mod.duration}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pl-8">
                    {mod.topics?.map((top, tIdx) => (
                      <span key={tIdx} className="px-2 py-0.5 rounded-md bg-white border border-edge text-content-body text-[11px]">
                        {top}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Sticky Available Batches & Enroll Card */}
        <div className="space-y-6 lg:sticky lg:top-24">
          <div className="bg-white rounded-2xl border border-edge shadow-elevated p-6 space-y-6">
            <div className="aspect-[16/9] rounded-xl overflow-hidden bg-gray-100">
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-brand-900">
                  {formatCurrency(course.price)}
                </span>
                {course.originalPrice && (
                  <span className="text-sm text-gray-400 line-through">
                    {formatCurrency(course.originalPrice)}
                  </span>
                )}
              </div>
              <p className="text-xs text-content-muted mt-0.5">
                Full cohort access • Live video coaching + direct feedback
              </p>
            </div>

            {/* Available Batches Selector */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-brand-900">
                  Available Batches ({courseBatches.length})
                </h4>
                <span className="text-[10px] text-content-muted">
                  Max 50 / Batch
                </span>
              </div>

              <div className="space-y-3">
                {courseBatches.map((batch) => (
                  <BatchCard
                    key={batch.id}
                    batch={batch}
                    isSelected={selectedBatch?.id === batch.id}
                    onSelect={(b) => setSelectedBatch(b)}
                    isEnrolled={enrollments.some((e) => e.batchId === batch.id && e.studentId === user?.id)}
                  />
                ))}
              </div>
            </div>

            {/* Main Action Button */}
            {isEnrolledInCourse ? (
              <div className="space-y-2">
                <Link to="/student/courses" className="block">
                  <Button variant="secondary" size="lg" className="w-full">
                    View in My Learning
                  </Button>
                </Link>
                <p className="text-[11px] text-center text-emerald-700 font-semibold">
                  ✓ You are already enrolled in this course
                </p>
              </div>
            ) : (
              <Button
                onClick={() => handleEnrollClick(selectedBatch)}
                variant="primary"
                size="lg"
                className="w-full"
                iconRight={ArrowRight}
                disabled={!selectedBatch}
              >
                Enroll in {selectedBatch?.name || 'Cohort'}
              </Button>
            )}

            <div className="pt-2 text-center space-y-1 text-[11px] text-content-muted">
              <p>🔒 100% money-back guarantee after Session 1</p>
              <p>👥 High personal attention: 10-15 students per cohort</p>
            </div>
          </div>
        </div>
      </div>

      {/* Student Reviews Section */}
      <section className="bg-white rounded-2xl border border-edge p-8 shadow-subtle space-y-6">
        <div className="flex items-center justify-between border-b border-edge pb-4">
          <div>
            <h3 className="text-xl font-bold text-brand-900">Student Reviews & Feedback</h3>
            <p className="text-xs text-content-muted mt-0.5">
              Verified reviews from students who completed live small-batch sessions.
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-amber-600 font-bold text-lg">
            <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
            <span>{course.rating.toFixed(1)}</span>
            <span className="text-xs text-content-muted font-normal">
              ({course.reviewsCount} reviews)
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {reviews.map((rev) => (
            <div key={rev.id} className="p-4 rounded-xl bg-surface-subtle border border-edge text-xs space-y-3">
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(rev.rating)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-content-body italic leading-relaxed">
                "{rev.comment}"
              </p>
              <div className="pt-2 border-t border-edge/60 flex items-center justify-between text-[11px] text-content-muted">
                <span className="font-semibold text-brand-900">{rev.studentName}</span>
                <span>{rev.date}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Enrollment Checkout Modal */}
      <EnrollmentModal
        isOpen={isEnrollModalOpen}
        onClose={() => setIsEnrollModalOpen(false)}
        course={course}
        batch={selectedBatch}
      />
    </div>
  );
};

export default CourseDetailsPage;
