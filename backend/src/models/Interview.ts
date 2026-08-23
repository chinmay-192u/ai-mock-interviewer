import mongoose, { Schema, Document } from 'mongoose';

export interface IInterview extends Document {
  userId: mongoose.Types.ObjectId;
  role: string;
  difficulty: 'easy' | 'medium' | 'hard';
  questions: {
    _id?: mongoose.Types.ObjectId;
    question: string;
    answer?: string;
  }[];
  score?: number;
  createdAt: Date;
  updatedAt: Date;
}

const interviewSchema = new Schema<IInterview>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    role: {
      type: String,
      required: true,
    },

    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      required: true,
    },

    questions: [
      {
        question: {
          type: String,
          required: true,
        },
        answer: {
          type: String,
        },
      },
    ],

    score: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

export const Interview = mongoose.model<IInterview>('Interview', interviewSchema);
