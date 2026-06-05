const express = require('express');
const router = express.Router();
const connectToDatabase = require('../models/db');

router.get('/', async (req, res, next) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection("gifts");

        let query = {};

        if (req.query.category) {
            query.category = { $regex: req.query.category, $options: "i" };
        }

        if (req.query.name) {
            query.name = { $regex: req.query.name, $options: "i" };
        }

        const results = await collection.find(query).toArray();
        res.json(results);

    } catch (e) {
        next(e);
    }
});

module.exports = router;