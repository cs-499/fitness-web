import bodyParser from 'body-parser';
import session from 'express-session';
import jwt from 'jsonwebtoken';

export const bodyParse = bodyParser.urlencoded({ extended: true });

export const sessionCookie = session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
    },
});

// this middleware function was inspired by https://medium.com/@vikramgyawali57/7-best-approach-of-protecting-routes-in-node-js-every-senior-engineer-suggests-fc32b7777827
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Extract the token from the "Authorization" header
    if (!token) {
        return res.status(401).send('Authentication required.');
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).send('Invalid token.');
        }
        req.user = decoded;
        next();
    });
};

export default verifyToken;