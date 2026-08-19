require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./User');

const app = express();
app.use(express.json());

const PORT = 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey12345';

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/thinkzai')
    .then(() => console.log('Successfully connected to MongoDB!'))
    .catch(err => console.error('Database connection error:', err));

// MIDDLEWARE: Verify JWT Token for Protected Routes
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Expects "Bearer <token>"

    if (!token) {
        return res.status(401).json({ status: 'error', message: 'Access denied. No token provided.' });
    }

    jwt.verify(token, JWT_SECRET, (err, decodedUser) => {
        if (err) return res.status(403).json({ status: 'error', message: 'Invalid or expired token.' });
        req.user = decodedUser;
        next();
    });
};

// 1. REGISTER ROUTE
app.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ status: 'error', message: 'Email and password are required.' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ status: 'error', message: 'Email already registered.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email, password: hashedPassword });
        await newUser.save();

        // Standard Auth Response Format
        res.status(201).json({
            status: 'success',
            message: 'User registered successfully.',
            data: { userId: newUser._id, email: newUser.email }
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// 2. LOGIN ROUTE
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ status: 'error', message: 'Email and password are required.' });
        }

        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ status: 'error', message: 'Invalid email or password.' });
        }

        const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

        // Standard Auth Response Format
        res.status(200).json({
            status: 'success',
            message: 'Authentication successful.',
            data: {
                token: token,
                user: { userId: user._id, email: user.email }
            }
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// 3. /ME ROUTE (Protected Route using JWT)
app.get('/me', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password'); // Exclude password from response
        if (!user) return res.status(444).json({ status: 'error', message: 'User not found.' });

        res.status(200).json({
            status: 'success',
            data: { user }
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});