import React, { useState } from 'react';
import { useStore } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { BookOpen, CheckCircle2, XCircle, Trash2, Eye, ShieldAlert } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

export const AdminCoursesPage = () => {
  const { courses, updateCourseStatus, deleteCourse } = useStore();
  const { addToast } = useToast();

  const [filter, setFilter] = useState('all');

  const filteredCourses = courses.filter((c) => {
    if (filter === 'all') return true;
    return c.status === filter;
  });

  const handleApprove = (id, title) => {
    updateCourseStatus(id, 'Approved');
    addToast(`"${title}" has been APPROVED and is now live on the marketplace!`, 'success');
  };

  const handleReject = (id, title) => {
    updateCourseStatus(id, 'Rejected');
    addToast(`"${title}" was rejected for policy non-compliance.`, 'info');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-900">Course Moderation & Quality Control</h1>
          <p className="text-xs text-content-muted mt-1">
            Review proposed small-batch courses to ensure high instructional value and safety.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-edge text-xs">
          {['all', 'Pending Review', 'Approved', 'Rejected'].map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                filter === st
                  ? 'bg-brand-500 text-white shadow-subtle'
                  : 'text-content-muted hover:text-brand-900'
              }`}
            >
              {st === 'all' ? 'All Courses' : st}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-edge shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-edge bg-surface-subtle text-content-muted uppercase tracking-wider text-[11px] font-semibold">
                <th className="py-3.5 px-4">Course</th>
                <th className="py-3.5 px-4">Instructor</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Tuition Fee</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-edge">
              {filteredCourses.map((c) => (
                <tr key={c.id} className="hover:bg-surface-subtle transition">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={c.thumbnail}
                        alt={c.title}
                        className="w-12 h-9 rounded-lg object-cover ring-1 ring-edge shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-semibold text-brand-900 truncate max-w-xs">{c.title}</p>
                        <p className="text-[11px] text-content-muted">{c.level} • {c.language}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-brand-900">{c.instructorName}</td>
                  <td className="py-3.5 px-4">
                    <Badge variant="neutral" size="sm">{c.category}</Badge>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-brand-900">{formatCurrency(c.price)}</td>
                  <td className="py-3.5 px-4">
                    <Badge
                      variant={
                        c.status === 'Approved'
                          ? 'brand'
                          : c.status === 'Pending Review'
                          ? 'warning'
                          : 'danger'
                      }
                      size="sm"
                    >
                      {c.status}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {c.status === 'Pending Review' && (
                        <>
                          <Button
                            onClick={() => handleApprove(c.id, c.title)}
                            variant="success"
                            size="sm"
                          >
                            Approve
                          </Button>
                          <Button
                            onClick={() => handleReject(c.id, c.title)}
                            variant="danger"
                            size="sm"
                          >
                            Reject
                          </Button>
                        </>
                      )}
                      {c.status === 'Approved' && (
                        <button
                          onClick={() => handleReject(c.id, c.title)}
                          className="px-2 py-1 text-[11px] font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition"
                        >
                          Delist
                        </button>
                      )}
                      <button
                        onClick={() => {
                          if (confirm(`Delete course "${c.title}" permanently?`)) {
                            deleteCourse(c.id);
                            addToast('Course deleted.', 'info');
                          }
                        }}
                        className="p-1.5 text-gray-400 hover:text-rose-600 rounded-lg"
                        title="Delete Course"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminCoursesPage;
