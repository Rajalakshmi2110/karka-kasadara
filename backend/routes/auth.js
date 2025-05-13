const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User'); // Import the User model
const jwt = require('jsonwebtoken'); // For token generation (optional, if you plan to use JWT)

const router = express.Router();

// Register route
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ error: 'Email already in use' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user with a generated UID
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
        });

        // Save the new user
        await newUser.save();

        // Send response with user details, including the generated UID
        res.status(201).json({
            message: 'User registered successfully!',
            uid: newUser.uid, // Send the generated UID
            email: newUser.email, // Return email too, if necessary
        });
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

        // Optionally, generate a JWT token (if you need JWT for authentication)
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Respond with the token
        res.json({ message: 'Login successful', token });
    } catch (err) {
        console.error("❌ Login Error:", err);
        res.status(500).json({ error: 'Server error, please try again later' });
    }
});

module.exports = router;
