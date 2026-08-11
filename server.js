const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { z } = require('zod');
const cookieParser = require('cookie-parser'); // Added cookie-parser

const app = express();
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // Initialized cookie-parser middleware

// 1. Fixed CORS Configuration for Cookie Credentials
const corsOptions = {
    origin: true, // Automatically reflects request origin to allow credentials safely
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
};
app.use(cors(corsOptions)); // Enabled CORS middleware with options
// Add this route below your app.use(cors(...)) line
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    console.log("Received login request for:", email);

    // Simple test validation check
    if (email === "test@example.com" && password === "password123") {
        return res.json({ success: true, message: "Login successful!" });
    } else {
        return res.status(401).json({ success: false, message: "Invalid credentials" });
    }
});
// 2. Rate Limiting Configuration
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: { success: false, message: "Too many requests, try again later." },
    standardHeaders: true,
    legacyHeaders: false
});
app.use(authLimiter);

// // Mock Database (In-memory array for users)
const users = []; 
const usersDB = users; // This links both names together so your routes won't crash!
const loginAttempts = {};// Tracks login failure metrics per email address
// (Your user array and endpoint routes start below this line...)

// Secret key for signing JWTs
const JWT_SECRET = 'your_super_secret_jwt_key';
// Define validation schema for auth data
const authSchema = z.object({
  email: z.string().email({ message: "Invalid email format" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters long" })
});

// Zod Validation Middleware function
const validateAuthInput = (req, res, next) => {
  const result = authSchema.safeParse(req.body);
  if (!result.success) {
   return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: result.error.flatten().fieldErrors
    });
  }
  next();
};
//**
// 1. REGISTER ROUTE
// ==========================================
app.post('/api/auth/register', validateAuthInput, async (req, res) => {
    try {
        const { email, password } = req.body;

        const existingUser = usersDB.find(u => u.email === email);
        if (existingUser) {
            return res.status(400).json({
                success: false,
                error: "DUPLICATE_EMAIL",
                message: "This email address is already registered."
            });
        }

        usersDB.push({ email, password });
        return res.status(201).json({
            success: true,
            message: "User registered successfully."
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error during registration" });
    }
});

// ==========================================
// 2. LOGIN ROUTE WITH ACCOUNT LOCKOUT
// ==========================================
app.post('/api/auth/login', authLimiter, validateAuthInput, async (req, res) => {
    const { email } = req.body;

    if (loginAttempts[email]?.count >= 5) {
        loginAttempts[email].lockUntil = Date.now() + (15 * 60 * 1000);
        return res.status(423).json({
            success: false,
            error: "ACCOUNT_LOCKED"
        });
    }

    // Add your user validation database check logic here
    const isValidUser = false; 

    if (!isValidUser) {
        if (!loginAttempts[email]) {
            loginAttempts[email] = { count: 0 };
        }
        loginAttempts[email].count += 1;

        return res.status(401).json({
            success: false,
            error: "INVALID_CREDENTIALS",
            message: "Invalid email or password. Attempt " + loginAttempts[email].count + " of 5."
        });
    }

    delete loginAttempts[email];

    return res.status(200).json({
        success: true,
        message: "Authentication successful.",
        accessToken: "mock-access-token-string",
        refreshToken: "mock-refresh-token-string"
    });
});

// ==========================================
// 3. SEAMLESS TOKEN REFRESH ROUTE
// ==========================================
app.post('/api/auth/refresh-token', async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({
                success: false,
                error: "MISSING_TOKEN",
                message: "A refresh token must be provided."
            });
        }

        if (refreshToken !== "mock-refresh-token-string") {
            return res.status(403).json({
                success: false,
                error: "INVALID_TOKEN",
                message: "The provided refresh token is invalid or expired."
            });
        }

        return res.status(200).json({
            success: true,
            accessToken: "newly-regenerated-access-token",
            refreshToken: "mock-refresh-token-string"
        });
    } catch (err) {
        return res.status(403).json({ success: false, message: "Token verification failed" });
    }
});

// ==========================================
// SERVER INITIALIZATION (ABSOLUTE BOTTOM)
// ==========================================
const PORT = 5000;

app.listen(PORT, () => {
    console.log("Authentication server running on http://localhost:5000");
});