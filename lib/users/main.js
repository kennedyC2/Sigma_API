// Default Container
const create_account = require("./create_directory");
const fetch_user = require("./fetch_user");
const create_user = require("./create_user");
const update_user = require("./update_user");
const update_user_activity = require("./update_user_activity");
const delete_user = require("./delete_user");
const delete_account = require("./fetch_user");

// ==============================
const user_Directory = {};

// Create Hourly
user_Directory["create_user_directory"] = create_account;

// Create Hourly
user_Directory["fetch_user_account"] = fetch_user;

// Create Hourly
user_Directory["create_user_account"] = create_user;

// Create Hourly
user_Directory["update_user_account"] = update_user;

// Create Hourly
user_Directory["update_user_activity"] = update_user_activity;

// Create Hourly
user_Directory["delete_user_account"] = delete_user;

// Create Hourly
user_Directory["delete_user_directory"] = delete_account;

// Export
module.exports = user_Directory;
