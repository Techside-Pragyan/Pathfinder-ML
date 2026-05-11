import { Request, Response } from 'express';
import StudyPlan from '../models/StudyPlan';
import User from '../models/User';
import { generateStudyPlan } from '../services/aiService';

export const createStudyPlan = async (req: Request, res: Response) => {
    try {
        const { userId, goals, availability } = req.body;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const aiPlan = await generateStudyPlan(user, goals, availability);
        if (!aiPlan) return res.status(500).json({ message: 'Failed to generate plan' });

        const newPlan = new StudyPlan({
            userId,
            title: aiPlan.title,
            description: aiPlan.description,
            startDate: new Date(),
            endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week later
            schedule: aiPlan.schedule,
            isAI_Generated: true
        });

        await newPlan.save();
        res.status(201).json(newPlan);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const getStudyPlans = async (req: Request, res: Response) => {
    try {
        const plans = await StudyPlan.find({ userId: req.params.userId }).sort({ createdAt: -1 });
        res.json(plans);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const updateTopicStatus = async (req: Request, res: Response) => {
    try {
        const { planId, day, topicName, status } = req.body;
        const plan = await StudyPlan.findById(planId);
        if (!plan) return res.status(404).json({ message: 'Plan not found' });

        const daySchedule = plan.schedule.find(s => s.day === day);
        if (daySchedule) {
            const topic = daySchedule.topics.find(t => t.name === topicName);
            if (topic) {
                topic.status = status;
                await plan.save();
                return res.json(plan);
            }
        }
        res.status(404).json({ message: 'Topic or Day not found' });
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};
