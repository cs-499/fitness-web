import 'dotenv/config.js';
import express from 'express';
import { connectDB } from './src/db/mongo.js';
import corsMiddleware from './src/middleware/cors.js';
import sessionMiddleware from './src/middleware/session.js';
import bodyParserMiddleware from './src/middleware/bodyparser.js';
import routes from './src/routes.js';

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(bodyParserMiddleware);
app.use(corsMiddleware);
app.use(sessionMiddleware);

app.post('/api', routes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});