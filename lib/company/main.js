// Company Account Handler
// =================================================================================

// Import Dependencies
const create_company = require("./create_company");
const fetch_company = require("./fetch_company");
const update_company = require("./update_company");
const delete_company = require("./delete_company");

// Container
// ================================================================================
const company = {};

// Create Account
// ================================================================================
company["create_company"] = create_company;

// fetch Account
// ================================================================================
company["fetch_company"] = fetch_company;

// update Account
// ================================================================================
company["update_company"] = update_company;

// delete Account
// ================================================================================
company["delete_company"] = delete_company;

// Export
module.exports = company;
