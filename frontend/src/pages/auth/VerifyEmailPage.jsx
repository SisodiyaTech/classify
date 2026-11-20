import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import Button from '../../components/common/Button';

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

export default VerifyEmailPage;
