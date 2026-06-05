require('dotenv').config();
const express = require('express');
const cors = require('cors');

const connectToDatabase = require('./models/db');
const giftRoutes = require('./routes/giftRoutes');
const searchRoutes = require('./routes/searchRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

// 🔥 IMPORTANT: USE 5000 FOR TESTING (MARKS REQUIREMENT)
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// routes
app.use('/api/gifts', giftRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/auth', authRoutes);

// health check
app.get("/", (req, res) => {
    res.send("GiftLink API Running");
});

// start server
app.listen(port, async () => {
    try {
        await connectToDatabase();
        console.log(`Server running on port ${port}`);
    } catch (err) {
        console.error(err);
    }
});

module.exports = app;