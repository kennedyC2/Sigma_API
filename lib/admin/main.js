// Handler Container
// ==================================================
//  Import Dependencies
const create_account = require("./create_admin");
const create_admin_directory = require("./create_directory");
const authenticate = require("./auth");
const fetch_account = require("./fetch_admin");
const update_account = require("./update_admin");
const delete_account = require("./delete_admin");

// Container
const handlers = {};

// Not Found
handlers.notFound = (data, callback) => {
    callback(404, {});
};

// Create Admin Account
handlers["signUp"] = create_account;

// Fetch Admin Account
handlers["Login"] = authenticate;

// create Admin Account
handlers["create_admin_directory"] = create_admin_directory;

// Fetch Admin Account
handlers["fetch"] = fetch_account;

// Update Admin Account
handlers["update"] = update_account;

// Delete Admin Account
handlers["_delete"] = delete_account;

// Export Module
module.exports = handlers;
