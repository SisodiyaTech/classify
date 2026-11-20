import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plus, Trash2, Sparkles, BookOpen } from 'lucide-react';
import { mockCategories } from '../../data/mockCourses';
import Input, { Textarea, Select } from '../common/Input';
import Button from '../common/Button';

const courseSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  category: z.string().min(1, 'Please select a category'),
  level: z.string().min(1, 'Please select a difficulty level'),
  language: z.string().min(1, 'Please enter language(s) of instruction'),
  price: z.coerce.number().min(499, 'Minimum course price is ₹499'),
  originalPrice: z.coerce.number().optional(),
  thumbnail: z.string().url('Please enter a valid image URL').or(z.string().min(1, 'Thumbnail is required')),
  shortDescription: z.string().min(20, 'Provide a brief summary (at least 20 chars)'),
  fullDescription: z.string().min(50, 'Provide a full description of the course and why small-batch live interaction matters'),
});

export const CourseForm = ({ initialData, onSubmit, onCancel, isLoading }) => {
  const [learningOutcomes, setLearningOutcomes] = useState(
    initialData?.learningOutcomes || [
      'Master fundamental techniques through live guided practice',
      'Receive direct individual critique on your assignments'
    ]
  );
  const [outcomeInput, setOutcomeInput] = useState('');

  const [curriculum, setCurriculum] = useState(
    initialData?.curriculum || [
      { week: 1, title: 'Orientation & Core Principles', sessions: 2, duration: '90 mins', topics: ['Foundation', 'Live demonstration'] },
      { week: 2, title: 'Hands-on Practice & Feedback', sessions: 2, duration: '90 mins', topics: ['Live student drills', 'Real-time corrections'] }
    ]
  );

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: initialData?.title || '',
      category: initialData?.category || mockCategories[0].name,
      level: initialData?.level || 'Beginner',
      language: initialData?.language || 'English & Hindi',
      price: initialData?.price || 2499,
      originalPrice: initialData?.originalPrice || 3499,
      thumbnail: initialData?.thumbnail || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&auto=format&fit=crop&q=80',
      shortDescription: initialData?.shortDescription || '',
      fullDescription: initialData?.fullDescription || '',
    }
  });

  const handleAddOutcome = () => {
    if (outcomeInput.trim()) {
      setLearningOutcomes([...learningOutcomes, outcomeInput.trim()]);
      setOutcomeInput('');
    }
  };

  const handleRemoveOutcome = (index) => {
    setLearningOutcomes(learningOutcomes.filter((_, i) => i !== index));
  };

  const handleFormSubmit = (data) => {
    const fullCourseData = {
      ...data,
      learningOutcomes,
      curriculum,
      prerequisites: ['Computer or smartphone with webcam', 'Active participation']
    };
    onSubmit(fullCourseData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Basic details */}
      <div className="space-y-4">
        <h4 className="text-sm font-bold text-brand-900 border-b border-edge pb-2">
          Course Overview
        </h4>

        <Input
          label="Course Title"
          placeholder="e.g. Artisanal French Pastry & Croissant Perfection"
          error={errors.title?.message}
          {...register('title')}
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Select
            label="Category"
            error={errors.category?.message}
            options={mockCategories.map((c) => ({ value: c.name, label: c.name }))}
            {...register('category')}
          />

          <Select
            label="Difficulty Level"
            error={errors.level?.message}
            options={[
              { value: 'Beginner', label: 'Beginner Friendly' },
              { value: 'Intermediate', label: 'Intermediate' },
              { value: 'Advanced', label: 'Advanced' },
              { value: 'All Levels', label: 'All Levels Welcome' },
            ]}
            {...register('level')}
          />

          <Input
            label="Teaching Language(s)"
            placeholder="e.g. English, Hindi"
            error={errors.language?.message}
            {...register('language')}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Course Fee (₹ INR)"
            type="number"
            placeholder="2499"
            error={errors.price?.message}
            {...register('price')}
          />

          <Input
            label="Original / Strikey Fee (₹ Optional)"
            type="number"
            placeholder="3999"
            error={errors.originalPrice?.message}
            {...register('originalPrice')}
          />

          <Input
            label="Thumbnail Image URL"
            placeholder="https://images.unsplash.com/..."
            error={errors.thumbnail?.message}
            {...register('thumbnail')}
          />
        </div>

        <Input
          label="Short Elevator Pitch"
          placeholder="One compelling sentence summarizing why this small-batch class is unique..."
          error={errors.shortDescription?.message}
          {...register('shortDescription')}
        />

        <Textarea
          label="Detailed Course Description"
          rows={4}
          placeholder="Describe the curriculum, live coaching format, personal feedback, and who benefits most..."
          error={errors.fullDescription?.message}
          {...register('fullDescription')}
        />
      </div>

      {/* Learning Outcomes */}
      <div className="space-y-3 pt-2">
        <h4 className="text-sm font-bold text-brand-900 border-b border-edge pb-2">
          What Students Will Learn
        </h4>
        <div className="flex gap-2">
          <input
            type="text"
            value={outcomeInput}
            onChange={(e) => setOutcomeInput(e.target.value)}
            placeholder="Add a key skill or takeaway..."
            className="flex-1 rounded-xl border border-edge px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddOutcome();
              }
            }}
          />
          <Button type="button" onClick={handleAddOutcome} variant="outline" size="sm" icon={Plus}>
            Add Skill
          </Button>
        </div>

        <div className="space-y-2 mt-2">
          {learningOutcomes.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-surface-subtle border border-edge text-xs">
              <span className="font-medium text-brand-900">✓ {item}</span>
              <button
                type="button"
                onClick={() => handleRemoveOutcome(idx)}
                className="text-gray-400 hover:text-rose-600 transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-edge">
        {onCancel && (
          <Button type="button" onClick={onCancel} variant="outline">
            Cancel
          </Button>
        )}
        <Button type="submit" variant="primary" isLoading={isLoading} icon={Sparkles}>
          Submit Course for Approval
        </Button>
      </div>
    </form>
  );
};

export default CourseForm;
