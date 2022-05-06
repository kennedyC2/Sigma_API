// Fetch Top_5 Data
// =======================================================================================

// Dependencies
const file = require("../file");
const folder = require("../dir");
const token = require("../token/main");
const helper = require("../helper");

// Component
const fetch_top_5 = (data, callback) => {
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
                token.validate(tokenID, (err) => {
                    if (!err) {
                        // Check Directory
                        folder.read(dir + "/" + companyID + "/top_5/", (err) => {
                            if (!err) {
                                // Try Reading File
                                file.read(dir + "/" + companyID + "/top_5", "top_5", (err, details) => {
                                    if (!err && details) {
                                        // Return
                                        callback(200, details);
                                    } else {
                                        // Create File
                                        const _data = {
                                            sorted: false,
                                            tests: {},
                                        };

                                        // Create File
                                        file.create(dir + "/" + companyID + "/top_5", "top_5", _data, (err) => {
                                            if (!err) {
                                                // Return
                                                callback(200, _data);
                                            } else {
                                                callback(500, { Error: "Something Happened, Please Try Again Later" });
                                            }
                                        });
                                    }
                                });
                            } else {
                                // Create Directory & File
                                folder.create(dir + "/" + companyID + "/top_5/", (err) => {
                                    if (!err) {
                                        // Create File
                                        const _data = {
                                            sorted: false,
                                            tests: {},
                                        };
                                        // Create File
                                        file.create(dir + "/" + companyID + "/top_5", "top_5", _data, (err) => {
                                            if (!err) {
                                                // Return
                                                callback(200, _data);
                                            } else {
                                                callback(500, { Error: "Something Happened, Please Try Again LAter" });
                                            }
                                        });
                                    } else {
                                        callback(500, { Error: "Something Happened, Please Try Again LAter" });
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
module.exports = fetch_top_5;
