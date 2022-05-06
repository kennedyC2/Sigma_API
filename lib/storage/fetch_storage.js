// Fetch Storage Data
// =======================================================================================

// Dependencies
const file = require("../file");
const folder = require("../dir");
const { validate } = require("../token/main");

// Component
const fetch_storage = (data, callback) => {
    // Validate Method
    switch (data.method) {
        case "options":
            callback(200, {});
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
                        folder.read(dir + "/" + companyID + "/storage", (err) => {
                            if (!err) {
                                // Check File
                                file.read(dir + "/" + companyID + "/storage", "storage", (err, details) => {
                                    if (!err) {
                                        // Return
                                        callback(200, details);
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
                                                callback(200, data);
                                            } else {
                                                callback(500, { Error: "Something Happened, Please Try Again Later" });
                                            }
                                        });
                                    }
                                });
                            } else {
                                folder.create(dir + "/" + companyID + "/storage", (err) => {
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
                                                callback(200, data);
                                            } else {
                                                callback(500, { Error: "Something Happened, Please Try Again Later" });
                                            }
                                        });
                                    } else {
                                        callback(500, { Error: "Something Happened, Please Try Again Later" });
                                    }
                                });
                            }
                        });
                    } else {
                        callback(400, { Error: "Invalid Token" });
                    }
                });
            } else {
                callback(400, { Error: "Missing Required Fields" });
            }
            break;

        default:
            callback(405, {});
            break;
    }
};

// Export
module.exports = fetch_storage;
