// Default Container
const create_revenue = require("./create_directory");
const fetch_revenue = require("./fetch_revenue");
const update_revenue = require("./update_revenue");
const delete_revenue = require("./delete_directory");

// ==============================
const revenue_Directory = {};

// Create Hourly
revenue_Directory["create_revenue_directory"] = create_revenue;

// Fetch Hourly
revenue_Directory["fetch_revenue"] = fetch_revenue;

// Update Hourly
revenue_Directory["update_revenue"] = update_revenue;

// Delete Hourly
revenue_Directory["delete_revenue"] = delete_revenue;

// Export
module.exports = revenue_Directory;
