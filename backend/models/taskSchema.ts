// backend/models/taskSchema.ts

import mongoose, { Schema, Document } from 'mongoose';

export interface ITask extends Document {
    bookId: mongoose.Types.ObjectId;
    createdBy: mongoose.Types.ObjectId;
    description: string;
    comments: mongoose.Types.ObjectId[]; // Referencing comment IDs
}

const TaskSchema: Schema<ITask> = new Schema({
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    description: { type: String, required: true },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }], // Reference to Comment model
});

const Task = mongoose.model<ITask>('Task', TaskSchema);
export default Task;
