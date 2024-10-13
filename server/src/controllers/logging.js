import bcrypt from 'bcryptjs';
import mongoose from 'mongoose'; 
import { userSchema } from '../models/createUser.js';

const User = mongoose.model('User', userSchema);

export const login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user || !bcrypt.compareSync(password, user.password)){
            return res.status(401).send('Invalid credentials. Please try again.');
        }
        
        const response = {firstTimeLogin: user.firstLogin};

        req.session.userId = user._id;

        if (user.firstLogin) {
            user.firstLogin = false;
            await user.save();
        }
        return res.json(response);

    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
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
