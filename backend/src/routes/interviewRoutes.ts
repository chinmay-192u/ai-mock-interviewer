import { Router } from 'express';
import {
  createInterview,
  getInterviews,
  getInterview,
  deleteInterview,
  generateInterview,
  submitAnswer,
} from '../controllers/interviewController.js';
import { protect } from '../middleware/authmiddleware.js';

const router = Router();

router.post('/', protect, createInterview);

router.get('/', protect, getInterviews);

router.get('/:id', protect, getInterview);

router.post('/generate', protect, generateInterview);

router.delete('/:id', protect, deleteInterview);

router.post('/:id/answer', protect, submitAnswer);

export default router;
