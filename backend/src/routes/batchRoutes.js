import express from 'express';
import {
  getBatches,
  getBatchById,
  createBatch,
  updateBatch,
} from '../controllers/batchController.js';
import { protect } from '../middleware/authMiddleware.js';
import { checkInstructorVerified } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.route('/').get(getBatches).post(protect, checkInstructorVerified, createBatch);

router.route('/:id').get(getBatchById).put(protect, updateBatch);

export default router;
