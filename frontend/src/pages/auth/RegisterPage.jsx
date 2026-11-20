import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { GraduationCap, Sparkles, User, Lock, Mail, Phone, ArrowRight, ShieldCheck } from 'lucide-react';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

export const RegisterPage = () => {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') === 'instructor' ? 'instructor' : 'student';

  const { register } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [role, setRole] = useState(initialRole);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [skills, setSkills] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      addToast('Please fill in all required fields.', 'error');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      register({
        name,
        email,
        role,
        phone,
        skills
      });
      setIsLoading(false);
      addToast(`Account created as ${role}!`, 'success');

      if (role === 'instructor') {
        navigate('/instructor/verification');
      } else {
        navigate('/student/overview');
      }
    }, 450);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-3xl border border-edge shadow-elevated">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-brand-500 text-white mx-auto flex items-center justify-center shadow-subtle">
            <GraduationCap className="w-6 h-6 text-accent" />
          </div>
          <h2 className="text-2xl font-bold text-brand-900">Join Classify</h2>
          <p className="text-xs text-content-muted">
            Choose whether you want to learn in small live batches or teach what you know.
          </p>
        </div>

        {/* Role Toggle */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-content-body uppercase tracking-wider text-center">
            I Want To Join As:
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRole('student')}
              className={`p-3.5 rounded-2xl border text-left transition flex flex-col items-start gap-1 ${
                role === 'student'
                  ? 'border-brand-500 bg-brand-50/50 ring-2 ring-brand-500/20'
                  : 'border-edge bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <User className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold text-brand-900">Student</span>
              </div>
              <p className="text-[11px] text-content-muted leading-tight">
                Learn in small interactive live cohorts
              </p>
            </button>

            <button
              type="button"
              onClick={() => setRole('instructor')}
              className={`p-3.5 rounded-2xl border text-left transition flex flex-col items-start gap-1 ${
                role === 'instructor'
                  ? 'border-brand-500 bg-brand-50/50 ring-2 ring-brand-500/20'
                  : 'border-edge bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-brand-600" />
                <span className="text-xs font-bold text-brand-900">Instructor</span>
              </div>
              <p className="text-[11px] text-content-muted leading-tight">
                Teach live classes & earn from home
              </p>
            </button>
          </div>
        </div>

        {role === 'instructor' && (
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              Instructors complete identity & credentials review before publishing courses.
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            placeholder="Priya Sharma"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <Input
            label="Email Address"
            type="email"
            icon={Mail}
            placeholder="priya@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            label="Create Password"
            type="password"
            icon={Lock}
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Input
            label="Phone Number"
            type="tel"
            icon={Phone}
            placeholder="+91 98765 43210"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          {role === 'instructor' && (
            <Input
              label="Skill / Craft You Wish To Teach"
              placeholder="e.g. Sourdough Baking, Madhubani Art, React JS"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
            />
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full mt-4"
            isLoading={isLoading}
            iconRight={ArrowRight}
          >
            Create {role === 'instructor' ? 'Instructor' : 'Student'} Account
          </Button>
        </form>

        <p className="text-center text-xs text-content-muted">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-800">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
