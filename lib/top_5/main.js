// Default Container
const create_top_5 = require("./create");
const fetch_top_5 = require("./fetch");
const update_stat_top_5 = require("./update_stat");
const update_test_top_5 = require("./update_test");
const delete_top_5 = require("./delete");

// ==============================
const top_5_Directory = {};

// Create Hourly
top_5_Directory["create"] = create_top_5;

// Create Hourly
top_5_Directory["fetch"] = fetch_top_5;

// Create Hourly
top_5_Directory["stat"] = update_stat_top_5;

// Create Hourly
top_5_Directory["test"] = update_test_top_5;

// Create Hourly
top_5_Directory["delete"] = delete_top_5;

// Export
module.exports = top_5_Directory;
