import React from 'react';
import { Calendar, Clock, Users, CheckCircle2, AlertCircle } from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';
import Button from '../common/Button';
import Badge from '../common/Badge';

export const BatchCard = ({
  batch,
  isSelected = false,
  onSelect,
  onEnroll,
  isEnrolled = false
}) => {
  const seatsLeft = Math.max(0, batch.maxCapacity - batch.enrolledCount);
  const isFull = seatsLeft === 0;
  const fillPercentage = Math.min(100, Math.round((batch.enrolledCount / batch.maxCapacity) * 100));

  return (
    <div
      onClick={() => onSelect && onSelect(batch)}
      className={`relative rounded-2xl border transition-all duration-200 p-5 ${
        isSelected
          ? 'border-brand-500 bg-brand-50/30 ring-2 ring-brand-500/20 shadow-card'
          : 'border-edge bg-white hover:border-gray-300 shadow-subtle'
      } ${onSelect ? 'cursor-pointer' : ''}`}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-base font-semibold text-brand-900">{batch.name}</h4>
            {isSelected && (
              <Badge variant="brand" size="sm">Selected</Badge>
            )}
            {isEnrolled && (
              <Badge variant="success" size="sm" icon={CheckCircle2}>Enrolled</Badge>
            )}
          </div>
          <p className="text-xs text-content-muted">{batch.description}</p>
        </div>

        <div className="text-right shrink-0">
          <span className="text-lg font-bold text-brand-900">{formatCurrency(batch.fee)}</span>
          <span className="block text-[11px] text-content-muted">Full Batch Fee</span>
        </div>
      </div>

      {/* Schedule grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 my-4 p-3 bg-surface-subtle rounded-xl border border-edge text-xs">
        <div className="flex items-center gap-2 text-brand-900">
          <Calendar className="w-4 h-4 text-brand-600 shrink-0" />
          <span>
            <strong className="font-medium text-gray-700">Days:</strong> {batch.daysDisplay || batch.days?.join(', ')}
          </span>
        </div>
        <div className="flex items-center gap-2 text-brand-900">
          <Clock className="w-4 h-4 text-brand-600 shrink-0" />
          <span>
            <strong className="font-medium text-gray-700">Time:</strong> {batch.timing} ({batch.durationMinutes} mins)
          </span>
        </div>
      </div>

      {/* Capacity & Seats Bar */}
      <div className="space-y-1.5 mb-4">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 font-medium text-content-body">
            <Users className="w-3.5 h-3.5 text-brand-600" />
            <span>
              Cohort Size: <strong className="text-brand-900">{batch.enrolledCount} / {batch.maxCapacity}</strong> students
            </span>
          </div>
          <div>
            {isFull ? (
              <span className="text-rose-600 font-semibold flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> Batch Full
              </span>
            ) : seatsLeft <= 3 ? (
              <span className="text-amber-700 font-semibold">
                🔥 Only {seatsLeft} {seatsLeft === 1 ? 'seat' : 'seats'} left!
              </span>
            ) : (
              <span className="text-emerald-700 font-medium">
                {seatsLeft} seats open
              </span>
            )}
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 rounded-full ${
              isFull ? 'bg-rose-500' : fillPercentage > 75 ? 'bg-amber-500' : 'bg-brand-500'
            }`}
            style={{ width: `${fillPercentage}%` }}
          />
        </div>
        <p className="text-[10px] text-content-muted">
          Batch capacity limited to {batch.maxCapacity} for personalized instructor attention.
        </p>
      </div>

      {/* Action CTA */}
      {onEnroll && (
        <div className="pt-2">
          {isEnrolled ? (
            <Button variant="outline" size="sm" className="w-full" disabled>
              You are in this Batch
            </Button>
          ) : isFull ? (
            <Button variant="outline" size="sm" className="w-full" disabled>
              Batch Full (Join Waitlist)
            </Button>
          ) : (
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onEnroll(batch);
              }}
              variant={isSelected ? 'primary' : 'outline'}
              size="sm"
              className="w-full"
            >
              Enroll in this Cohort
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default BatchCard;
