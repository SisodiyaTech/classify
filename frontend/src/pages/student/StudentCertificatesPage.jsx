import React, { useState } from 'react';
import { useStore } from '../../context/AppContext';
import { Award, Download, CheckCircle, ExternalLink, Calendar } from 'lucide-react';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';

export const StudentCertificatesPage = () => {
  const { certificates } = useStore();
  const [selectedCert, setSelectedCert] = useState(null);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-900">Issued Certificates</h1>
        <p className="text-xs text-content-muted mt-1">
          Official credentials verified by your cohort instructors.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {certificates.map((cert) => (
          <div
            key={cert.id}
            className="p-6 rounded-3xl bg-white border border-edge shadow-subtle flex flex-col justify-between space-y-4 hover:border-brand-300 transition"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-accent-light text-accent-dark flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </div>
                <Badge variant="success" size="sm">
                  Verified Credential
                </Badge>
              </div>

              <div>
                <h3 className="text-base font-bold text-brand-900">{cert.courseTitle}</h3>
                <p className="text-xs text-content-muted mt-0.5">
                  Instructor: <strong className="text-brand-900">{cert.instructorName}</strong>
                </p>
              </div>

              <div className="p-3 rounded-xl bg-surface-subtle border border-edge text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-content-muted">Credential ID:</span>
                  <span className="font-mono font-semibold text-brand-900">{cert.credentialId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-content-muted">Issue Date:</span>
                  <span className="font-medium text-brand-900">{cert.issueDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-content-muted">Grade Awarded:</span>
                  <span className="font-bold text-emerald-700">{cert.grade}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-edge">
              <Button
                onClick={() => setSelectedCert(cert)}
                variant="outline"
                size="sm"
                className="flex-1"
              >
                View Certificate
              </Button>
              <Button
                onClick={() => alert(`Downloading certificate PDF for ${cert.credentialId}...`)}
                variant="primary"
                size="sm"
                icon={Download}
              >
                PDF
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Certificate Modal View */}
      {selectedCert && (
        <Modal
          isOpen={!!selectedCert}
          onClose={() => setSelectedCert(null)}
          title="Certificate of Cohort Completion"
          maxWidth="max-w-2xl"
        >
          <div className="p-6 sm:p-10 border-4 border-double border-brand-700 bg-surface-card rounded-2xl text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-accent-light text-accent-dark mx-auto flex items-center justify-center shadow-subtle">
              <Award className="w-8 h-8" />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-brand-600 mb-1">
                Classify Small-Batch Certification
              </p>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-brand-900">
                Certificate of Mastery
              </h2>
              <p className="text-xs text-content-muted mt-1">This is officially presented to</p>
              <p className="text-xl font-bold text-brand-900 font-serif mt-2 border-b-2 border-brand-500 inline-block px-8 pb-1">
                {selectedCert.studentName}
              </p>
            </div>

            <p className="text-xs text-content-body max-w-md mx-auto leading-relaxed">
              for successfully completing all live hands-on coaching sessions, live demonstrations, and project milestones in{' '}
              <strong className="text-brand-900">{selectedCert.courseTitle}</strong> with a grade of{' '}
              <strong className="text-brand-900">{selectedCert.grade}</strong>.
            </p>

            <div className="pt-6 border-t border-edge flex items-center justify-between text-xs text-left">
              <div>
                <p className="text-[10px] text-content-muted uppercase">Verified Instructor</p>
                <p className="font-serif font-bold text-brand-900 text-sm mt-0.5">{selectedCert.instructorName}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-content-muted uppercase">Credential Number</p>
                <p className="font-mono font-semibold text-brand-900 text-xs mt-0.5">{selectedCert.credentialId}</p>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default StudentCertificatesPage;
