import React, { useState } from 'react';
import { useStore } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { FileCheck, CheckCircle2, MessageSquare, Download, Award } from 'lucide-react';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import Input, { Textarea } from '../../components/common/Input';

export const InstructorAssignmentsPage = () => {
  const { assignments } = useStore();
  const { addToast } = useToast();

  const [selectedAsg, setSelectedAsg] = useState(null);
  const [gradeInput, setGradeInput] = useState('95 / 100');
  const [feedbackInput, setFeedbackInput] = useState('');

  const handleGradeSubmit = (e) => {
    e.preventDefault();
    addToast(`Feedback and grade recorded for ${selectedAsg.studentName || 'student'}!`, 'success');
    setSelectedAsg(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-900">Student Assignment Submissions</h1>
        <p className="text-xs text-content-muted mt-1">
          Review homework videos, sourdough rise logs, and code repos submitted by your cohorts.
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
                {asg.status === 'Graded' ? (
                  <Badge variant="success" size="sm">Graded: {asg.grade}</Badge>
                ) : (
                  <Badge variant="warning" size="sm">Needs Review</Badge>
                )}
              </div>

              <h3 className="text-base font-bold text-brand-900">{asg.title}</h3>
              <p className="text-xs text-content-muted">{asg.description}</p>

              {asg.submittedFile && (
                <div className="p-2.5 rounded-xl bg-surface-subtle border border-edge text-xs inline-flex items-center gap-2">
                  <span className="font-semibold text-brand-900">Submitted File:</span>
                  <span className="font-mono text-content-muted">{asg.submittedFile}</span>
                  <button
                    onClick={() => alert(`Downloading ${asg.submittedFile}...`)}
                    className="text-brand-600 hover:text-brand-800 font-bold ml-2"
                  >
                    Download
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Button
                onClick={() => {
                  setSelectedAsg(asg);
                  setFeedbackInput(asg.feedback || '');
                }}
                variant={asg.status === 'Graded' ? 'outline' : 'primary'}
                size="sm"
                icon={MessageSquare}
              >
                {asg.status === 'Graded' ? 'Edit Feedback' : 'Grade Submission'}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Grading Modal */}
      {selectedAsg && (
        <Modal
          isOpen={!!selectedAsg}
          onClose={() => setSelectedAsg(null)}
          title="Grade Student Assignment"
          subtitle={selectedAsg.title}
        >
          <form onSubmit={handleGradeSubmit} className="space-y-4">
            <Input
              label="Assigned Score / Grade"
              value={gradeInput}
              onChange={(e) => setGradeInput(e.target.value)}
              placeholder="e.g. 95 / 100 or Distinction"
              required
            />

            <Textarea
              label="Personalized Feedback & Video Critique Notes"
              rows={4}
              value={feedbackInput}
              onChange={(e) => setFeedbackInput(e.target.value)}
              placeholder="Provide encouraging, actionable tips for the student..."
              required
            />

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" onClick={() => setSelectedAsg(null)} variant="outline" size="sm">
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm">
                Save & Notify Student
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default InstructorAssignmentsPage;
