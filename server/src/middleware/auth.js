import bodyParser from 'body-parser';
import session from 'express-session';
import jwt from 'jsonwebtoken';

// Middleware for parsing URL-encoded bodies
export const bodyParse = bodyParser.urlencoded({ extended: true });

// Middleware for handling sessions with cookies
export const sessionCookie = session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true, // Protect cookie from client-side JavaScript
        sameSite: 'lax', // Mitigate CSRF risks
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    },
});
// this middleware function was inspired by https://medium.com/@vikramgyawali57/7-best-approach-of-protecting-routes-in-node-js-every-senior-engineer-suggests-fc32b7777827

// Middleware to verify JWT and attach the userId to req.user
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "Authentication required." });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Invalid token." });
        }

        // Attach userId from the token payload
        req.user = { id: decoded.id };
        console.log("Token verified, userId:", req.user.id); // Debugging log
        next();
    });
};

export default verifyToken;




/*
original

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
*/