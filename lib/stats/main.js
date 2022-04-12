// Default Container
const create_stats = require("./create");
const fetch_stats = require("./fetch");
const delete_stats = require("./delete");

// ==============================
const stats_Directory = {};

// Create stats
stats_Directory["create"] = create_stats;

// Fetch stats
stats_Directory["fetch"] = fetch_stats;

// Fetch stats
stats_Directory["delete"] = delete_stats;

// Export
module.exports = stats_Directory;
