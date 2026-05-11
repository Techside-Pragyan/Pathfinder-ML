import express from 'express';
import { summarizeNotes } from '../services/aiService';

const router = express.Router();

router.post('/summarize', async (req, res) => {
    try {
        const { content } = req.body;
        const summary = await summarizeNotes(content);
        if (!summary) return res.status(500).json({ message: 'Summarization failed' });
        res.json(summary);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
});

export default router;
