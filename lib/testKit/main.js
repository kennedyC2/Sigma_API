// Default Container
const create_testKit = require("./create_directory");
const fetch_testKit = require("./fetch_testKits");
const update_testKit = require("./update_kit");
const update_activity = require("./update_kit_activity");
const add_testKit = require("./add_kit");
const delete_testKit = require("./delete_directory");

// ==============================
const testKit_Directory = {};

// Create TestKits
testKit_Directory["create_testKit_directory"] = create_testKit;

// Create TestKits
testKit_Directory["fetch_testKits"] = fetch_testKit;

// Create TestKits
testKit_Directory["update_testKits"] = update_testKit;

// Create TestKits
testKit_Directory["update_testKit_activity"] = update_activity;

// Create TestKits
testKit_Directory["add_testKit"] = add_testKit;

// Create TestKits
testKit_Directory["delete_testKits_directory"] = delete_testKit;

// Export
module.exports = testKit_Directory;
