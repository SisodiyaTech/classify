import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/AppContext';
import { Calendar, Clock, Video, Users, CheckCircle, ArrowRight, Plus } from 'lucide-react';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

export const InstructorClassesPage = () => {
  const { user } = useAuth();
  const { liveClasses } = useStore();

  const myClasses = liveClasses.filter(
    (c) => c.instructorId === user?.id || user?.id === 'user-instructor-1'
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-900">Live Classroom Sessions</h1>
          <p className="text-xs text-content-muted mt-1">
            Conduct your scheduled video sessions. Only assigned instructors can launch sessions.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {myClasses.map((cls) => (
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
                      <span className="w-2 h-2 rounded-full bg-rose-500" /> Live In Session
                    </span>
                  )}
                </div>
                <h3 className="text-base font-bold text-brand-900">{cls.title}</h3>
                <p className="text-xs text-content-muted mt-1 flex items-center gap-2">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-brand-600" /> {cls.date}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-brand-600" /> {cls.time} ({cls.durationMinutes}m)
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto justify-end border-t md:border-t-0 pt-3 md:pt-0 border-edge">
              <div className="text-right text-xs pr-2 hidden sm:block">
                <span className="text-content-muted">Enrolled Attendees:</span>
                <p className="font-bold text-brand-900">{cls.participantsCount || 10} Students</p>
              </div>

              <Link to={`/classroom/${cls.batchId}`} className="w-full sm:w-auto">
                <Button variant="primary" size="md" icon={Video} className="w-full">
                  Start Live Class
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InstructorClassesPage;
