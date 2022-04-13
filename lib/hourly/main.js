// Default Container
const create_hourly = require("./create_directory");
const fetch_hourly = require("./fetch_hourly");
const update_hourly = require("./update_hourly");
const delete_hourly = require("./delete_directory");

// ==============================
const hourly_Directory = {};

// Create Hourly
hourly_Directory["create"] = create_hourly;

// Fetch Hourly
hourly_Directory["fetch"] = fetch_hourly;

// Update Hourly
hourly_Directory["update"] = update_hourly;

// Delete Hourly
hourly_Directory["delete"] = delete_hourly;

// Export
module.exports = hourly_Directory;
