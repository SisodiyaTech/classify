import Assignment from '../models/Assignment.js';
import Batch from '../models/Batch.js';

// @desc    Get assignments for a batch or user
// @route   GET /api/v1/assignments
// @access  Private
export const getAssignments = async (req, res, next) => {
  try {
    const { batchId } = req.query;
    const query = {};

    if (batchId) {
      query.batch = batchId;
    }

    const assignments = await Assignment.find(query).sort({ dueDate: 1 });

    res.status(200).json({
      success: true,
      count: assignments.length,
      assignments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new assignment (Instructor)
// @route   POST /api/v1/assignments
// @access  Private (Instructor)
export const createAssignment = async (req, res, next) => {
  try {
    const { batchId, title, description, dueDate, points } = req.body;

    const batch = await Batch.findById(batchId);
    if (!batch) {
      return res.status(404).json({
        success: false,
        message: 'Batch not found',
      });
    }

    const assignment = await Assignment.create({
      batch: batch._id,
      batchName: batch.name,
      course: batch.course,
      courseTitle: batch.courseTitle,
      title,
      description,
      dueDate,
      points: Number(points) || 100,
    });

    res.status(201).json({
      success: true,
      assignment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit assignment (Student)
// @route   POST /api/v1/assignments/:id/submit
// @access  Private (Student)
export const submitAssignment = async (req, res, next) => {
  try {
    const { fileName, fileUrl } = req.body;
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found',
      });
    }

    // Check if previously submitted, replace or push
    const existingIndex = assignment.submissions.findIndex(
      (s) => s.student.toString() === req.user.id
    );

    const submissionData = {
      student: req.user._id,
      studentName: req.user.name,
      fileName: fileName || 'Submission.pdf',
      fileUrl: fileUrl || '#',
      submittedAt: new Date(),
      status: 'Submitted',
    };

    if (existingIndex > -1) {
      assignment.submissions[existingIndex] = submissionData;
    } else {
      assignment.submissions.push(submissionData);
    }

    await assignment.save();

    res.status(200).json({
      success: true,
      message: 'Assignment submitted successfully.',
      assignment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Grade submission (Instructor)
// @route   PUT /api/v1/assignments/:id/grade
// @access  Private (Instructor)
export const gradeAssignment = async (req, res, next) => {
  try {
    const { studentId, grade, feedback } = req.body;
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found',
      });
    }

    const submission = assignment.submissions.find(
      (s) => s.student.toString() === studentId
    );

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission for this student not found',
      });
    }

    submission.grade = grade;
    submission.feedback = feedback;
    submission.status = 'Graded';

    await assignment.save();

    res.status(200).json({
      success: true,
      message: 'Grade and feedback recorded.',
      assignment,
    });
  } catch (error) {
    next(error);
  }
};
