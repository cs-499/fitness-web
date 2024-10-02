import bodyParser from 'body-parser';
import session from 'express-session';

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