import 'dotenv/config';
import express from 'express';
import { connectDB } from './connectDB.js';
import { corsMiddleware } from './middleware/cors.js';
import { sessionCookie, bodyParse } from './middleware/auth.js';
import routes from './routes.js';

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(corsMiddleware);
app.use(bodyParse);
app.use(sessionCookie);
app.use(express.json());

app.use(routes);
app.use('/survey', routes);

app.listen(PORT, () => {
    console.log(`rest api running on port ${PORT}`);
});