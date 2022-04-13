// Handler Container
// ==================================================
//  Import Dependencies
const create_account = require("./create_admin");
const fetch_account = require("./fetch_admin");
const update_account = require("./update_admin");
const delete_account = require("./delete_admin");

// Container
const handlers = {};

// Not Found
handlers.notFound = (data, callback) => {
    callback(404, {});
};

// Index
handlers["index"] = index;

// Create Admin Account
handlers["signUp"] = create_account;

// Fetch Admin Account
handlers["Login"] = fetch_account;

// Update Admin Account
handlers["update"] = update_account;

// Delete Admin Account
handlers["delete"] = delete_account;

// Export Module
module.exports = handlers;
