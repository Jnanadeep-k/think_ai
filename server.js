const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { z } = require('zod');

const app = express();
app.use(express.json()); // Allows the server to accept JSON data in request bodies

// 1. CORS Configuration
const corsOptions = {
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
};
app.use(cors(corsOptions));

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
/**
 * ============================================================================
 * 1. REGISTER ROUTE
 * ============================================================================
 */
app.post('/register', authLimiter, validateAuthInput, async (req, res) => {
    try {
        const { email, password } = req.body;


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
app.post('/login', authLimiter,validateAuthInput, async (req, res) => {
    try {
        const { email, password } = req.body;

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

        // Generate Access Token (15 minutes expiry)
    const accessToken = jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: '15m' });

    // Generate Refresh Token (7 days expiry)
    const refreshToken = jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    // Whitelist the active refresh token
    activeRefreshTokens.push(refreshToken);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      accessToken,
      refreshToken,
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

// Mock Array to store active whitelist refresh tokens
const activeRefreshTokens = [];

// Refresh Token Endpoint
app.post('/refresh-token', (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ success: false, message: "Refresh token required" });
  }

  // 1. Check if token is inside our active whitelist database array
  const tokenIndex = activeRefreshTokens.indexOf(refreshToken);
  if (tokenIndex === -1) {
    return res.status(403).json({ success: false, message: "Invalid or expired token" });
  }

  try {
    // 2. Verify the incoming token credentials
    const decoded = jwt.verify(refreshToken, 'your_super_secret_jwt_key');

    // 3. IMMEDIATELY ROTATE IT: Delete old token from the whitelist array
    activeRefreshTokens.splice(tokenIndex, 1);

    // 4. Generate a brand new replacement Access Token and Refresh Token pair
    const newAccessToken = jwt.sign({ email: decoded.email }, 'your_super_secret_jwt_key', { expiresIn: '15m' });
    const newRefreshToken = jwt.sign({ email: decoded.email }, 'your_super_secret_jwt_key', { expiresIn: '7d' });

    // 5. Add the newly generated refresh token back to your active database array whitelist
    activeRefreshTokens.push(newRefreshToken);

    // 6. Return both new keys back to user client
    res.json({
      success: true,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    });

  } catch (err) {
    return res.status(403).json({ success: false, message: "Token verification failed" });
  }
});
// Port configuration
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Authentication server running on http://localhost:${PORT}`);
});
