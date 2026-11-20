import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore } from '../../context/AppContext';
import { mockUsers } from '../../data/mockUsers';
import { 
  Star, 
  CheckCircle, 
  Users, 
  Calendar, 
  Award, 
  Globe, 
  BookOpen, 
  ShieldCheck, 
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import CourseCard from '../../components/cards/CourseCard';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';

export const InstructorProfilePage = () => {
  const { id } = useParams();
  const { courses, batches } = useStore();

  const instructor = mockUsers.find((u) => u.id === id) || mockUsers[1];
  const instructorCourses = courses.filter((c) => c.instructorId === instructor.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-content-muted">
        <Link to="/" className="hover:text-brand-900 transition">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <Link to="/courses" className="hover:text-brand-900 transition">Instructors</Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-brand-900 font-medium truncate">{instructor.name}</span>
      </nav>

      {/* Instructor Banner Card */}
      <div className="bg-white rounded-3xl border border-edge p-6 sm:p-8 shadow-subtle flex flex-col md:flex-row items-start gap-8">
        <img
          src={instructor.avatar}
          alt={instructor.name}
          className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl object-cover ring-4 ring-brand-50 shadow-md shrink-0"
        />

        <div className="flex-1 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-brand-900">
                  {instructor.name}
                </h1>
                {instructor.verificationStatus === 'Approved' && (
                  <Badge variant="brand" size="sm" icon={ShieldCheck}>
                    Verified Instructor
                  </Badge>
                )}
              </div>
              <p className="text-sm font-semibold text-brand-700 mt-1">
                {instructor.headline}
              </p>
            </div>

            <div className="flex items-center gap-4 bg-surface-subtle p-3 rounded-2xl border border-edge text-center">
              <div>
                <div className="flex items-center justify-center gap-1 text-amber-600 font-bold text-base">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{instructor.rating || 4.9}</span>
                </div>
                <span className="text-[10px] text-content-muted">
                  {instructor.totalReviews || 40} Reviews
                </span>
              </div>
              <div className="w-px h-8 bg-edge" />
              <div>
                <p className="font-bold text-base text-brand-900">
                  {instructor.totalStudents || 120}+
                </p>
                <span className="text-[10px] text-content-muted">Students Taught</span>
              </div>
              <div className="w-px h-8 bg-edge" />
              <div>
                <p className="font-bold text-base text-brand-900">
                  {instructor.experienceYears || 8} yrs
                </p>
                <span className="text-[10px] text-content-muted">Experience</span>
              </div>
            </div>
          </div>

          <p className="text-sm text-content-body leading-relaxed max-w-3xl">
            {instructor.bio}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-content-muted">
            <span className="flex items-center gap-1.5 font-medium text-brand-900">
              <Globe className="w-3.5 h-3.5 text-brand-600" />
              {instructor.languages?.join(', ')}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 font-medium text-brand-900">
              <Calendar className="w-3.5 h-3.5 text-brand-600" />
              Teaching on Classify since {instructor.joinedDate}
            </span>
          </div>

          {/* Skills tags */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {instructor.skills?.map((skill, idx) => (
              <Badge key={idx} variant="neutral" size="sm">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Courses Offered */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-brand-900">
            Courses Offered by {instructor.name.split(' ')[0]}
          </h2>
          <p className="text-xs text-content-muted mt-1">
            Explore active cohorts with available seats. Max 10–15 students per batch.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {instructorCourses.map((course) => (
            <CourseCard key={course.id} course={course} batches={batches} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default InstructorProfilePage;
