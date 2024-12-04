import JournalEntry from "../models/Journal.js"; // Import the JournalEntry model

/**
 * Add a journal entry for the authenticated user.
 * @route POST /journal
 * @access Authenticated
 */
 export const addJournalEntry = async (req, res) => {
    const { text, timestamp } = req.body;
    const userId = req.user.id; // Ensure userId is extracted properly

    console.log("Request body:", req.body);
    console.log("Authenticated userId:", userId);

    if (!text || !timestamp) {
        console.error("Validation failed: Missing text or timestamp");
        return res.status(400).json({ message: "Text and timestamp are required." });
    }

    try {
        const journalEntry = new JournalEntry({ userId, text, timestamp });
        const savedEntry = await journalEntry.save();

        console.log("Journal entry saved:", savedEntry);
        res.status(201).json(savedEntry);
    } catch (error) {
        console.error("Error adding journal entry:", error);
        res.status(500).json({ message: "Failed to add journal entry." });
    }
};


/**
 * Fetch all journal entries for the authenticated user.
 * @route GET /journal
 * @access Authenticated
 */
export const getJournalEntries = async (req, res) => {
    const userId = req.user.id; // Get the authenticated user's ID from the middleware

    try {
        // Find all journal entries for the user, sorted by timestamp (most recent first)
        const journalEntries = await JournalEntry.find({ userId }).sort({ timestamp: -1 });
        res.status(200).json(journalEntries); // Respond with the user's journal entries
    } catch (error) {
        console.error("Error fetching journal entries:", error);
        res.status(500).json({ message: "Failed to fetch journal entries." });
    }
};

/**
 * Delete a specific journal entry by its ID.
 * @route DELETE /journal/:id
 * @access Authenticated
 */
export const deleteJournalEntry = async (req, res) => {
    const { id } = req.params; // Extract the journal entry ID from the URL parameters
    const userId = req.user.id; // Get the authenticated user's ID from the middleware

    try {
        // Find and delete the journal entry, ensuring it belongs to the user
        const deletedEntry = await JournalEntry.findOneAndDelete({ _id: id, userId });

        if (!deletedEntry) {
            return res.status(404).json({ message: "Journal entry not found or not authorized." });
        }

        res.status(200).json({ message: "Journal entry deleted successfully." });
    } catch (error) {
        console.error("Error deleting journal entry:", error);
        res.status(500).json({ message: "Failed to delete journal entry." });
    }
};


// const db = require('../connectDB'); // Import database connection

// /**
//  * Add a journal entry for the authenticated user.
//  * @route POST /journal
//  * @access Authenticated
//  */
// const addJournalEntry = async (req, res) => {
//     const { text, timestamp } = req.body; // Extract text and timestamp from the request body
//     const userId = req.user.id; // Get the authenticated user's ID from the middleware

//     // Validate input
//     if (!text || !timestamp) {
//         return res.status(400).json({ message: 'Text and timestamp are required.' });
//     }

//     try {
//         // Insert the journal entry into the database
//         const result = await db.query(
//             'INSERT INTO journal_entries (userId, text, timestamp) VALUES ($1, $2, $3) RETURNING *',
//             [userId, text, timestamp]
//         );

//         // Respond with the newly created journal entry
//         res.status(201).json(result.rows[0]);
//     } catch (error) {
//         console.error('Error adding journal entry:', error);
//         res.status(500).json({ message: 'Failed to add journal entry.' });
//     }
// };

// /**
//  * Fetch all journal entries for the authenticated user.
//  * @route GET /journal
//  * @access Authenticated
//  */
// const getJournalEntries = async (req, res) => {
//     const userId = req.user.id; // Get the authenticated user's ID from the middleware

//     try {
//         // Query the database for all journal entries belonging to the user
//         const result = await db.query(
//             'SELECT * FROM journal_entries WHERE userId = $1 ORDER BY timestamp DESC',
//             [userId]
//         );

//         // Respond with the user's journal entries
//         res.status(200).json(result.rows);
//     } catch (error) {
//         console.error('Error fetching journal entries:', error);
//         res.status(500).json({ message: 'Failed to fetch journal entries.' });
//     }
// };

// /**
//  * Delete a specific journal entry by its ID.
//  * @route DELETE /journal/:id
//  * @access Authenticated
//  */
// const deleteJournalEntry = async (req, res) => {
//     const { id } = req.params; // Extract the journal entry ID from the URL parameters
//     const userId = req.user.id; // Get the authenticated user's ID from the middleware

//     try {
//         // Delete the journal entry that matches the ID and belongs to the user
//         const result = await db.query(
//             'DELETE FROM journal_entries WHERE id = $1 AND userId = $2 RETURNING *',
//             [id, userId]
//         );

//         // Check if a journal entry was deleted
//         if (result.rowCount === 0) {
//             return res.status(404).json({ message: 'Journal entry not found or not authorized.' });
//         }

//         // Respond with a success message
//         res.status(200).json({ message: 'Journal entry deleted successfully.' });
//     } catch (error) {
//         console.error('Error deleting journal entry:', error);
//         res.status(500).json({ message: 'Failed to delete journal entry.' });
//     }
// };

// module.exports = {
//     addJournalEntry,
//     getJournalEntries,
//     deleteJournalEntry,
// };
