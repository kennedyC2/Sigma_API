// Default Container
const create_services = require("./create_directory");
const fetch_services = require("./fetch_services");
const update_services = require("./update_services");
const delete_services = require("./delete_directory");

// ==============================
const services_Directory = {};

// Create Services
services_Directory["create_services_directory"] = create_services;

// Fetch Services
services_Directory["fetch_services"] = fetch_services;

// update Services
services_Directory["update_services"] = update_services;

// Delete Services
services_Directory["delete_services_directory"] = delete_services;

// Export
module.exports = services_Directory;
