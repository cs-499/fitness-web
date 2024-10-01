import cors from 'cors';

const corsMiddleware = cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
});
export default corsMiddleware;

