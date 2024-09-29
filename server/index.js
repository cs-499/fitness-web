require('dotenv').config(); // Load environment variables
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Enable CORS for frontend on port 3000
app.use(cors({
    origin: 'http://localhost:3000', 
    credentials: true                 
}));

// Session setup
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        sameSite: 'lax',
        secure: false 
    }
}));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// User Schema
const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

// Routes
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });

        if (user && bcrypt.compareSync(password, user.password)) {
            req.session.userId = user.username;
            res.send(`Welcome back, ${username}!`);
        } else {
            res.status(401).send('Invalid username or password.');
        }
    } catch (err) {
        res.status(500).send('Error querying the database.');
    }
});

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);

    const user = new User({ username, password: hashedPassword });

    try {
        await user.save();
        res.send('User registered! You can now log in.');
    } catch (err) {
        if (err.code === 11000) {
            res.status(400).send('Username already exists.');
        } else {
            res.status(500).send('Error registering user.');
        }
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});