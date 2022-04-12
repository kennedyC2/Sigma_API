// Default Container
const create_account = require("./create");
const fetch_user = require("./fetch");
const create_user = require("./create_user");
const update_user = require("./update_user");
const update_user_activity = require("./update_activity");
const delete_user = require("./delete_user");
const delete_account = require("./fetch");

// ==============================
const user_Directory = {};

// Create Hourly
user_Directory["create_account"] = create_account;

// Create Hourly
user_Directory["fetch"] = fetch_user;

// Create Hourly
user_Directory["create_user"] = create_user;

// Create Hourly
user_Directory["update_user"] = update_user;

// Create Hourly
user_Directory["update_activity"] = update_user_activity;

// Create Hourly
user_Directory["delete_user"] = delete_user;

// Create Hourly
user_Directory["delete_account"] = delete_account;

// Export
module.exports = user_Directory;
