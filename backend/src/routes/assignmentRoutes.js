import express from 'express';
import {
  getAssignments,
  createAssignment,
  submitAssignment,
  gradeAssignment,
} from '../controllers/assignmentController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.route('/').get(protect, getAssignments).post(protect, authorize('instructor', 'admin'), createAssignment);

router.post('/:id/submit', protect, authorize('student', 'admin'), submitAssignment);
router.put('/:id/grade', protect, authorize('instructor', 'admin'), gradeAssignment);

export default router;
