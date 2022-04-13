// Default Container
const create_services = require("./create_directory");
const fetch_services = require("./fetch_services");
const update_services = require("./update_services");
const delete_services = require("./delete_directory");

// ==============================
const services_Directory = {};

// Create Services
services_Directory["create"] = create_services;

// Fetch Services
services_Directory["fetch"] = fetch_services;

// update Services
services_Directory["fetch"] = update_services;

// Delete Services
services_Directory["delete"] = delete_services;

// Export
module.exports = services_Directory;
