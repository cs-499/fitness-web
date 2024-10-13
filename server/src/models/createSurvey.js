import mongoose from 'mongoose';

export const surveySchema = new mongoose.Schema(
  {
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    answers: {
        type: Map,
        of: [String]
        // of: mongoose.Schema.Types.Mixed,
        // required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
  }
);