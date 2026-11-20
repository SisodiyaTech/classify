import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { Plus, Layers, Users, Calendar, Clock, Video, AlertCircle, CheckCircle2 } from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';
import BatchForm from '../../components/forms/BatchForm';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import EmptyState from '../../components/common/EmptyState';

export const InstructorBatchesPage = () => {
  const { user } = useAuth();
  const { batches, courses, addBatch } = useStore();
  const { addToast } = useToast();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const myCourses = courses.filter((c) => c.instructorId === user?.id || user?.id === 'user-instructor-1');
  const myBatches = batches.filter((b) => b.instructorId === user?.id || user?.id === 'user-instructor-1');

  const handleCreateBatch = (batchData) => {
    const relatedCourse = courses.find((c) => c.id === batchData.courseId) || myCourses[0];
    if (!relatedCourse) {
      addToast('Please select or create an approved course first.', 'error');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      addBatch(batchData, relatedCourse, user);
      setIsSubmitting(false);
      setIsCreateModalOpen(false);
      addToast(`Batch ${batchData.name} created successfully!`, 'success');
    }, 600);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-900">Manage Cohorts & Batches</h1>
          <p className="text-xs text-content-muted mt-1">
            Schedule live class days, set cohort capacities (Max 50, Recommended 10–15), and track seat fills.
          </p>
        </div>

        <Button
          onClick={() => setIsCreateModalOpen(true)}
          variant="primary"
          size="sm"
          icon={Plus}
        >
          Schedule New Batch
        </Button>
      </div>

      {/* Batch Rules Banner */}
      <div className="p-4 rounded-2xl bg-brand-50 border border-brand-200 text-xs text-brand-900 flex items-start gap-3">
        <Users className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="font-semibold block text-sm mb-0.5">Small-Batch Quality Guarantee</strong>
          Classify batches are capped at a maximum of 50 students by system policy. We strongly recommend cohorts of 10 to 15 learners for superior engagement and student success.
        </div>
      </div>

      {myBatches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {myBatches.map((batch) => {
            const seatsLeft = Math.max(0, batch.maxCapacity - batch.enrolledCount);
            const fillPct = Math.round((batch.enrolledCount / batch.maxCapacity) * 100);

            return (
              <div
                key={batch.id}
                className="p-6 rounded-2xl bg-white border border-edge shadow-subtle flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Badge variant="brand" size="sm" className="mb-1">
                        {batch.status}
                      </Badge>
                      <h3 className="text-base font-bold text-brand-900">{batch.name}</h3>
                      <p className="text-xs text-brand-700 font-medium">{batch.courseTitle}</p>
                    </div>
                    <span className="text-base font-bold text-brand-900">
                      {formatCurrency(batch.fee)}
                    </span>
                  </div>

                  {/* Schedule details */}
                  <div className="p-3 rounded-xl bg-surface-subtle border border-edge text-xs space-y-1.5">
                    <div className="flex items-center gap-2 text-content-body">
                      <Calendar className="w-3.5 h-3.5 text-brand-600" />
                      <span>{batch.daysDisplay} ({batch.startDate} to {batch.endDate})</span>
                    </div>
                    <div className="flex items-center gap-2 text-content-body">
                      <Clock className="w-3.5 h-3.5 text-brand-600" />
                      <span>{batch.timing} • {batch.durationMinutes} mins / session</span>
                    </div>
                  </div>

                  {/* Capacity progress */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-content-muted">Enrollment Fill:</span>
                      <span className="font-bold text-brand-900">
                        {batch.enrolledCount} / {batch.maxCapacity} students ({seatsLeft} open)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          fillPct > 80 ? 'bg-amber-500' : 'bg-brand-500'
                        }`}
                        style={{ width: `${fillPct}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-edge flex items-center justify-between text-xs">
                  <span className="text-content-muted">
                    Revenue: <strong className="text-brand-900">{formatCurrency(batch.enrolledCount * batch.fee)}</strong>
                  </span>
                  <a href={`/classroom/${batch.id}`}>
                    <Button variant="primary" size="sm" icon={Video}>
                      Launch Room
                    </Button>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={Layers}
          title="No batches scheduled yet"
          description="Create your first cohort schedule and set seat capacities for students to join."
          actionLabel="Schedule Batch"
          onAction={() => setIsCreateModalOpen(true)}
        />
      )}

      {/* Batch Creation Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Schedule New Cohort Batch"
        subtitle="Set batch name, calendar dates, days of week, and capacity (Max 50)."
        maxWidth="max-w-2xl"
      >
        <BatchForm
          courses={myCourses}
          onSubmit={handleCreateBatch}
          onCancel={() => setIsCreateModalOpen(false)}
          isLoading={isSubmitting}
        />
      </Modal>
    </div>
  );
};

export default InstructorBatchesPage;
