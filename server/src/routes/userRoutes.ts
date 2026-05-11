import express from 'express';
import { getUserProfile, updateUserProfile, getUserAnalytics } from '../controllers/userController';

const router = express.Router();

router.get('/:clerkId', getUserProfile);
router.put('/:clerkId', updateUserProfile);
router.get('/analytics/:userId', getUserAnalytics);

export default router;
