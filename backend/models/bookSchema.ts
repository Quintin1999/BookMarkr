import mongoose, { Schema, Document } from "mongoose";

export interface IBook extends Document {
  googleId: string;
  title: string;
  authors: string[];
  description: string;
  thumbnail: string;
  addedByUser: mongoose.Types.ObjectId;
  dateAdded: Date; // New field for date the book was added
  publicationYear: number; // New field for the year of publication
  clubId?: mongoose.Types.ObjectId;
}

const BookSchema: Schema = new Schema({
  googleId: { type: String, required: true },
  title: { type: String, required: true },
  authors: { type: [String], required: true },
  description: { type: String, required: true },
  thumbnail: { type: String, required: true },
  addedByUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  dateAdded: { type: Date, default: Date.now, immutable:true }, // Default to the current date
  publicationYear: { type: Number, required: true }, // Add a required field for publication year
  clubId: { type: mongoose.Schema.Types.ObjectId, ref: "Club" },
});

// Export the model
const Book = mongoose.model<IBook>("Book", BookSchema);
export default Book;
