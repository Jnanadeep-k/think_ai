const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();
const LOCK_TIME_MS = 15 * 60 * 1000; // 15 Minute lock timer window

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Locate structural account record
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Invalid login credentials provided." });
    }

    // 2. Check if account is currently hard locked out
    if (user.lockUntil && user.lockUntil > new Date()) {
      const remainingTime = Math.ceil((user.lockUntil - new Date()) / 1000 / 60);
      return res.status(403).json({ 
        error: `This account is locked due to 5 failed attempts. Try again in ${remainingTime} minutes.` 
      });
    }

    // 3. Verify encryption hash integrity matches
    const isMatch = await bcrypt.compare(password, user.hashedPassword);

    if (!isMatch) {
      const updatedAttempts = user.failedLoginAttempts + 1;
      let updateData = { failedLoginAttempts: updatedAttempts };

      // Trigger 5-attempt lockout threshold rule metric
      if (updatedAttempts >= 5) {
        updateData.lockUntil = new Date(Date.now() + LOCK_TIME_MS);
      }

      await prisma.user.update({
        where: { email },
        data: updateData
      });

      return res.status(401).json({ 
        error: "Invalid login credentials provided.",
        attemptsRemaining: Math.max(0, 5 - updatedAttempts)
      });
    }

    // 4. Clean metrics reset on valid operational verification loop
    await prisma.user.update({
      where: { email },
      data: { failedLoginAttempts: 0, lockUntil: null }
    });

    // 5. Sign secure access payload signature 
    const token = jwt.sign(
      { userId: user.id }, 
      process.env.ACCESS_TOKEN_SECRET || 'fallback_secret', 
      { expiresIn: '1h' }
    );

    res.json({ token, message: "Authentication verification loop passed cleanly." });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.register = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Hash the password with 10 salt rounds before saving to database
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = await prisma.user.create({
      data: {
        email,
        hashedPassword,
        role: "USER"
      }
    });
    
    res.status(201).json({ message: "User registered cleanly", userId: newUser.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.googleLogin = async (req, res) => {
    const { token } = req.body; // Received from your client application

    try {
        // 1. Verify the integrity of the Google ID Token
        const ticket = await googleClient.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        
        const payload = ticket.getPayload();
        const { email } = payload;

        // 2. Locate or dynamically register the authenticated user profile
        let user = await prisma.user.findUnique({ where: { email } });
        
        if (!user) {
            // Generate a random placeholder password for OAuth users
            const fallbackPassword = await bcrypt.hash(Math.random().toString(36), 10);
            
            user = await prisma.user.create({
                data: {
                    email,
                    hashedPassword: fallbackPassword,
                    role: "USER"
                }
            });
        }

        // 3. Issue operational platform authorization token
        const accessToken = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.ACCESS_TOKEN_SECRET || 'fallback_secret',
            { expiresIn: '1h' }
        );

        return res.status(200).json({
            message: "Google Authentication successful.",
            token: accessToken,
            user: { id: user.id, email: user.email, role: user.role }
        });

    } catch (error) {
        console.error("OAuth verification pipeline exception:", error);
        return res.status(400).json({ error: "Invalid or expired Google OAuth token." });
    }
};