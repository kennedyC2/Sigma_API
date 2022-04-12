// Default Container
const create_lab_activity = require("./create");
const fetch_lab_activity = require("./fetch");
const update_lab_activity = require("./update");
const delete_lab_activity = require("./delete");

// ==============================
const lab_activity_Directory = {};

// Create Hourly
lab_activity_Directory["create"] = create_lab_activity;

// Fetch Hourly
lab_activity_Directory["fetch"] = fetch_lab_activity;

// Update Hourly
lab_activity_Directory["update"] = update_lab_activity;

// Delete Hourly
lab_activity_Directory["delete"] = delete_lab_activity;

// Export
module.exports = lab_activity_Directory;
