import mongoose from 'mongoose';

export const userSchema = new mongoose.Schema(
    {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstLogin: { type: Boolean, default: true },
    }
);