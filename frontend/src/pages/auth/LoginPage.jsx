import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { GraduationCap, Sparkles, Shield, User, Lock, Mail, ArrowRight } from 'lucide-react';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

export const LoginPage = () => {
  const { login, switchDemoRole } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('priya.sharma@example.com');
  const [password, setPassword] = useState('password123');
  const [desiredRole, setDesiredRole] = useState('student');
  const [isLoading, setIsLoading] = useState(false);

  const from = location.state?.from?.pathname || (desiredRole === 'admin' ? '/admin/overview' : desiredRole === 'instructor' ? '/instructor/overview' : '/student/overview');

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      login(email, password, desiredRole);
      setIsLoading(false);
      addToast(`Logged in successfully!`, 'success');
      navigate(from, { replace: true });
    }, 400);
  };

  const handleQuickDemo = (roleType, defaultEmail) => {
    switchDemoRole(roleType);
    addToast(`Signed in directly as ${roleType}!`, 'info');
    if (roleType === 'admin') navigate('/admin/overview');
    else if (roleType === 'instructor') navigate('/instructor/overview');
    else if (roleType === 'instructor-pending') navigate('/instructor/verification');
    else navigate('/student/overview');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-3xl border border-edge shadow-elevated">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-brand-500 text-white mx-auto flex items-center justify-center shadow-subtle">
            <GraduationCap className="w-6 h-6 text-accent" />
          </div>
          <h2 className="text-2xl font-bold text-brand-900">Welcome back</h2>
          <p className="text-xs text-content-muted">
            Sign in to access your small-batch live cohorts & dashboard.
          </p>
        </div>

        {/* Quick Demo Sign-In Buttons */}
        <div className="space-y-2 bg-surface-subtle p-3.5 rounded-2xl border border-edge">
          <p className="text-[11px] font-bold uppercase tracking-wider text-brand-900 text-center">
            ⚡ Quick 1-Click Demo Login
          </p>
          <div className="grid grid-cols-3 gap-2 pt-1">
            <button
              type="button"
              onClick={() => handleQuickDemo('student', 'priya.sharma@example.com')}
              className="p-2 rounded-xl border border-edge bg-white hover:border-brand-500 text-center transition flex flex-col items-center gap-1"
            >
              <User className="w-4 h-4 text-emerald-600" />
              <span className="text-[11px] font-semibold text-brand-900">Student</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('instructor', 'ananya.roy@example.com')}
              className="p-2 rounded-xl border border-edge bg-white hover:border-brand-500 text-center transition flex flex-col items-center gap-1"
            >
              <Sparkles className="w-4 h-4 text-brand-600" />
              <span className="text-[11px] font-semibold text-brand-900">Instructor</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('admin', 'admin@classify.ed')}
              className="p-2 rounded-xl border border-edge bg-white hover:border-brand-500 text-center transition flex flex-col items-center gap-1"
            >
              <Shield className="w-4 h-4 text-purple-600" />
              <span className="text-[11px] font-semibold text-brand-900">Admin</span>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            icon={Mail}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-content-body uppercase tracking-wider">
                Password
              </label>
              <Link to="/forgot-password" className="text-xs text-brand-600 hover:text-brand-800">
                Forgot?
              </Link>
            </div>
            <Input
              type="password"
              icon={Lock}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-content-body uppercase tracking-wider">
              Sign In Role
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['student', 'instructor', 'admin'].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setDesiredRole(r)}
                  className={`py-1.5 px-2 rounded-xl border text-xs font-semibold capitalize transition ${
                    desiredRole === r
                      ? 'border-brand-500 bg-brand-50 text-brand-900'
                      : 'border-edge bg-white text-content-muted'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full mt-4"
            isLoading={isLoading}
            iconRight={ArrowRight}
          >
            Sign In to Classify
          </Button>
        </form>

        <p className="text-center text-xs text-content-muted">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-semibold text-brand-600 hover:text-brand-800">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
