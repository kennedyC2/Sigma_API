// Default Container
const create_storage = require("./create");
const fetch_storage = require("./fetch");
const delete_storage = require("./delete");

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
