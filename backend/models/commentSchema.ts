// backend/models/commentSchema.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IComment extends Document {
  taskId: mongoose.Types.ObjectId;
  bookId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  content: string;
  likes: number;
  dislikes: number;
}

const CommentSchema: Schema<IComment> = new Schema({
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
});

const Comment = mongoose.model<IComment>('Comment', CommentSchema);
export default Comment;