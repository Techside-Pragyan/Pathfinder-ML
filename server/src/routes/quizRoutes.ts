import express from 'express';
import { generateNewQuiz, submitQuizResult, getQuizHistory } from '../controllers/quizController';

const router = express.Router();

router.post('/generate', generateNewQuiz);
router.post('/submit', submitQuizResult);
router.get('/history/:userId', getQuizHistory);

export default router;
