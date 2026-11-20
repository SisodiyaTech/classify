import React, { useState } from 'react';
import { useStore } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { ShieldAlert, CheckCircle2, XCircle, FileText, ExternalLink, User, Eye, Ban } from 'lucide-react';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';

export const AdminInstructorsPage = () => {
  const { users, updateInstructorVerification } = useStore();
  const { addToast } = useToast();

  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  const instructors = users.filter((u) => u.role === 'instructor');

  const filteredInstructors = instructors.filter((inst) => {
    if (filterStatus === 'all') return true;
    return inst.verificationStatus === filterStatus;
  });

  const handleApprove = (instructorId, name) => {
    updateInstructorVerification(instructorId, 'Approved');
    addToast(`${name} has been APPROVED as an instructor! They can now publish live cohorts.`, 'success');
    setSelectedInstructor(null);
  };

  const handleReject = (instructorId, name) => {
    updateInstructorVerification(instructorId, 'Rejected');
    addToast(`${name}'s application was rejected with changes requested.`, 'info');
    setSelectedInstructor(null);
  };

  const handleSuspend = (instructorId, name) => {
    updateInstructorVerification(instructorId, 'Suspended');
    addToast(`${name} has been suspended from publishing batches.`, 'error');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-900">Instructor Management & Verification</h1>
          <p className="text-xs text-content-muted mt-1">
            Review identity proofs, credentials, and grant course publishing privileges.
          </p>
        </div>

        {/* Filter status tabs */}
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-edge text-xs">
          {['all', 'Pending Review', 'Approved', 'Rejected'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                filterStatus === st
                  ? 'bg-brand-500 text-white shadow-subtle'
                  : 'text-content-muted hover:text-brand-900'
              }`}
            >
              {st === 'all' ? 'All Instructors' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Instructors Table */}
      <div className="bg-white rounded-2xl border border-edge shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-edge bg-surface-subtle text-content-muted uppercase tracking-wider text-[11px] font-semibold">
                <th className="py-3.5 px-4">Instructor</th>
                <th className="py-3.5 px-4">Skills / Craft</th>
                <th className="py-3.5 px-4">Experience</th>
                <th className="py-3.5 px-4">Verification Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-edge">
              {filteredInstructors.map((inst) => (
                <tr key={inst.id} className="hover:bg-surface-subtle transition">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={inst.avatar}
                        alt={inst.name}
                        className="w-9 h-9 rounded-xl object-cover ring-1 ring-edge"
                      />
                      <div>
                        <p className="font-semibold text-brand-900">{inst.name}</p>
                        <p className="text-[11px] text-content-muted">{inst.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap gap-1">
                      {inst.skills?.slice(0, 2).map((s, idx) => (
                        <span key={idx} className="px-1.5 py-0.5 rounded bg-gray-100 text-[10px]">
                          {s}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-content-body font-medium">
                    {inst.experienceYears || 5} years
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge
                      variant={
                        inst.verificationStatus === 'Approved'
                          ? 'brand'
                          : inst.verificationStatus === 'Pending Review'
                          ? 'warning'
                          : 'danger'
                      }
                      size="sm"
                    >
                      {inst.verificationStatus || 'Not Submitted'}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        onClick={() => setSelectedInstructor(inst)}
                        variant="outline"
                        size="sm"
                        icon={Eye}
                      >
                        Inspect
                      </Button>

                      {inst.verificationStatus === 'Pending Review' && (
                        <>
                          <Button
                            onClick={() => handleApprove(inst.id, inst.name)}
                            variant="success"
                            size="sm"
                          >
                            Approve
                          </Button>
                          <Button
                            onClick={() => handleReject(inst.id, inst.name)}
                            variant="danger"
                            size="sm"
                          >
                            Reject
                          </Button>
                        </>
                      )}

                      {inst.verificationStatus === 'Approved' && (
                        <button
                          onClick={() => handleSuspend(inst.id, inst.name)}
                          className="p-1.5 text-gray-400 hover:text-rose-600 rounded-lg"
                          title="Suspend Instructor"
                        >
                          <Ban className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspection Modal */}
      {selectedInstructor && (
        <Modal
          isOpen={!!selectedInstructor}
          onClose={() => setSelectedInstructor(null)}
          title={`Review Application: ${selectedInstructor.name}`}
          subtitle={selectedInstructor.headline}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-5 text-xs">
            <div className="p-4 rounded-xl bg-surface-subtle border border-edge space-y-2">
              <h4 className="font-semibold text-brand-900">Instructor Biography</h4>
              <p className="text-content-body leading-relaxed">{selectedInstructor.bio}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3 rounded-xl border border-edge">
              <div>
                <span className="text-content-muted block">Teaching Experience:</span>
                <span className="font-semibold text-brand-900">{selectedInstructor.experienceYears || 8} Years</span>
              </div>
              <div>
                <span className="text-content-muted block">Languages:</span>
                <span className="font-semibold text-brand-900">{selectedInstructor.languages?.join(', ')}</span>
              </div>
            </div>

            {/* Document Inspection */}
            <div className="space-y-2">
              <h4 className="font-semibold text-brand-900 uppercase tracking-wider text-[11px]">
                Submitted Verification Documents
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl border border-edge bg-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-brand-600" />
                    <div>
                      <p className="font-semibold text-brand-900">Government ID Proof</p>
                      <p className="text-[10px] text-content-muted">Passport_Aadhaar.pdf</p>
                    </div>
                  </div>
                  <button
                    onClick={() => alert('Simulating preview of verified identity document.')}
                    className="text-brand-600 hover:text-brand-900 font-semibold"
                  >
                    View
                  </button>
                </div>

                <div className="p-3 rounded-xl border border-edge bg-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-accent-dark" />
                    <div>
                      <p className="font-semibold text-brand-900">Skill / Master Certificate</p>
                      <p className="text-[10px] text-content-muted">Credential_Proof.pdf</p>
                    </div>
                  </div>
                  <button
                    onClick={() => alert('Simulating preview of skill certificate.')}
                    className="text-brand-600 hover:text-brand-900 font-semibold"
                  >
                    View
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-edge">
              <Button onClick={() => setSelectedInstructor(null)} variant="outline" size="sm">
                Close
              </Button>
              <Button
                onClick={() => handleReject(selectedInstructor.id, selectedInstructor.name)}
                variant="danger"
                size="sm"
              >
                Reject Application
              </Button>
              <Button
                onClick={() => handleApprove(selectedInstructor.id, selectedInstructor.name)}
                variant="success"
                size="sm"
                icon={CheckCircle2}
              >
                Approve Instructor
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminInstructorsPage;
