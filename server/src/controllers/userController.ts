import { Request, Response } from 'express';
import User from '../models/User';
import Performance from '../models/Performance';

export const getUserProfile = async (req: Request, res: Response) => {
    try {
        const user = await User.findOne({ clerkId: req.params.clerkId });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const updateUserProfile = async (req: Request, res: Response) => {
    try {
        const user = await User.findOneAndUpdate(
            { clerkId: req.params.clerkId },
            { $set: req.body },
            { new: true, upsert: true }
        );
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const getUserAnalytics = async (req: Request, res: Response) => {
    try {
        const performance = await Performance.find({ userId: req.params.userId }).sort({ date: -1 }).limit(7);
        res.json(performance);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};
