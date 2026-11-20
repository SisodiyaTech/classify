import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { 
  Users, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  CreditCard, 
  Smartphone, 
  Building2, 
  Lock,
  ArrowRight
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Badge from '../common/Badge';

export const EnrollmentModal = ({
  isOpen,
  onClose,
  course,
  batch
}) => {
  const { user, role } = useAuth();
  const { enrollStudent } = useStore();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [upiId, setUpiId] = useState('priya@okhdfcbank');
  const [cardNumber, setCardNumber] = useState('4111 •••• •••• 9842');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [completedEnrollment, setCompletedEnrollment] = useState(null);

  if (!course || !batch) return null;

  const seatsLeft = Math.max(0, batch.maxCapacity - batch.enrolledCount);
  const amount = batch.fee || course.price;

  const handlePayment = async () => {
    if (!user) {
      addToast('Please login as a student to enroll in this batch.', 'error');
      navigate('/login');
      return;
    }

    if (role !== 'student') {
      addToast('Switch to a Student account (using Demo Switcher) to enroll in courses.', 'info');
      return;
    }

    setIsProcessing(true);

    // Simulate gateway roundtrip
    setTimeout(() => {
      const result = enrollStudent(user, course, batch, { method: paymentMethod });
      setIsProcessing(false);

      if (result.success) {
        setIsSuccess(true);
        setCompletedEnrollment(result.enrollment);
        addToast(`Successfully enrolled in ${batch.name}!`, 'success');
      } else {
        addToast(result.error || 'Enrollment failed', 'error');
      }
    }, 900);
  };

  const handleClose = () => {
    setIsSuccess(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isSuccess ? "Enrollment Confirmed!" : "Confirm Batch Enrollment"}
      subtitle={isSuccess ? "You are officially part of this live learning cohort." : "Reserve your seat in this interactive small-group batch."}
      maxWidth="max-w-lg"
    >
      {isSuccess ? (
        <div className="text-center py-4 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center border border-emerald-200 animate-in zoom-in-75">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-lg font-bold text-brand-900">{course.title}</h3>
            <p className="text-xs text-brand-700 font-medium mt-0.5">{batch.name}</p>
            <p className="text-xs text-content-muted mt-2">
              Instructor: <strong className="text-brand-900">{batch.instructorName || course.instructorName}</strong>
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-surface-subtle border border-edge text-xs space-y-2 text-left">
            <div className="flex justify-between">
              <span className="text-content-muted">Transaction ID:</span>
              <span className="font-mono font-semibold text-brand-900">{completedEnrollment?.paymentId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-content-muted">Batch Schedule:</span>
              <span className="font-semibold text-brand-900">{batch.daysDisplay} • {batch.timing}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-content-muted">Amount Paid:</span>
              <span className="font-bold text-emerald-700">{formatCurrency(amount)}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <Button
              onClick={() => {
                handleClose();
                navigate(`/classroom/${batch.id}`);
              }}
              variant="primary"
              className="flex-1"
              iconRight={ArrowRight}
            >
              Enter Live Classroom
            </Button>
            <Button
              onClick={() => {
                handleClose();
                navigate('/student/courses');
              }}
              variant="outline"
              className="flex-1"
            >
              My Dashboard
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Batch Summary Card */}
          <div className="p-4 rounded-xl bg-surface-subtle border border-edge flex items-start gap-3.5">
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-16 h-16 rounded-xl object-cover ring-1 ring-edge shrink-0"
            />
            <div className="min-w-0 flex-1">
              <Badge variant="brand" size="sm" className="mb-1">
                {course.category}
              </Badge>
              <h4 className="text-sm font-semibold text-brand-900 leading-snug line-clamp-1">
                {course.title}
              </h4>
              <p className="text-xs text-brand-700 font-medium truncate mt-0.5">
                Cohort: {batch.name}
              </p>
              <div className="flex items-center gap-2 mt-1.5 text-[11px] text-content-muted">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-brand-600" /> {batch.daysDisplay}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-brand-600" /> {batch.timing}
                </span>
              </div>
            </div>
          </div>

          {/* Seat Notice */}
          <div className="flex items-center justify-between text-xs p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900">
            <div className="flex items-center gap-1.5 font-medium">
              <Users className="w-4 h-4 text-amber-700" />
              <span>Small-Batch Limit: Max {batch.maxCapacity} students</span>
            </div>
            <span className="font-bold">
              {seatsLeft} {seatsLeft === 1 ? 'seat' : 'seats'} left!
            </span>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-content-body uppercase tracking-wider">
              Select Payment Method
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1 text-center transition ${
                  paymentMethod === 'upi'
                    ? 'border-brand-500 bg-brand-50/50 text-brand-900 font-semibold ring-1 ring-brand-500'
                    : 'border-edge hover:border-gray-300 text-content-body'
                }`}
              >
                <Smartphone className="w-4 h-4 text-brand-600" />
                <span className="text-xs">UPI / QR</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1 text-center transition ${
                  paymentMethod === 'card'
                    ? 'border-brand-500 bg-brand-50/50 text-brand-900 font-semibold ring-1 ring-brand-500'
                    : 'border-edge hover:border-gray-300 text-content-body'
                }`}
              >
                <CreditCard className="w-4 h-4 text-brand-600" />
                <span className="text-xs">Card</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('netbanking')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1 text-center transition ${
                  paymentMethod === 'netbanking'
                    ? 'border-brand-500 bg-brand-50/50 text-brand-900 font-semibold ring-1 ring-brand-500'
                    : 'border-edge hover:border-gray-300 text-content-body'
                }`}
              >
                <Building2 className="w-4 h-4 text-brand-600" />
                <span className="text-xs">NetBanking</span>
              </button>
            </div>
          </div>

          {/* Fee Breakdown */}
          <div className="p-3.5 rounded-xl border border-edge bg-surface-subtle text-xs space-y-2">
            <div className="flex justify-between text-content-muted">
              <span>Full Batch Tuition ({batch.durationMinutes}m sessions)</span>
              <span>{formatCurrency(amount)}</span>
            </div>
            <div className="flex justify-between text-content-muted">
              <span>Classroom Access & Materials</span>
              <span className="text-emerald-700 font-medium">FREE</span>
            </div>
            <div className="border-t border-edge pt-2 flex justify-between text-sm font-bold text-brand-900">
              <span>Total Payable</span>
              <span>{formatCurrency(amount)}</span>
            </div>
          </div>

          {/* Secure note & Checkout button */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-content-muted">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              <span>Simulated 256-bit Secure Gateway • Instant Confirmation</span>
            </div>

            <Button
              onClick={handlePayment}
              variant="primary"
              className="w-full"
              size="lg"
              isLoading={isProcessing}
            >
              Pay {formatCurrency(amount)} & Confirm Seat
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default EnrollmentModal;
