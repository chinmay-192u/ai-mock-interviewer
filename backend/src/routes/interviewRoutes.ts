import { Router } from 'express';
import {
  createInterview,
  getInterviews,
  getInterview,
  deleteInterview,
  generateInterview,
  submitAnswer,
  evaluateInterview,
} from '../controllers/interviewController.js';
import { protect } from '../middleware/authmiddleware.js';

const router = Router();

router.post('/', protect, createInterview);

router.get('/', protect, getInterviews);

router.post('/generate', protect, generateInterview);

router.get('/:id', protect, getInterview);

router.post('/:id/answer', protect, submitAnswer);

router.post('/:id/evaluate', protect, evaluateInterview);

router.delete('/:id', protect, deleteInterview);

export default router;
