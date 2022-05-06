// Default Container
const create_top_5 = require("./create_directory");
const fetch_top_5 = require("./fetch_top_5");
const update_stat_top_5 = require("./update_top_5_stat");
const update_test_top_5 = require("./update_top_5_test");
const delete_top_5 = require("./delete_directory");

// ==============================
const top_5_Directory = {};

// Create Hourly
top_5_Directory["create_top_5_directory"] = create_top_5;

// Create Hourly
top_5_Directory["fetch_top_5"] = fetch_top_5;

// Create Hourly
top_5_Directory["update_top_5_stats"] = update_stat_top_5;

// Create Hourly
top_5_Directory["update_top_5_tests"] = update_test_top_5;

// Create Hourly
top_5_Directory["delete_top_5_directory"] = delete_top_5;

// Export
module.exports = top_5_Directory;
