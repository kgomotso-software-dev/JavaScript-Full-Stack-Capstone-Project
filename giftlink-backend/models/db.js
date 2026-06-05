require('dotenv').config();

const { MongoClient } = require('mongodb');

let dbInstance = null;
let client = null;
const dbName = "giftdb";

async function connectToDatabase() {
    const url = process.env.MONGO_URL;

    if (!url) {
        throw new Error("MONGO_URL is not set");
    }

    if (dbInstance) return dbInstance;

    if (!client) {
        client = new MongoClient(url);
        await client.connect();
        console.log("Connected to MongoDB");
    }

    dbInstance = client.db(dbName);
    return dbInstance;
}

module.exports = connectToDatabase;