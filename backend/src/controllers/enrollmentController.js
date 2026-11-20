import Enrollment from '../models/Enrollment.js';
import Batch from '../models/Batch.js';
import Course from '../models/Course.js';
import Payment from '../models/Payment.js';
import User from '../models/User.js';
import { sendEmail } from '../utils/emailService.js';

// @desc    Enroll student into a small-batch cohort (Checkout)
// @route   POST /api/v1/enrollments/checkout
// @access  Private (Student only)
export const enrollStudentInBatch = async (req, res, next) => {
  try {
    const { batchId, paymentMethod = 'UPI / Card' } = req.body;

    const batch = await Batch.findById(batchId).populate('course');
    if (!batch) {
      return res.status(404).json({
        success: false,
        message: 'Batch not found',
      });
    }

    // Check capacity rule: do not allow beyond maxCapacity
    if (batch.enrolledCount >= batch.maxCapacity) {
      return res.status(400).json({
        success: false,
        message: `This cohort is fully booked (Maximum capacity: ${batch.maxCapacity} students reached).`,
      });
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      student: req.user._id,
      batch: batch._id,
    });

    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        message: 'You are already enrolled in this cohort.',
      });
    }

    const fee = batch.fee;
    const platformFee = Number((fee * 0.15).toFixed(2)); // 15% platform commission
    const instructorPayout = Number((fee - platformFee).toFixed(2)); // 85% instructor payout
    const transactionId = `TXN-${Math.floor(10000000 + Math.random() * 90000000)}`;

    // 1. Create Payment record
    const payment = await Payment.create({
      transactionId,
      student: req.user._id,
      studentName: req.user.name,
      course: batch.course._id,
      courseTitle: batch.course.title,
      batch: batch._id,
      batchName: batch.name,
      instructor: batch.instructor,
      instructorName: batch.instructorName,
      amount: fee,
      platformFee,
      instructorPayout,
      method: paymentMethod,
      status: 'Completed',
    });

    // 2. Create Enrollment record
    const enrollment = await Enrollment.create({
      student: req.user._id,
      studentName: req.user.name,
      studentEmail: req.user.email,
      studentAvatar: req.user.avatar,
      course: batch.course._id,
      courseTitle: batch.course.title,
      batch: batch._id,
      batchName: batch.name,
      instructor: batch.instructor,
      instructorName: batch.instructorName,
      amountPaid: fee,
      paymentId: transactionId,
      paymentStatus: 'Completed',
      progressPercentage: 0,
      attendanceRate: 100,
    });

    // 3. Update Batch enrolled count
    await Batch.findByIdAndUpdate(batch._id, {
      $inc: { enrolledCount: 1 },
    });

    // 4. Update Course enrolled students count
    await Course.findByIdAndUpdate(batch.course._id, {
      $inc: { totalEnrolledStudents: 1 },
    });

    // 5. Update Instructor total earnings and balance
    await User.findByIdAndUpdate(batch.instructor, {
      $inc: {
        totalEarnings: fee,
        availableBalance: instructorPayout,
        totalStudents: 1,
      },
    });

    // Send confirmation email
    sendEmail({
      to: req.user.email,
      subject: `Seat Confirmed: ${batch.name} - Classify`,
      html: `
        <h3>Your Seat is Reserved!</h3>
        <p>Hi ${req.user.name},</p>
        <p>You have successfully enrolled in <strong>${batch.courseTitle}</strong> (${batch.name}).</p>
        <p><strong>Schedule:</strong> ${batch.daysDisplay} at ${batch.timing}</p>
        <p><strong>Amount Paid:</strong> ₹${fee}</p>
        <p><strong>Transaction ID:</strong> ${transactionId}</p>
        <p>See you in the live classroom!</p>
      `,
    });

    res.status(201).json({
      success: true,
      message: 'Enrollment confirmed successfully.',
      enrollment,
      payment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in student enrollments
// @route   GET /api/v1/enrollments/my
// @access  Private
export const getMyEnrollments = async (req, res, next) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user._id })
      .populate('course', 'title category thumbnail price')
      .populate('batch', 'name startDate endDate days daysDisplay timing durationMinutes maxCapacity enrolledCount')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: enrollments.length,
      enrollments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in student payment history
// @route   GET /api/v1/payments/my
// @access  Private
export const getMyPayments = async (req, res, next) => {
  try {
    const payments = await Payment.find({ student: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: payments.length,
      payments,
    });
  } catch (error) {
    next(error);
  }
};
