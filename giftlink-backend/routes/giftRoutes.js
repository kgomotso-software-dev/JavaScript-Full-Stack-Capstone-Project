const express = require('express');
const router = express.Router();
const connectToDatabase = require('../models/db');
const logger = require('../logger');

// GET ALL GIFTS
router.get('/', async (req, res, next) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection("gifts");

        const gifts = await collection.find({}).toArray();
        res.json(gifts);

    } catch (e) {
        next(e);
    }
});

// GET GIFT BY ID (FIXED)
router.get('/:id', async (req, res, next) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection("gifts");

        const id = req.params.id;

        if (!id) {
            return res.status(400).json({
                message: "Gift ID is required"
            });
        }

        const gift = await collection.findOne({
            id: id.toString()
        });

        if (!gift) {
            return res.status(404).json({
                message: "Gift not found"
            });
        }

        return res.status(200).json(gift);

    } catch (e) {
        console.error("Error fetching gift:", e);
        next(e);
    }
});

// ADD GIFT
router.post('/', async (req, res, next) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection("gifts");

        const result = await collection.insertOne(req.body);

        res.status(201).json({
            id: result.insertedId,
            ...req.body
        });

    } catch (e) {
        next(e);
    }
});

module.exports = router;