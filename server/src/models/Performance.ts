import mongoose, { Schema, Document } from 'mongoose';

export interface IPerformance extends Document {
    userId: mongoose.Types.ObjectId;
    date: Date;
    studyMinutes: number;
    accuracy: number; // percentage from quizzes
    consistencyScore: number; // 0-100
    subjectMastery: {
        subject: string;
        mastery: number; // 0-100
    }[];
    productivityRating: number; // 1-5
}

const PerformanceSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, default: Date.now },
    studyMinutes: { type: Number, default: 0 },
    accuracy: { type: Number, default: 0 },
    consistencyScore: { type: Number, default: 0 },
    subjectMastery: [{
        subject: { type: String, required: true },
        mastery: { type: Number, default: 0 }
    }],
    productivityRating: { type: Number, min: 1, max: 5, default: 3 }
}, { timestamps: true });

export default mongoose.model<IPerformance>('Performance', PerformanceSchema);
