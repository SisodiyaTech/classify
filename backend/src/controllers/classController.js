import LiveClass from '../models/LiveClass.js';
import Batch from '../models/Batch.js';
import Enrollment from '../models/Enrollment.js';

// @desc    Get live classes for user (Student or Instructor)
// @route   GET /api/v1/classes/my
// @access  Private
export const getMyClasses = async (req, res, next) => {
  try {
    let classes = [];

    if (req.user.role === 'instructor') {
      classes = await LiveClass.find({ instructor: req.user._id }).sort({
        createdAt: -1,
      });
    } else {
      // Find batches where student is enrolled
      const enrollments = await Enrollment.find({ student: req.user._id });
      const batchIds = enrollments.map((e) => e.batch);

      classes = await LiveClass.find({ batch: { $in: batchIds } }).sort({
        createdAt: -1,
      });
    }

    res.status(200).json({
      success: true,
      count: classes.length,
      classes,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Schedule a live class (Instructor only)
// @route   POST /api/v1/classes
// @access  Private (Instructor)
export const createLiveClass = async (req, res, next) => {
  try {
    const { batchId, title, date, time, durationMinutes, agenda, materialsNeeded } = req.body;

    const batch = await Batch.findById(batchId);
    if (!batch) {
      return res.status(404).json({
        success: false,
        message: 'Batch not found',
      });
    }

    if (batch.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only the assigned instructor can schedule sessions for this cohort.',
      });
    }

    const liveClass = await LiveClass.create({
      batch: batch._id,
      batchName: batch.name,
      course: batch.course,
      courseTitle: batch.courseTitle,
      instructor: req.user._id,
      instructorName: req.user.name,
      title,
      date,
      time,
      durationMinutes: durationMinutes || batch.durationMinutes || 90,
      agenda: agenda || '',
      materialsNeeded: materialsNeeded || [],
    });

    res.status(201).json({
      success: true,
      message: 'Live class scheduled.',
      liveClass,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify classroom access & generate room session token
// @route   GET /api/v1/classes/classroom/:batchId/access
// @access  Private
export const getClassroomAccess = async (req, res, next) => {
  try {
    const { batchId } = req.params;
    const batch = await Batch.findById(batchId).populate('course');

    if (!batch) {
      return res.status(404).json({
        success: false,
        message: 'Batch not found',
      });
    }

    const isInstructor = batch.instructor.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    // If student, check if enrolled
    let isEnrolled = false;
    if (!isInstructor && !isAdmin) {
      const enrollment = await Enrollment.findOne({
        student: req.user._id,
        batch: batch._id,
      });

      if (!enrollment) {
        return res.status(403).json({
          success: false,
          message: 'Access Denied: You must be enrolled in this batch to access the live classroom.',
        });
      }
      isEnrolled = true;
    }

    // Classroom session details (ready for future LiveKit token generation)
    res.status(200).json({
      success: true,
      accessGranted: true,
      role: isInstructor ? 'instructor' : isAdmin ? 'admin' : 'student',
      user: {
        id: req.user._id,
        name: req.user.name,
        avatar: req.user.avatar,
      },
      batch: {
        id: batch._id,
        name: batch.name,
        courseTitle: batch.courseTitle,
        instructorName: batch.instructorName,
        maxCapacity: batch.maxCapacity,
      },
      roomToken: `room-token-${batch._id}-${req.user._id}-${Date.now()}`,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update live class status (e.g. Start Class, End Class)
// @route   PUT /api/v1/classes/:id/status
// @access  Private (Instructor)
export const updateClassStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const liveClass = await LiveClass.findById(req.params.id);

    if (!liveClass) {
      return res.status(404).json({
        success: false,
        message: 'Class not found',
      });
    }

    liveClass.status = status;
    await liveClass.save();

    res.status(200).json({
      success: true,
      liveClass,
    });
  } catch (error) {
    next(error);
  }
};
