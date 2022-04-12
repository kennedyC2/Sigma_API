// Default Container
const create_revenue = require("./create");
const fetch_revenue = require("./create");
const update_revenue = require("./update");
const delete_revenue = require("./delete");

// ==============================
const revenue_Directory = {};

// Create Hourly
revenue_Directory["create"] = create_revenue;

// Fetch Hourly
revenue_Directory["fetch"] = fetch_revenue;

// Update Hourly
revenue_Directory["update"] = update_revenue;

// Delete Hourly
revenue_Directory["delete"] = delete_revenue;

// Export
module.exports = revenue_Directory;
