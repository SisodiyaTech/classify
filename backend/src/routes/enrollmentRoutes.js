import express from 'express';
import {
  enrollStudentInBatch,
  getMyEnrollments,
  getMyPayments,
} from '../controllers/enrollmentController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/checkout', protect, authorize('student', 'admin'), enrollStudentInBatch);
router.get('/my', protect, getMyEnrollments);
router.get('/payments/my', protect, getMyPayments);

export default router;
