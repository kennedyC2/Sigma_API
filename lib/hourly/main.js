// Default Container
const create_hourly = require("./create");
const fetch_hourly = require("./fetch");
const update_hourly = require("./update");
const delete_hourly = require("./delete");

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
