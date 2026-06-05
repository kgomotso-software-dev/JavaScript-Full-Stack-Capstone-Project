// loads environment variables from the .env file
require('dotenv').config();
const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const connectToDatabase = require('../models/db');
const logger = require('../logger');

const JWT_SECRET = process.env.JWT_SECRET;

// Validation rules
const registerValidation = [
  body("email").isEmail().withMessage("Invalid email format").normalizeEmail(),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
  body("firstName").trim().notEmpty().withMessage("First name is required").isLength({ min: 2 }).withMessage("First name must be at least 2 characters long"),
  body("lastName").trim().notEmpty().withMessage("Last name is required").isLength({ min: 2 }).withMessage("Last name must be at least 2 characters long"),
];

router.post('/register', registerValidation, (req, res, next) => {
    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}, async (req, res, next) => {
    logger.info(`POST /register called with body: ${JSON.stringify(req.body)}`);
    try {
        // Connect to the database
        const db = await connectToDatabase();
        const collection = db.collection("users");
        // Check if user already exists
        const existingUser = await collection.findOne({ email: req.body.email });
        if (existingUser) {
            logger.error('User already exists');
            return res.status(400).json({ message: "User already exists" });
        }
        // Hash the password
        const salt = await bcryptjs.genSalt(10);
        const hash = await bcryptjs.hash(req.body.password, salt);
        const email = req.body.email;
        // Insert the new user into the database
        const user = await collection.insertOne({
            email: req.body.email,
            password: hash,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            createdAt: new Date()
        });
        if (!user) {
            logger.error('Failed to register user');
            return res.status(500).json({ message: "Failed to register user" });
        }
        logger.info('User registered successfully');
        // Generate JWT token
        const payload = {
            user: {
                id: user.insertedId,
            },
        };
        const authtoken = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
        return res.status(200).json({ authtoken, email: email });
    } catch (e) {
        logger.error('Error registering user:', e);
        return res.status(500).send('Internal server error');
    }
});

router.post('/login', async (req, res, next) => {
    logger.info(`POST /login called with body: ${JSON.stringify(req.body)}`);
    try {
        // Connect to the database
        const db = await connectToDatabase();
        const collection = db.collection("users");
        // Find the user by email
        const user = await collection.findOne({ email: req.body.email });
        if (!user) {
            logger.error('User not found');
            return res.status(400).json({ message: "Invalid credentials" });
        }
        // Check password
        const isMatch = await bcryptjs.compare(req.body.password, user.password);
        if (!isMatch) {
            logger.error('Passwords do not match');
            return res.status(400).json({ message: "Invalid credentials" });
        }
        logger.info('User logged in successfully');
        // Generate JWT token
        const payload = {
            user: {
                id: user._id.toString(),
            },
        };
        const authtoken = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
        return res.status(200).json({ authtoken, email: user.email, name: user.firstName });
    } catch (e) {
        logger.error('Error logging in:', e);
        return res.status(500).send('Internal server error');
    }
});

router.put('/update', async (req, res, next) => {
    logger.info(`PUT /update called with body: ${JSON.stringify(req.body)}`);
    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.error('Validation errors in update request', errors.array());
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        // Connect to the database
        const db = await connectToDatabase();
        const collection = db.collection("users");
        // Find the user by email
        const email = req.body.email;
        if(!email) {
            logger.error('Email not provided');
            return res.status(400).json({ message: "Email not provided" });
        }
        const user = await collection.findOne({ email });
        if (!user) {
            logger.error('User not found');
            return res.status(404).json({ message: "User not found" });
        }
        user.firstName = req.body.firstName || user.firstName;
        user.updatedAt = new Date();
        // Update user information
        const updatedUser = await collection.findOneAndUpdate(
            { email: req.body.email },
            { $set:  user  },
            { returnDocument: "after" }
        );
        if (!updatedUser) {
            logger.error('Failed to update user');
            return res.status(500).json({ message: "Failed to update user" });
        }
        logger.info('User updated successfully');
        const payload = {
            user: {
                id: updatedUser._id.toString(),
            },
        };
        const authtoken = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
        return res.status(200).json({ message: "User updated successfully", authtoken });
    } catch (e) {
        logger.error('Error updating user:', e);
        return res.status(500).send('Internal server error');
    }
});

module.exports = router;
