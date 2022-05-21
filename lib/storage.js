// handler for Storage
// =======================================================

// Import Dependencies
// =======================================================
const file = require("./file");
const directory = require("./directory");
const { validate } = require("./token");

// Container
// =======================================================
const storage = {};

// Create Storage Directory
// =======================================================
storage["create_storage_directory"] = (type, companyId, callback) => {
    // Validate variables
    const companyID = typeof companyId === "string" && companyId.trim().length > 10 ? companyId.trim() : false;
    const dir = typeof type === "string" && type.trim().length > 5 ? type.trim().toLowerCase() : false;

    if (dir && companyID) {
        // Create storage Directory
        directory.create(dir + "/" + companyID + "/storage", (err) => {
            if (!err) {
                callback(false);
            } else {
                callback(true);
            }
        });
    } else {
        callback(true);
    }
};

// Fetch Storage Data
// =======================================================
storage["fetch_storage"] = (data, callback) => {
    // Validate Method
    switch (data.method) {
        case "options":
            callback(200, {}, "json");
            break;

        case "get":
            // Validate data
            const tokenID = typeof data.query.tokenID === "string" && data.query.tokenID.trim().length > 20 ? data.query.tokenID.trim() : false;
            const dir = typeof data.query.type === "string" && data.query.type.trim().length > 5 ? data.query.type.trim().toLowerCase() : false;
            const companyID = typeof data.query.companyID === "string" && data.query.companyID.trim().length > 10 ? data.query.companyID.trim() : false;

            if (tokenID && companyID && dir) {
                // Validate Token
                validate(tokenID, (err) => {
                    if (!err) {
                        // Check Directory
                        directory.read(dir + "/" + companyID + "/storage", (err) => {
                            if (!err) {
                                // Check File
                                file.read(dir + "/" + companyID + "/storage", "storage", (err, details) => {
                                    if (!err) {
                                        // Return
                                        callback(200, details, "json");
                                    } else {
                                        // Define Data
                                        const data = {
                                            completed: 0,
                                            pending: 0,
                                            kits: 0,
                                        };

                                        // Update
                                        file.create(dir + "/" + companyID + "/storage", "storage", data, (err) => {
                                            if (!err) {
                                                // Return
                                                callback(200, data, "json");
                                            } else {
                                                callback(500, { error: "Something Went Wrong, Please Try Again Later" }, "json");
                                            }
                                        });
                                    }
                                });
                            } else {
                                directory.create(dir + "/" + companyID + "/storage", (err) => {
                                    if (!err) {
                                        // Define Data
                                        const data = {
                                            completed: 0,
                                            pending: 0,
                                            kits: 0,
                                        };

                                        // Update
                                        file.create(dir + "/" + companyID + "/storage", "storage", data, (err) => {
                                            if (!err) {
                                                // Return
                                                callback(200, data, "json");
                                            } else {
                                                callback(500, { error: "Something Went Wrong, Please Try Again Later" }, "json");
                                            }
                                        });
                                    } else {
                                        callback(500, { error: "Something Went Wrong, Please Try Again Later" }, "json");
                                    }
                                });
                            }
                        });
                    } else {
                        callback(400, { error: "Invalid Token" }, "json");
                    }
                });
            } else {
                callback(400, { error: "Missing Required Fields" }, "json");
            }
            break;

        default:
            callback(405, {}, "json");
            break;
    }
};

// Delete Storage Directory
// =======================================================
storage["delete_storage_directory"] = (dir, ID, callback) => {
    // Validate
    const type = typeof dir === "string" && dir.length > 5 ? dir : false;
    const companyID = typeof ID === "string" && ID.length > 5 ? ID : false;

    if (type && companyID) {
        directory.delete(type + "/" + companyID + "/storage", (err) => {
            if (!err) {
                // Return
                callback(false);
            } else {
                callback(true);
            }
        });
    } else {
        callback(true);
    }
};

// Export module
module.exports = storage;
