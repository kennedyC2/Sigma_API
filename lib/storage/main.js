// Default Container
const create_storage = require("./create_directory");
const fetch_storage = require("./fetch_storage");
const delete_storage = require("./delete_directory");

// ==============================
const storage_Directory = {};

// Create storage
storage_Directory["create"] = create_storage;

// Fetch storage
storage_Directory["fetch"] = fetch_storage;

// Fetch storage
storage_Directory["delete"] = delete_storage;

// Export
module.exports = storage_Directory;
