import 'dotenv/config';
import express from 'express';
import { connectDB } from './connectDB.js';
import { corsMiddleware } from './middleware/cors.js';
import { sessionCookie, bodyParse } from './middleware/auth.js';
import routes from './routes/routes.js';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import workoutRoute from './routes/workoutRoute.js';
import mealRoute from './routes/mealRoute.js';

const app = express();
const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

connectDB();

app.use(corsMiddleware);
app.use(bodyParse);
app.use(sessionCookie);
app.use(express.json());

app.use(routes);
app.use('/survey', routes);
app.use('/api/workout-plan', workoutRoute);
app.use('/meals', mealRoute);

// script for starting Flask server for meal-gen API
const flaskAppPath = path.join(__dirname, 'controllers', 'meal-gen.py');

// start the Flask server using `spawn`
const flaskProcess = spawn('python3', [flaskAppPath]);

flaskProcess.on('error', (error) => {
    console.error(`Error starting Flask server: ${error.message}`);
});

flaskProcess.stderr.on('data', (data) => {
    console.error(`Flask message: ${data}`);
});

app.listen(PORT, () => {
    console.log(`REST API running on port ${PORT}`);
});