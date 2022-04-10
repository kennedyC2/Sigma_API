// import Dependencies
// =================================================================================
const fs = require("fs");
const path = require("path");

// Container
// ==================================================================================
const folder = {};

// Base Directory
// ==================================================================================
folder["base_directory"] = path.join(__dirname, "./../.data/");

// CREATE FOLDER
// ===================================================================================
folder["create"] = (dir, callback) => {
    // Create folder Irrespective of its existence
    fs.mkdir(folder.base_directory + dir, { recursive: true }, (err) => {
        if (!err) {
            callback(false);
        } else {
            callback(true);
        }
    });
};

// LIST FILES IN DIRECTORY
// ==================================================================================
folder["read"] = (dir, callback) => {
    // Read Directory
    fs.readdir(folder.base_directory + dir, (err, files) => {
        if (!err && files) {
            // Check File Length
            if (files.length > 0) {
                // Define payload
                const payload = files.map((each) => each.replace(".json", ""));

                // Callback data
                callback(false, payload);
            } else {
                callback(false, []);
            }
        } else {
            callback(true);
        }
    });
};

// DELETE DIRECTORY
// =================================================================================
folder["delete"] = (dir, callback) => {
    // Remove directory
    fs.rm(folder.base_directory + dir, { recursive: true, force: true }, (err) => {
        if (!err) {
            callback(false);
        } else {
            callback(true);
        }
    });
};

// Export module
module.exports = folder;
