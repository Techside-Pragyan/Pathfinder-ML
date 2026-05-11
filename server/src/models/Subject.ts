import mongoose, { Schema, Document } from 'mongoose';

export interface ISubject extends Document {
    name: string;
    description?: string;
    prerequisites: string[];
    resources: {
        title: string;
        type: 'video' | 'article' | 'book' | 'interactive';
        url: string;
        difficulty: 'beginner' | 'intermediate' | 'advanced';
    }[];
    topics: string[];
}

const SubjectSchema: Schema = new Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String },
    prerequisites: [{ type: String }],
    resources: [{
        title: { type: String, required: true },
        type: { type: String, enum: ['video', 'article', 'book', 'interactive'], required: true },
        url: { type: String, required: true },
        difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], required: true }
    }],
    topics: [{ type: String }]
}, { timestamps: true });

export default mongoose.model<ISubject>('Subject', SubjectSchema);
