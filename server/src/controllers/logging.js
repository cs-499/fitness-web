import bcrypt from 'bcryptjs';
import mongoose from 'mongoose'; 
import { userSchema } from '../models/createUser.js';

const User = mongoose.model('User', userSchema);

export const login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (user && bcrypt.compareSync(password, user.password)) {
            req.session.userId = user.username;
            res.send(`Welcome back, ${username}!`);
        } else {
            res.status(401).send('Invalid username and/or password');
        }
    } catch (err) {
        res.status(500).send('Internal server error');
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
