import User from '../models/User.js';
import Course from '../models/Course.js';
import Batch from '../models/Batch.js';
import Enrollment from '../models/Enrollment.js';
import Payment from '../models/Payment.js';
import { sendEmail } from '../utils/emailService.js';

// @desc    Get Admin Dashboard Stats & Metrics
// @route   GET /api/v1/admin/stats
// @access  Private (Admin only)
export const getAdminStats = async (req, res, next) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalInstructors = await User.countDocuments({ role: 'instructor' });
    const pendingInstructors = await User.countDocuments({
      role: 'instructor',
      verificationStatus: 'Pending Review',
    });
    const totalCourses = await Course.countDocuments();
    const pendingCourses = await Course.countDocuments({
      status: 'Pending Review',
    });
    const activeBatches = await Batch.countDocuments({ status: 'Upcoming' });
    const totalEnrollments = await Enrollment.countDocuments();

    // Financial aggregates
    const payments = await Payment.find({ status: 'Completed' });
    const totalRevenue = payments.reduce((acc, p) => acc + p.amount, 0);
    const platformCommission = payments.reduce(
      (acc, p) => acc + (p.platformFee || p.amount * 0.15),
      0
    );
    const instructorPayouts = totalRevenue - platformCommission;

    res.status(200).json({
      success: true,
      stats: {
        totalStudents,
        totalInstructors,
        pendingInstructors,
        totalCourses,
        pendingCourses,
        activeBatches,
        totalEnrollments,
        totalRevenue,
        platformCommission,
        instructorPayouts,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all instructors with verification status
// @route   GET /api/v1/admin/instructors
// @access  Private (Admin only)
export const getAdminInstructors = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = { role: 'instructor' };

    if (status && status !== 'all') {
      query.verificationStatus = status;
    }

    const instructors = await User.find(query).sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      count: instructors.length,
      instructors,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve or reject instructor verification application
// @route   PUT /api/v1/admin/instructors/:id/status
// @access  Private (Admin only)
export const updateInstructorStatus = async (req, res, next) => {
  try {
    const { status, note } = req.body; // 'Approved', 'Rejected', 'Suspended'

    const instructor = await User.findById(req.params.id);
    if (!instructor) {
      return res.status(404).json({
        success: false,
        message: 'Instructor not found',
      });
    }

    instructor.verificationStatus = status;
    await instructor.save();

    // Notify instructor via email
    sendEmail({
      to: instructor.email,
      subject: `Instructor Verification Update: ${status}`,
      html: `
        <h3>Application Status Update</h3>
        <p>Hi ${instructor.name},</p>
        <p>Your instructor verification application on Classify has been marked as: <strong>${status}</strong>.</p>
        ${status === 'Approved'
          ? '<p>Congratulations! You can now publish courses and schedule small-batch cohorts.</p>'
          : '<p>Please check your instructor dashboard for details or requested adjustments.</p>'}
      `,
    });

    res.status(200).json({
      success: true,
      message: `Instructor status updated to ${status}.`,
      instructor,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Moderate course status (Approve / Reject / Archive)
// @route   PUT /api/v1/admin/courses/:id/status
// @access  Private (Admin only)
export const updateCourseModerationStatus = async (req, res, next) => {
  try {
    const { status } = req.body; // 'Approved', 'Rejected', 'Archived'

    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    course.status = status;
    await course.save();

    res.status(200).json({
      success: true,
      message: `Course status updated to ${status}.`,
      course,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all transactions & platform commissions
// @route   GET /api/v1/admin/payments
// @access  Private (Admin only)
export const getAllPayments = async (req, res, next) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: payments.length,
      payments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users in directory
// @route   GET /api/v1/admin/users
// @access  Private (Admin only)
export const getAllUsers = async (req, res, next) => {
  try {
    const { role } = req.query;
    const query = {};
    if (role && role !== 'all') {
      query.role = role;
    }

    const users = await User.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    next(error);
  }
};
