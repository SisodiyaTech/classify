import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Upload, FileText, CheckCircle2, Video, ShieldCheck, AlertCircle } from 'lucide-react';
import Input, { Textarea } from '../common/Input';
import Button from '../common/Button';

const verificationSchema = z.object({
  fullName: z.string().min(3, 'Full name is required'),
  headline: z.string().min(5, 'Professional headline is required (e.g. Sourdough Consultant)'),
  bio: z.string().min(30, 'Biography must be at least 30 characters explaining your craft'),
  skills: z.string().min(3, 'List at least one skill or topic you teach'),
  experienceYears: z.coerce.number().min(1, 'Please specify your years of experience'),
  languages: z.string().min(2, 'Languages of instruction (e.g. Hindi, English)'),
  videoIntroUrl: z.string().optional(),
});

export const VerificationForm = ({ currentUser, onSubmit, isLoading }) => {
  const [govIdFile, setGovIdFile] = useState(null);
  const [certFile, setCertFile] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      fullName: currentUser?.name || '',
      headline: currentUser?.headline || '',
      bio: currentUser?.bio || '',
      skills: currentUser?.skills ? currentUser.skills.join(', ') : '',
      experienceYears: currentUser?.experienceYears || 5,
      languages: currentUser?.languages ? currentUser.languages.join(', ') : 'English, Hindi',
      videoIntroUrl: currentUser?.videoIntroUrl || ''
    }
  });

  const handleFormSubmit = (data) => {
    onSubmit({
      ...data,
      skills: data.skills.split(',').map((s) => s.trim()),
      languages: data.languages.split(',').map((s) => s.trim()),
      govIdUploaded: !!govIdFile,
      certUploaded: !!certFile
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Overview callout */}
      <div className="p-4 rounded-2xl bg-brand-50/70 border border-brand-200 text-xs text-brand-900 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="font-semibold block text-sm mb-0.5">Instructor Trust & Safety Standards</strong>
          To protect students and guarantee high-touch live classes, our admin team reviews every instructor profile before granting course publishing privileges.
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Full Legal Name"
            placeholder="As per Government ID"
            error={errors.fullName?.message}
            {...register('fullName')}
          />
          <Input
            label="Teaching / Professional Headline"
            placeholder="e.g. Certified Madhubani Folk Artist"
            error={errors.headline?.message}
            {...register('headline')}
          />
        </div>

        <Textarea
          label="Detailed Biography & Teaching Philosophy"
          rows={4}
          placeholder="Tell students and administrators about your background, passion, and how you teach interactive small batches..."
          error={errors.bio?.message}
          {...register('bio')}
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Skills & Expertise (Comma separated)"
            placeholder="Sourdough, Viennoiserie, Fermentation"
            error={errors.skills?.message}
            {...register('skills')}
          />
          <Input
            label="Years of Experience"
            type="number"
            placeholder="5"
            error={errors.experienceYears?.message}
            {...register('experienceYears')}
          />
          <Input
            label="Languages Spoken"
            placeholder="English, Hindi, Marathi"
            error={errors.languages?.message}
            {...register('languages')}
          />
        </div>

        <Input
          label="Optional Introduction Video URL (YouTube / Vimeo / Drive)"
          placeholder="https://youtu.be/..."
          error={errors.videoIntroUrl?.message}
          helperText="A 60-second friendly webcam intro substantially accelerates verification approval."
          {...register('videoIntroUrl')}
        />
      </div>

      {/* Document Upload Simulation */}
      <div className="space-y-4 pt-2">
        <h4 className="text-sm font-bold text-brand-900 border-b border-edge pb-2">
          Identity & Credential Verification Documents
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Gov ID */}
          <div className="p-4 rounded-2xl border-2 border-dashed border-edge hover:border-brand-400 transition bg-white text-center">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 mx-auto flex items-center justify-center mb-2">
              <Upload className="w-5 h-5" />
            </div>
            <p className="text-xs font-semibold text-brand-900">Government ID Proof</p>
            <p className="text-[11px] text-content-muted mb-3">Passport, Aadhaar, Driver License (PDF or JPG)</p>
            {govIdFile ? (
              <div className="inline-flex items-center gap-1.5 text-xs text-emerald-700 font-medium bg-emerald-50 px-2.5 py-1 rounded-lg">
                <CheckCircle2 className="w-3.5 h-3.5" /> {govIdFile}
              </div>
            ) : (
              <label className="cursor-pointer inline-flex items-center justify-center px-3 py-1.5 text-xs font-semibold rounded-lg bg-surface-subtle border border-edge hover:bg-gray-100 text-brand-900 transition">
                <span>Select Document</span>
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => setGovIdFile(e.target.files?.[0]?.name || 'Government_ID_Proof.pdf')}
                />
              </label>
            )}
          </div>

          {/* Skill certificate */}
          <div className="p-4 rounded-2xl border-2 border-dashed border-edge hover:border-brand-400 transition bg-white text-center">
            <div className="w-10 h-10 rounded-xl bg-accent-light text-accent-dark mx-auto flex items-center justify-center mb-2">
              <FileText className="w-5 h-5" />
            </div>
            <p className="text-xs font-semibold text-brand-900">Skill / Degree / Portfolio Proof</p>
            <p className="text-[11px] text-content-muted mb-3">Diploma, workshop certificate or craft portfolio</p>
            {certFile ? (
              <div className="inline-flex items-center gap-1.5 text-xs text-emerald-700 font-medium bg-emerald-50 px-2.5 py-1 rounded-lg">
                <CheckCircle2 className="w-3.5 h-3.5" /> {certFile}
              </div>
            ) : (
              <label className="cursor-pointer inline-flex items-center justify-center px-3 py-1.5 text-xs font-semibold rounded-lg bg-surface-subtle border border-edge hover:bg-gray-100 text-brand-900 transition">
                <span>Select Certificate</span>
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => setCertFile(e.target.files?.[0]?.name || 'Master_Skill_Diploma.pdf')}
                />
              </label>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end pt-4 border-t border-edge">
        <Button type="submit" variant="primary" isLoading={isLoading} icon={ShieldCheck}>
          Submit Application for Admin Review
        </Button>
      </div>
    </form>
  );
};

export default VerificationForm;
