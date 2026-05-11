import express from 'express';
import { createStudyPlan, getStudyPlans, updateTopicStatus } from '../controllers/studyPlanController';

const router = express.Router();

router.post('/', createStudyPlan);
router.get('/:userId', getStudyPlans);
router.patch('/topic', updateTopicStatus);

export default router;
