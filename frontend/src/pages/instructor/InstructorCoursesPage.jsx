import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { Plus, BookOpen, Layers, Users, Star, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import CourseForm from '../../components/forms/CourseForm';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import EmptyState from '../../components/common/EmptyState';

export const InstructorCoursesPage = () => {
  const { user } = useAuth();
  const { courses, addCourse, deleteCourse } = useStore();
  const { addToast } = useToast();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const myCourses = courses.filter((c) => c.instructorId === user?.id || user?.id === 'user-instructor-1');

  const handleCreateCourse = (courseData) => {
    setIsSubmitting(true);
    setTimeout(() => {
      addCourse(courseData, user);
      setIsSubmitting(false);
      setIsCreateModalOpen(false);
      addToast('Course created and submitted for Admin approval!', 'success');
    }, 600);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-900">My Courses</h1>
          <p className="text-xs text-content-muted mt-1">
            Design small-batch curricula and submit courses for admin approval.
          </p>
        </div>

        <Button
          onClick={() => setIsCreateModalOpen(true)}
          variant="primary"
          size="sm"
          icon={Plus}
        >
          Create New Course
        </Button>
      </div>

      {myCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myCourses.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-2xl border border-edge shadow-subtle overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[16/10] bg-gray-100 overflow-hidden">
                  <img
                    src={c.thumbnail}
                    alt={c.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge
                      variant={c.status === 'Approved' ? 'brand' : c.status === 'Pending Review' ? 'warning' : 'neutral'}
                      size="sm"
                      className="bg-white/95 backdrop-blur-sm"
                    >
                      {c.status}
                    </Badge>
                  </div>
                </div>

                <div className="p-5 space-y-2.5">
                  <span className="text-[11px] font-semibold text-brand-700 uppercase tracking-wider block">
                    {c.category}
                  </span>
                  <h3 className="text-base font-bold text-brand-900 leading-snug line-clamp-2">
                    {c.title}
                  </h3>
                  <p className="text-xs text-content-muted line-clamp-2 leading-relaxed">
                    {c.shortDescription}
                  </p>

                  <div className="pt-2 flex items-center justify-between text-xs text-content-muted border-t border-edge">
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-brand-600" />
                      {c.totalEnrolledStudents || 0} Learners
                    </span>
                    <span className="flex items-center gap-1 font-bold text-brand-900 text-sm">
                      {formatCurrency(c.price)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-surface-subtle border-t border-edge flex items-center justify-between text-xs">
                <Link to={`/courses/${c.id}`} className="font-semibold text-brand-700 hover:text-brand-900">
                  Preview Public View
                </Link>
                <div className="flex items-center gap-1">
                  <Link to="/instructor/batches">
                    <Button variant="outline" size="sm" icon={Layers}>
                      Batches
                    </Button>
                  </Link>
                  <button
                    onClick={() => {
                      if (confirm('Delete this course draft?')) {
                        deleteCourse(c.id);
                        addToast('Course removed.', 'info');
                      }
                    }}
                    className="p-1.5 text-gray-400 hover:text-rose-600 rounded-lg"
                    title="Delete Course"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={BookOpen}
          title="No courses created yet"
          description="Create your first small-batch course curriculum to start accepting cohort enrollments."
          actionLabel="Create Course"
          onAction={() => setIsCreateModalOpen(true)}
        />
      )}

      {/* Course Creation Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Small-Batch Course"
        subtitle="Submitted courses are reviewed by administrators before batches go live."
        maxWidth="max-w-3xl"
      >
        <CourseForm
          onSubmit={handleCreateCourse}
          onCancel={() => setIsCreateModalOpen(false)}
          isLoading={isSubmitting}
        />
      </Modal>
    </div>
  );
};

export default InstructorCoursesPage;
