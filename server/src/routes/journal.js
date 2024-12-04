const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth'); // Import authentication middleware
const db = require('../connectDB'); // Import your database connection

// Add a new journal entry
router.post('/', authenticateToken, async (req, res) => {
    const { text, timestamp } = req.body; // Extract text and timestamp from the request body
    const userId = req.user.id; // Extract the authenticated user's ID from the middleware

    if (!text || !timestamp) {
        return res.status(400).json({ message: 'Text and timestamp are required.' }); // Validate input
    }

    try {
        // Insert the journal entry into the database
        const result = await db.query(
            'INSERT INTO journal_entries (userId, text, timestamp) VALUES ($1, $2, $3) RETURNING *',
            [userId, text, timestamp]
        );
        res.status(201).json(result.rows[0]); // Respond with the created entry
    } catch (error) {
        console.error('Error adding journal entry:', error);
        res.status(500).json({ message: 'Failed to add journal entry.' });
    }
});

// Fetch all journal entries for the authenticated user
router.get('/', authenticateToken, async (req, res) => {
    const userId = req.user.id; // Extract the authenticated user's ID from the middleware

    try {
        // Query the database for all journal entries for the user
        const result = await db.query(
            'SELECT * FROM journal_entries WHERE userId = $1 ORDER BY timestamp DESC',
            [userId]
        );
        res.status(200).json(result.rows); // Respond with the user's journal entries
    } catch (error) {
        console.error('Error fetching journal entries:', error);
        res.status(500).json({ message: 'Failed to fetch journal entries.' });
    }
});

// Delete a specific journal entry by ID
router.delete('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params; // Extract the journal entry ID from the URL parameters
    const userId = req.user.id; // Extract the authenticated user's ID from the middleware

    try {
        // Delete the journal entry for the authenticated user
        const result = await db.query(
            'DELETE FROM journal_entries WHERE id = $1 AND userId = $2 RETURNING *',
            [id, userId]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Journal entry not found or not authorized.' });
        }

        res.status(200).json({ message: 'Journal entry deleted successfully.' });
    } catch (error) {
        console.error('Error deleting journal entry:', error);
        res.status(500).json({ message: 'Failed to delete journal entry.' });
    }
});

module.exports = router;
