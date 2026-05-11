import mongoose, { Schema, Document } from 'mongoose';

export interface IStudyPlan extends Document {
    userId: mongoose.Types.ObjectId;
    title: string;
    description?: string;
    startDate: Date;
    endDate: Date;
    schedule: {
        day: string;
        topics: {
            name: string;
            duration: number; // in minutes
            status: 'pending' | 'completed' | 'skipped';
            priority: 'low' | 'medium' | 'high';
        }[];
    }[];
    isAI_Generated: boolean;
    progress: number; // percentage
}

const StudyPlanSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    schedule: [{
        day: { type: String, required: true },
        topics: [{
            name: { type: String, required: true },
            duration: { type: Number, required: true },
            status: { type: String, enum: ['pending', 'completed', 'skipped'], default: 'pending' },
            priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' }
        }]
    }],
    isAI_Generated: { type: Boolean, default: true },
    progress: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model<IStudyPlan>('StudyPlan', StudyPlanSchema);
