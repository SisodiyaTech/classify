import React, { useState } from 'react';
import { useStore } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { FileCheck, Upload, CheckCircle2, Clock, Award, FileText } from 'lucide-react';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';

export const StudentAssignmentsPage = () => {
  const { assignments, submitAssignment } = useStore();
  const { addToast } = useToast();

  const [activeModalAsg, setActiveModalAsg] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!selectedFileName) {
      addToast('Please select a file to submit.', 'error');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      submitAssignment(activeModalAsg.id, { fileName: selectedFileName });
      setIsSubmitting(false);
      setActiveModalAsg(null);
      setSelectedFileName('');
      addToast('Assignment submitted successfully!', 'success');
    }, 600);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-900">Assignments & Feedback</h1>
        <p className="text-xs text-content-muted mt-1">
          Submit your hands-on cohort exercises to receive personalized instructor reviews.
        </p>
      </div>

      <div className="space-y-4">
        {assignments.map((asg) => (
          <div
            key={asg.id}
            className="p-5 rounded-2xl bg-white border border-edge shadow-subtle flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          >
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <Badge variant="brand" size="sm">
                  {asg.batchName}
                </Badge>
                {asg.status === 'Graded' && (
                  <Badge variant="success" size="sm">Graded: {asg.grade}</Badge>
                )}
                {asg.status === 'Submitted' && (
                  <Badge variant="accent" size="sm">Under Review</Badge>
                )}
                {asg.status === 'Pending' && (
                  <Badge variant="warning" size="sm">Pending Submission</Badge>
                )}
              </div>

              <h3 className="text-base font-bold text-brand-900">{asg.title}</h3>
              <p className="text-xs text-content-muted leading-relaxed max-w-2xl">
                {asg.description}
              </p>

              {asg.feedback && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 mt-2">
                  <strong className="font-semibold block text-emerald-900 mb-0.5">
                    Instructor Feedback:
                  </strong>
                  "{asg.feedback}"
                </div>
              )}

              {asg.submittedFile && (
                <p className="text-[11px] text-content-muted flex items-center gap-1.5 pt-1">
                  <FileText className="w-3.5 h-3.5 text-brand-600" />
                  Submitted: <span className="font-mono text-brand-900">{asg.submittedFile}</span> on {asg.submittedAt}
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0 w-full md:w-auto border-t md:border-t-0 pt-3 md:pt-0 border-edge">
              <div className="text-left md:text-right text-xs">
                <p className="text-content-muted">Due Date:</p>
                <p className="font-semibold text-brand-900">{asg.dueDate}</p>
              </div>

              {asg.status === 'Pending' ? (
                <Button
                  onClick={() => setActiveModalAsg(asg)}
                  variant="primary"
                  size="sm"
                  icon={Upload}
                >
                  Submit Work
                </Button>
              ) : (
                <Button variant="outline" size="sm" disabled>
                  {asg.status === 'Graded' ? 'Graded ✓' : 'Submitted'}
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Assignment Upload Modal */}
      {activeModalAsg && (
        <Modal
          isOpen={!!activeModalAsg}
          onClose={() => setActiveModalAsg(null)}
          title="Submit Assignment"
          subtitle={activeModalAsg.title}
        >
          <form onSubmit={handleUploadSubmit} className="space-y-4">
            <p className="text-xs text-content-body leading-relaxed bg-surface-subtle p-3 rounded-xl border border-edge">
              {activeModalAsg.description}
            </p>

            <div className="p-6 rounded-2xl border-2 border-dashed border-edge hover:border-brand-400 transition bg-white text-center">
              <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 mx-auto flex items-center justify-center mb-2">
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-xs font-semibold text-brand-900">Choose submission file</p>
              <p className="text-[11px] text-content-muted mb-3">Upload PDF, MP4 clip, or project zip</p>
              
              {selectedFileName ? (
                <div className="inline-flex items-center gap-1.5 text-xs text-emerald-700 font-semibold bg-emerald-50 px-3 py-1 rounded-lg">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {selectedFileName}
                </div>
              ) : (
                <label className="cursor-pointer inline-flex items-center justify-center px-4 py-2 text-xs font-semibold rounded-xl bg-surface-subtle border border-edge hover:bg-gray-100 text-brand-900 transition">
                  <span>Browse Device</span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => setSelectedFileName(e.target.files?.[0]?.name || 'Homework_Submission.pdf')}
                  />
                </label>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" onClick={() => setActiveModalAsg(null)} variant="outline" size="sm">
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" isLoading={isSubmitting}>
                Upload & Confirm Submission
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default StudentAssignmentsPage;
