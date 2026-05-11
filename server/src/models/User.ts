import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    clerkId: string;
    email: string;
    name: string;
    profilePicture?: string;
    learningGoal?: string;
    currentLevel?: 'beginner' | 'intermediate' | 'advanced';
    studyHoursPerDay?: number;
    xp: number;
    level: number;
    streak: number;
    lastActive: Date;
    weakSubjects: string[];
    completedTopics: string[];
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema = new Schema({
    clerkId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    profilePicture: { type: String },
    learningGoal: { type: String },
    currentLevel: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
    studyHoursPerDay: { type: Number, default: 2 },
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    streak: { type: Number, default: 0 },
    lastActive: { type: Date, default: Date.now },
    weakSubjects: [{ type: String }],
    completedTopics: [{ type: String }],
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);
