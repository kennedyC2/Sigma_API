// import Dependencies
// =================================================================================
const fs = require("fs");
const path = require("path");
const helpers = require("./helper");

// Container
// ==================================================================================
const file = {};

// Base Directory
// ==================================================================================
file["base_directory"] = path.join(__dirname, "./../.data/");

// CREATE FILE
// ===================================================================================
file["create"] = (dir, filename, data, callback) => {
    // Open File
    fs.open(file.base_directory + dir + "/" + filename + ".json", "wx", (err, fd) => {
        // Check for Error
        if (!err && fd) {
            // Prepare Data
            const payload = JSON.stringify(data);

            // Write data
            fs.writeFile(fd, payload, (err) => {
                if (!err) {
                    // Close File
                    fs.close(fd, (err) => {
                        if (!err) {
                            callback(false);
                        } else {
                            callback(true);
                        }
                    });
                } else {
                    callback(true);
                }
            });
        } else {
            callback(true);
        }
    });
};

// READ FILE
// ===================================================================================
file["read"] = (dir, filename, callback) => {
    // Read
    fs.readFile(file.base_directory + dir + "/" + filename + ".json", "utf8", (err, data) => {
        if (!err && data) {
            callback(false, helpers.parseJSONObject(data));
        } else {
            callback(true);
        }
    });
};

// UPDATE / EDIT FILE
// ==================================================================================
file["update"] = (dir, filename, data, callback) => {
    // Open file
    fs.open(file.base_directory + dir + "/" + filename + ".json", "r+", (err, fd) => {
        if (!err && fd) {
            // truncate file
            fs.truncate(file.base_directory + dir + "/" + filename + ".json", (err) => {
                if (!err) {
                    // Define data
                    const payload = JSON.stringify(data);

                    // Write to file
                    fs.writeFile(fd, payload, (err) => {
                        if (!err) {
                            // Close File
                            fs.close(fd, (err) => {
                                if (!err) {
                                    callback(false);
                                } else {
                                    callback(true);
                                }
                            });
                        } else {
                            callback(true);
                        }
                    });
                } else {
                    callback(true);
                }
            });
        } else {
            callback(true);
        }
    });
};

// DELETE FILE
// =========================================================================================
file["delete"] = (dir, filename, callback) => {
    // Delete File
    fs.unlink(file.base_directory + dir + "/" + filename + ".json", (err) => {
        if (!err) {
            callback(false);
        } else {
            callback(true);
        }
    });
};

// Export Module
module.exports = file;
