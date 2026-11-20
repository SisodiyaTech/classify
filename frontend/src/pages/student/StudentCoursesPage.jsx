import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/AppContext';
import { BookOpen, Calendar, Video, ArrowRight, CheckCircle2 } from 'lucide-react';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';

export const StudentCoursesPage = () => {
  const { user } = useAuth();
  const { enrollments, courses } = useStore();

  const studentEnrollments = enrollments.filter(
    (e) => e.studentId === user?.id || !e.studentId
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-900">My Learning & Cohorts</h1>
          <p className="text-xs text-content-muted mt-1">
            Track your ongoing small-batch live classes and access class materials.
          </p>
        </div>
        <Link to="/courses">
          <Button variant="outline" size="sm" iconRight={ArrowRight}>
            Explore More Cohorts
          </Button>
        </Link>
      </div>

      {studentEnrollments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {studentEnrollments.map((enr) => {
            const courseDetails = courses.find((c) => c.id === enr.courseId);
            return (
              <div
                key={enr.id}
                className="bg-white rounded-2xl border border-edge shadow-subtle overflow-hidden flex flex-col justify-between"
              >
                <div className="p-5 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <Badge variant="brand" size="sm">
                      {enr.batchName}
                    </Badge>
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      Enrolled & Active
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-brand-900 leading-snug">
                      {enr.courseTitle}
                    </h3>
                    <p className="text-xs text-content-muted mt-0.5">
                      Taught by: <strong className="text-brand-900">{enr.instructorName}</strong>
                    </p>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-content-muted">Learning Progress</span>
                      <span className="font-semibold text-brand-900">
                        {enr.progressPercentage || 50}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-brand-500 rounded-full"
                        style={{ width: `${enr.progressPercentage || 50}%` }}
                      />
                    </div>
                  </div>

                  {/* Next session card */}
                  {enr.nextClass && (
                    <div className="p-3 rounded-xl bg-surface-subtle border border-edge text-xs space-y-1">
                      <p className="font-semibold text-brand-900 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-brand-600" />
                        Next Live Class:
                      </p>
                      <p className="text-content-muted text-[11px] pl-5">
                        {enr.nextClass.title} • {enr.nextClass.date} ({enr.nextClass.time})
                      </p>
                    </div>
                  )}
                </div>

                {/* Card Actions */}
                <div className="p-4 bg-surface-subtle/60 border-t border-edge flex items-center justify-between gap-2">
                  <Link to={`/courses/${enr.courseId}`} className="text-xs font-semibold text-content-muted hover:text-brand-900">
                    Syllabus Details
                  </Link>
                  <Link to={`/classroom/${enr.batchId}`}>
                    <Button variant="primary" size="sm" icon={Video}>
                      Enter Classroom
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={BookOpen}
          title="You haven't enrolled in any cohorts yet"
          description="Browse our small-batch directory to learn skills from artisanal baking to coding."
          actionLabel="Explore Classes"
          onAction={() => (window.location.href = '/courses')}
        />
      )}
    </div>
  );
};

export default StudentCoursesPage;
