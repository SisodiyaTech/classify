import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../context/AppContext';
import { Calendar, Clock, Video, CheckCircle, Users, AlertCircle } from 'lucide-react';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { Tabs } from '../../components/common/EmptyState';

export const StudentClassesPage = () => {
  const { liveClasses } = useStore();
  const [activeTab, setActiveTab] = useState('upcoming');

  const upcoming = liveClasses.filter((c) => c.status !== 'Completed');
  const completed = liveClasses.filter((c) => c.status === 'Completed');

  const tabs = [
    { id: 'upcoming', label: 'Upcoming Live Classes', count: upcoming.length },
    { id: 'completed', label: 'Completed Classes & Recordings', count: completed.length },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-900">Live Classes Schedule</h1>
        <p className="text-xs text-content-muted mt-1">
          Join your scheduled small-batch sessions. Only enrolled students are eligible to join.
        </p>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === 'upcoming' ? (
        <div className="space-y-4">
          {upcoming.map((cls) => (
            <div
              key={cls.id}
              className="p-5 rounded-2xl bg-white border border-edge shadow-subtle flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
                  <Video className="w-6 h-6 text-brand-500" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="brand" size="sm">
                      {cls.batchName}
                    </Badge>
                    {cls.status === 'Live Now' && (
                      <span className="text-[11px] font-bold text-rose-600 uppercase tracking-wider flex items-center gap-1 animate-pulse">
                        <span className="w-2 h-2 rounded-full bg-rose-500" /> Live Right Now
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-brand-900">{cls.title}</h3>
                  <p className="text-xs text-content-muted mt-1">
                    Instructor: <strong className="text-brand-900">{cls.instructorName}</strong> • {cls.durationMinutes} mins
                  </p>
                  {cls.agenda && (
                    <p className="text-xs text-content-body mt-2 bg-surface-subtle p-2 rounded-lg border border-edge">
                      Agenda: {cls.agenda}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-edge">
                <div className="text-left md:text-right text-xs">
                  <p className="font-semibold text-brand-900 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-brand-600" /> {cls.date}
                  </p>
                  <p className="text-content-muted flex items-center gap-1 mt-0.5">
                    <Clock className="w-3.5 h-3.5 text-brand-600" /> {cls.time}
                  </p>
                </div>

                <Link to={`/classroom/${cls.batchId}`} className="w-full sm:w-auto">
                  <Button variant="primary" size="md" icon={Video} className="w-full">
                    Join Live Class
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {completed.map((cls) => (
            <div
              key={cls.id}
              className="p-5 rounded-2xl bg-white border border-edge shadow-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="neutral" size="sm">
                    {cls.batchName}
                  </Badge>
                  <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Attendance: {cls.attendance || 'Present'}
                  </span>
                </div>
                <h4 className="text-base font-bold text-brand-900">{cls.title}</h4>
                <p className="text-xs text-content-muted mt-0.5">
                  Conducted by {cls.instructorName} • {cls.date}
                </p>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => alert('Accessing archived live recording stream...')}
              >
                Watch Recording
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentClassesPage;
