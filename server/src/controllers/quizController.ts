import { Request, Response } from 'express';
import Quiz from '../models/Quiz';
import { generateQuiz } from '../services/aiService';

export const generateNewQuiz = async (req: Request, res: Response) => {
    try {
        const { userId, subject, topic, difficulty } = req.body;
        const aiQuiz = await generateQuiz(subject, topic, difficulty);
        
        if (!aiQuiz) return res.status(500).json({ message: 'Failed to generate quiz' });

        const newQuiz = new Quiz({
            userId,
            subject,
            topic,
            difficulty,
            questions: aiQuiz.questions,
            maxScore: aiQuiz.questions.length
        });

        await newQuiz.save();
        res.status(201).json(newQuiz);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const submitQuizResult = async (req: Request, res: Response) => {
    try {
        const { quizId, score, timeTaken } = req.body;
        const quiz = await Quiz.findByIdAndUpdate(
            quizId,
            { score, timeTaken, isCompleted: true },
            { new: true }
        );
        res.json(quiz);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const getQuizHistory = async (req: Request, res: Response) => {
    try {
        const history = await Quiz.find({ userId: req.params.userId }).sort({ createdAt: -1 });
        res.json(history);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};
