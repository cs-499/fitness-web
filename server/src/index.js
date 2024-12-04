import 'dotenv/config';
import express from 'express';
import { connectDB } from './connectDB.js';
import { corsMiddleware } from './middleware/cors.js';
import { sessionCookie, bodyParse } from './middleware/auth.js';
import routes from './routes/routes.js';
import workoutRoute from './routes/workoutRoute.js';
import journalRoutes from './routes/journal.js'; // Import journal routes
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to the database
connectDB();

// Middleware setup
app.use(corsMiddleware); // Handle CORS
app.use(bodyParse); // Parse URL-encoded bodies
app.use(sessionCookie); // Manage user sessions
app.use(express.json()); // Parse incoming JSON requests

// Routes setup
app.use(routes); // General routes
app.use('/survey', routes); // Survey routes
app.use('/api/workout-plan', workoutRoute); // Workout routes
app.use('/journal', journalRoutes); // Register journal routes

// Start the Flask server for the meal-gen API
const flaskAppPath = path.join(__dirname, 'controllers', 'meal-gen.py');
const flaskProcess = spawn('python3', [flaskAppPath]);

// Log any errors from the Flask server
flaskProcess.on('error', (error) => {
    console.error(`Error starting Flask server: ${error.message}`);
});

flaskProcess.stderr.on('data', (data) => {
    console.error(`Flask message: ${data}`);
});

// Start the Express server
app.listen(PORT, () => {
    console.log(`REST API running on port ${PORT}`);
});
