const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json()); // Allows the server to accept JSON data in request bodies

// Mock Database (In-memory array for users)
const usersDB = []; 

// Secret key for signing JWTs
const JWT_SECRET = 'your_super_secret_jwt_key';

/**
 * ============================================================================
 * 1. REGISTER ROUTE
 * ============================================================================
 */
app.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required" });
        }

        // Check if user already exists
        const userExists = usersDB.find(u => u.email === email);
        if (userExists) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        // Hash the password securely using bcryptjs
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Save user record
        const newUser = { id: Date.now(), email, password: hashedPassword };
        usersDB.push(newUser);

        // Generate JWT token automatically upon registration
        const token = jwt.sign({ id: newUser.id, email: newUser.email }, JWT_SECRET, { expiresIn: '1h' });

        // Standardized response format
        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            token,
            user: { id: newUser.id, email: newUser.email }
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error during registration" });
    }
});

/**
 * ============================================================================
 * 2. MISSING API: LOGIN ROUTE
 * ============================================================================
 */
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required" });
        }

        // Find user by email
        const user = usersDB.find(u => u.email === email);
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }

        // Compare encrypted password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }

        // Generate JWT Token on successful verification
        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: { id: user.id, email: user.email }
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error during login" });
    }
});

/**
 * ============================================================================
 * 3. AUTHENTICATION MIDDLEWARE (Protects private routes)
 * ============================================================================
 */
const protectRoute = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: "Access denied. No token provided." });
    }

    const token = authHeader.split(' ')[1]; // Extract token from "Bearer <token>"

    try {
        const verifiedData = jwt.verify(token, JWT_SECRET);
        req.user = verifiedData; // Store user details in request context
        next(); // Proceed to route execution
    } catch (error) {
        return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
};
/**
 * ============================================================================
 * 4. MISSING API: GET /me ROUTE
 * ============================================================================
 */
app.get('/me', protectRoute, (req, res) => {
    return res.status(200).json({
        success: true,
        message: "User profile fetched successfully",
        user: req.user
    });
});

// Port configuration
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Authentication server running on http://localhost:${PORT}`);
});