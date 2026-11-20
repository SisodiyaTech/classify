import Batch from '../models/Batch.js';
import Course from '../models/Course.js';

// @desc    Get batches (filter by course or instructor)
// @route   GET /api/v1/batches
// @access  Public
export const getBatches = async (req, res, next) => {
  try {
    const { courseId, instructorId, status } = req.query;
    const query = {};

    if (courseId) query.course = courseId;
    if (instructorId) query.instructor = instructorId;
    if (status) query.status = status;

    const batches = await Batch.find(query).sort({ startDate: 1 });

    res.status(200).json({
      success: true,
      count: batches.length,
      batches,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single batch details
// @route   GET /api/v1/batches/:id
// @access  Public
export const getBatchById = async (req, res, next) => {
  try {
    const batch = await Batch.findById(req.params.id)
      .populate('course', 'title category thumbnail price')
      .populate('instructor', 'name avatar headline rating');

    if (!batch) {
      return res.status(404).json({
        success: false,
        message: 'Batch not found',
      });
    }

    res.status(200).json({
      success: true,
      batch,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new batch (Instructor only)
// @route   POST /api/v1/batches
// @access  Private (Approved Instructor)
export const createBatch = async (req, res, next) => {
  try {
    const {
      courseId,
      name,
      startDate,
      endDate,
      days,
      timing,
      durationMinutes,
      fee,
      maxCapacity,
      description,
    } = req.body;

    // Check course existence
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    // Check course approval
    if (course.status !== 'Approved' && req.user.role !== 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Batches can only be created for approved courses.',
      });
    }

    // HARD PLATFORM BUSINESS RULE: maxCapacity <= 50
    const requestedCap = Number(maxCapacity) || 12;
    if (requestedCap > 50) {
      return res.status(400).json({
        success: false,
        message: 'Platform Rule: Maximum cohort capacity cannot exceed 50 students.',
      });
    }

    const selectedDays = Array.isArray(days) ? days : ['Saturday', 'Sunday'];
    const daysDisplay =
      selectedDays.length === 2 &&
      selectedDays.includes('Saturday') &&
      selectedDays.includes('Sunday')
        ? 'Sat & Sun'
        : selectedDays.map((d) => d.substring(0, 3)).join(', ');

    const batch = await Batch.create({
      name,
      course: course._id,
      courseTitle: course.title,
      instructor: req.user._id,
      instructorName: req.user.name,
      startDate,
      endDate,
      days: selectedDays,
      daysDisplay,
      timing,
      durationMinutes: Number(durationMinutes) || 90,
      fee: Number(fee) || course.price,
      maxCapacity: requestedCap,
      description: description || '',
    });

    // Increment active batches on course
    await Course.findByIdAndUpdate(course._id, {
      $inc: { activeBatchesCount: 1 },
    });

    res.status(201).json({
      success: true,
      message: 'Cohort scheduled successfully.',
      batch,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update batch
// @route   PUT /api/v1/batches/:id
// @access  Private (Batch Instructor / Admin)
export const updateBatch = async (req, res, next) => {
  try {
    let batch = await Batch.findById(req.params.id);

    if (!batch) {
      return res.status(404).json({
        success: false,
        message: 'Batch not found',
      });
    }

    if (
      batch.instructor.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to modify this batch',
      });
    }

    if (req.body.maxCapacity && Number(req.body.maxCapacity) > 50) {
      return res.status(400).json({
        success: false,
        message: 'Platform Rule: Maximum cohort capacity cannot exceed 50 students.',
      });
    }

    batch = await Batch.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      batch,
    });
  } catch (error) {
    next(error);
  }
};
