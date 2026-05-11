import mongoose, { Schema, Document } from 'mongoose';

export interface IQuiz extends Document {
    userId: mongoose.Types.ObjectId;
    subject: string;
    topic: string;
    difficulty: 'easy' | 'medium' | 'hard';
    questions: {
        questionText: string;
        options: string[];
        correctAnswer: string;
        explanation?: string;
        type: 'mcq' | 'coding' | 'subjective';
    }[];
    score?: number;
    maxScore: number;
    timeTaken?: number; // in seconds
    isCompleted: boolean;
}

const QuizSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    subject: { type: String, required: true },
    topic: { type: String, required: true },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
    questions: [{
        questionText: { type: String, required: true },
        options: [{ type: String }],
        correctAnswer: { type: String, required: true },
        explanation: { type: String },
        type: { type: String, enum: ['mcq', 'coding', 'subjective'], default: 'mcq' }
    }],
    score: { type: Number },
    maxScore: { type: Number, required: true },
    timeTaken: { type: Number },
    isCompleted: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model<IQuiz>('Quiz', QuizSchema);
