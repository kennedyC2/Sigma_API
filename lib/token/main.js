// Main Branch For tokens
// ==============================================================
const create_token = require("./create_token");
const fetch_token = require("./fetch_token");
const update_token = require("./update_token");
const delete_token = require("./delete_token");
const validateToken = require("./validateToken");

// Container
const tokens = {};

// Create Token
tokens["create"] = create_token;

// Fetch Token
tokens["fetch"] = fetch_token;

// update Token
tokens["update"] = update_token;

// Delete Token
tokens["delete"] = delete_token;

// Validate Token
tokens["validate"] = validateToken;

// Export
module.exports = tokens;
