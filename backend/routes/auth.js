const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User'); // Your User model
const jwt = require('jsonwebtoken'); // For token generation (optional, if you plan to use JWT)

const router = express.Router();

// Register route
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({ error: 'Email already in use' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        res.status(201).json({ message: 'User registered successfully!' });
    } catch (err) {
        console.error("❌ Registration Error:", err);
        res.status(500).json({ error: 'Server error, please try again later' });
    }
});

// Login route (optional for future use)
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Compare the password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Optionally, generate a token for authenticated user
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ message: 'Login successful', token });
    } catch (err) {
        console.error("❌ Login Error:", err);
        res.status(500).json({ error: 'Server error, please try again later' });
    }
});

module.exports = router;
