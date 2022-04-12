// Default Container
const create_services = require("./create");
const fetch_services = require("./fetch");
const update_services = require("./update");
const delete_services = require("./delete");

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
