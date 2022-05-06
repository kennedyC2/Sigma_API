// Fetch laboratory Activity Data For Today
// =======================================================================================

// Dependencies
const file = require("../file");
const folder = require("../dir");
const { validate } = require("../token/main");
const { year } = require("../helper");

// Component
const fetch_lab_activities = (data, callback) => {
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
                        folder.read(dir + "/" + companyID + "/lab_activities", (err) => {
                            if (!err) {
                                // Try Reading File
                                file.read(dir + "/" + companyID + "/lab_activities", year, (err, details) => {
                                    if (!err && details) {
                                        // Return
                                        callback(200, details);
                                    } else {
                                        // Create File
                                        const _data = {};

                                        // Create File
                                        file.create(dir + "/" + companyID + "/lab_activities", year, _data, (err) => {
                                            if (!err) {
                                                // Return
                                                callback(200, _data);
                                            } else {
                                                callback(500, { Error: "Something Happened, Please Try Again LAter" });
                                            }
                                        });
                                    }
                                });
                            } else {
                                // Create Directory & File
                                folder.create(dir + "/" + companyID + "/lab_activities", (err) => {
                                    if (!err) {
                                        //  Define Data
                                        const _data = {};

                                        // Create File
                                        file.create(dir + "/" + companyID + "/lab_activities", year, _data, (err) => {
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
module.exports = fetch_lab_activities;
