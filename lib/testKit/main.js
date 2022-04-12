// Default Container
const create_testKit = require("./create");
const fetch_testKit = require("./fetch");
const update_testKit = require("./update_kit");
const update_activity = require("./update_activity");
const delete_testKit = require("./delete");

// ==============================
const testKit_Directory = {};

// Create Hourly
testKit_Directory["create"] = create_testKit;

// Create Hourly
testKit_Directory["fetch"] = fetch_testKit;

// Create Hourly
testKit_Directory["update_kit"] = update_testKit;

// Create Hourly
testKit_Directory["update_activity"] = update_activity;

// Create Hourly
testKit_Directory["delete"] = delete_testKit;

// Export
module.exports = testKit_Directory;
