import mongoose from "mongoose";

const JournalEntrySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the user ID
        required: true,
        ref: "User", // Assumes you have a User model
    },
    text: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        required: true,
    },
});

const JournalEntry = mongoose.model("JournalEntry", JournalEntrySchema);

export default JournalEntry;
