// Dependencies
const { MongoClient, ObjectId } = require("mongodb");

// Server URL
// const s_url = "mongodb+srv://NodeApp:C2FGwthfGr3hEzPM@test.v3cuzhq.mongodb.net/?retryWrites=true&w=majority";
const s_url = "mongodb://localhost:27017/";
// const s_url = "mongodb://host.docker.internal:27017/";
// const s_url = "mongodb://makkie_db:27017/";

// Database
const database = "Medsoph";

// Initialize
const client = new MongoClient(s_url);

// Container
const mongo = {};

mongo["client"] = client
mongo["database"] = database
mongo["ObjectId"] = ObjectId


module.exports = mongo;
