import { Router } from 'express';
import { register, login , getMe } from '../controllers/authController.js';
import { protect } from '../middleware/authmiddleware.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);

router.get('/protected', protect, (req, res) => {
  res.json({
    message: 'You accessed a protected route',
    userId: req.userId,
  });
});

router.get('/me', protect , getMe);

export default router;
