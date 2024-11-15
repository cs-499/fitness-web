import bcrypt from 'bcryptjs';
import mongoose from 'mongoose'; 
import { userSchema } from '../models/createUser.js';
import Survey from '../models/createSurvey.js';
import jwt from 'jsonwebtoken';

const User = mongoose.model('User', userSchema);

export const login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user || !bcrypt.compareSync(password, user.password)){
            return res.status(401).send('Invalid credentials. Please try again.');
        }

        const surveyResponse = await Survey.findOne({ userId: user._id });
        // make it bool, so if false user always goes to survey
        const surveyCompleted = !!surveyResponse;
        // generate JWT token in response
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '2d' });

        const response = {
            firstTimeLogin: user.firstLogin,
            surveyCompleted,
            token,
            userId: user._id
        };

        req.session.userId = user._id;

        if (user.firstLogin) {
            user.firstLogin = false;
            await user.save();
        }
        return res.json(response);

    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: 'Internal Server Error' })
    }
};

export const register = async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const user = new User({ username, password: hashedPassword });
    try {
        await user.save();
        res.send('Success! New user registered.');
    } catch (err) {
        if (err.code === 11000) {
            res.status(400).send('Username already exists.');
        } else {
            res.status(500).send('Error registering user.');
        }
    }
};