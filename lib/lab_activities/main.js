// Default Container
const create_lab_activity = require("./create");

// ==============================
const lab_activity_Directory = {};

// Create Hourly
lab_activity_Directory["create"] = create_lab_activity;

// Export
module.exports = lab_activity_Directory;
