import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, CheckCircle2, ArrowLeft } from 'lucide-react';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setIsSent(true);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-edge shadow-elevated space-y-6">
        {isSent ? (
          <div className="text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-brand-900">Check your inbox</h2>
            <p className="text-xs text-content-muted leading-relaxed">
              We have sent a secure password reset link to <strong>{email}</strong>. Please follow the instructions to regain access.
            </p>
            <Link to="/login" className="block pt-2">
              <Button variant="outline" size="sm" className="w-full">
                Return to Login
              </Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-brand-900">Forgot password?</h2>
              <p className="text-xs text-content-muted">
                Enter your account email to receive a password reset link.
              </p>
            </div>

            <Input
              label="Email Address"
              type="email"
              icon={Mail}
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Button type="submit" variant="primary" size="lg" className="w-full">
              Send Reset Instructions
            </Button>

            <div className="text-center pt-2">
              <Link to="/login" className="inline-flex items-center gap-1.5 text-xs text-brand-600 hover:text-brand-800 font-semibold">
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword && password.length >= 6) {
      setIsSuccess(true);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-edge shadow-elevated space-y-6">
        {isSuccess ? (
          <div className="text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-brand-900">Password Updated</h2>
            <p className="text-xs text-content-muted">
              Your password has been reset securely. You can now log into your account.
            </p>
            <Link to="/login" className="block pt-2">
              <Button variant="primary" size="sm" className="w-full">
                Log In Now
              </Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-brand-900">Set New Password</h2>
              <p className="text-xs text-content-muted">
                Choose a strong new password for your Classify account.
              </p>
            </div>

            <Input
              label="New Password"
              type="password"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Input
              label="Confirm New Password"
              type="password"
              placeholder="Re-enter password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <Button type="submit" variant="primary" size="lg" className="w-full">
              Save New Password
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export const VerifyEmailPage = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isVerified, setIsVerified] = useState(false);

  const handleOtpChange = (val, idx) => {
    if (val.length <= 1) {
      const copy = [...otp];
      copy[idx] = val;
      setOtp(copy);
      if (val && idx < 5) {
        document.getElementById(`otp-${idx + 1}`)?.focus();
      }
    }
  };

  const handleVerify = (e) => {
    e.preventDefault();
    setIsVerified(true);
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-edge shadow-elevated space-y-6 text-center">
        {isVerified ? (
          <div className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-brand-900">Email Verified!</h2>
            <p className="text-xs text-content-muted">
              Your email has been authenticated. You can now access all small-batch live classes.
            </p>
            <Link to="/student/overview" className="block pt-2">
              <Button variant="primary" size="sm" className="w-full">
                Enter Dashboard
              </Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleVerify} className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-brand-900">Verify Your Email</h2>
              <p className="text-xs text-content-muted">
                Enter the 6-digit verification code sent to your registered email address.
              </p>
            </div>

            <div className="flex justify-center gap-2">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  id={`otp-${idx}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(e.target.value, idx)}
                  className="w-11 h-12 text-center text-lg font-bold rounded-xl border border-edge focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              ))}
            </div>

            <Button type="submit" variant="primary" size="lg" className="w-full">
              Confirm Verification Code
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
