import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Users, Info, Calendar } from 'lucide-react';
import Input, { Textarea, Select } from '../common/Input';
import Button from '../common/Button';

const batchSchema = z.object({
  name: z.string().min(3, 'Batch name must be at least 3 characters'),
  courseId: z.string().min(1, 'Please select a course'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  timing: z.string().min(3, 'Class timing is required (e.g. 10:00 AM - 11:30 AM IST)'),
  durationMinutes: z.coerce.number().min(30, 'Minimum class duration is 30 mins').max(180, 'Maximum duration is 180 mins'),
  fee: z.coerce.number().min(499, 'Minimum batch fee is ₹499'),
  maxCapacity: z.coerce
    .number()
    .min(3, 'Minimum batch size is 3 students')
    .max(50, 'Strict business rule: Maximum batch capacity cannot exceed 50 students'),
  description: z.string().optional()
});

const ALL_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const BatchForm = ({ courses = [], initialData, onSubmit, onCancel, isLoading }) => {
  const [selectedDays, setSelectedDays] = useState(
    initialData?.days || ['Saturday', 'Sunday']
  );

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(batchSchema),
    defaultValues: {
      name: initialData?.name || 'Weekend Cohort #1',
      courseId: initialData?.courseId || (courses[0]?.id || ''),
      startDate: initialData?.startDate || '2026-12-01',
      endDate: initialData?.endDate || '2026-12-28',
      timing: initialData?.timing || '10:00 AM - 11:30 AM IST',
      durationMinutes: initialData?.durationMinutes || 90,
      fee: initialData?.fee || 2999,
      maxCapacity: initialData?.maxCapacity || 12, // Recommended default 10-15!
      description: initialData?.description || 'Weekend live batch with direct hands-on coaching and Q&A.'
    }
  });

  const currentCapacity = watch('maxCapacity');

  const toggleDay = (day) => {
    if (selectedDays.includes(day)) {
      if (selectedDays.length > 1) {
        setSelectedDays(selectedDays.filter((d) => d !== day));
      }
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const handleFormSubmit = (data) => {
    const selectedCourse = courses.find((c) => c.id === data.courseId);
    onSubmit({
      ...data,
      courseTitle: selectedCourse?.title || '',
      days: selectedDays,
      daysDisplay: selectedDays.length === 2 && selectedDays.includes('Saturday') && selectedDays.includes('Sunday')
        ? 'Sat & Sun'
        : selectedDays.map((d) => d.substring(0, 3)).join(', ')
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
      <div className="space-y-4">
        {/* Course Selector */}
        <Select
          label="Related Course"
          error={errors.courseId?.message}
          options={courses.map((c) => ({ value: c.id, label: `${c.title} (${c.category})` }))}
          {...register('courseId')}
        />

        {/* Batch Name */}
        <Input
          label="Batch / Cohort Name"
          placeholder="e.g. Evening FastTrack Circle #2"
          error={errors.name?.message}
          {...register('name')}
        />

        {/* Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Cohort Start Date"
            type="date"
            error={errors.startDate?.message}
            {...register('startDate')}
          />
          <Input
            label="Cohort End Date"
            type="date"
            error={errors.endDate?.message}
            {...register('endDate')}
          />
        </div>

        {/* Days of Week Selector */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-content-body uppercase tracking-wider">
            Live Class Days
          </label>
          <div className="flex flex-wrap gap-2">
            {ALL_DAYS.map((day) => {
              const isSelected = selectedDays.includes(day);
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleDay(day)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-brand-500 text-white border-brand-500 shadow-subtle'
                      : 'bg-white text-content-body border-edge hover:border-gray-300'
                  }`}
                >
                  {day.substring(0, 3)}
                </button>
              );
            })}
          </div>
        </div>

        {/* Timing & Duration */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Live Class Timing"
            placeholder="e.g. 07:00 PM - 08:30 PM IST"
            error={errors.timing?.message}
            {...register('timing')}
          />
          <Input
            label="Session Duration (Minutes)"
            type="number"
            placeholder="90"
            error={errors.durationMinutes?.message}
            {...register('durationMinutes')}
          />
        </div>

        {/* Fee & Capacity */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Batch Enrollment Fee (₹ INR)"
            type="number"
            placeholder="2999"
            error={errors.fee?.message}
            {...register('fee')}
          />

          <div>
            <Input
              label="Maximum Batch Capacity"
              type="number"
              placeholder="12"
              error={errors.maxCapacity?.message}
              helperText="Hard Platform Cap: 50 students. Recommended: 10–15 students."
              {...register('maxCapacity')}
            />
          </div>
        </div>

        {/* Capacity guidance banner */}
        <div className={`p-3.5 rounded-xl border text-xs flex items-start gap-2.5 ${
          currentCapacity > 20
            ? 'bg-amber-50 border-amber-200 text-amber-900'
            : 'bg-emerald-50 border-emerald-200 text-emerald-900'
        }`}>
          <Users className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="font-semibold">
              {currentCapacity <= 15 ? 'Optimal Small-Batch Size:' : 'High Capacity Batch:'}
            </strong>{' '}
            {currentCapacity <= 15
              ? `A cohort of ${currentCapacity} allows meaningful 1-on-1 interaction, individual audio-video feedback, and higher completion rates.`
              : `Batches above 20 may reduce individual question time. Note that maximum capacity cannot exceed 50 students.`}
          </div>
        </div>

        <Textarea
          label="Batch Notes & Description"
          rows={3}
          placeholder="Special notes regarding batch schedule, homework rhythm, or target learners..."
          {...register('description')}
        />
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-edge">
        {onCancel && (
          <Button type="button" onClick={onCancel} variant="outline">
            Cancel
          </Button>
        )}
        <Button type="submit" variant="primary" isLoading={isLoading}>
          Create & Schedule Cohort
        </Button>
      </div>
    </form>
  );
};

export default BatchForm;
