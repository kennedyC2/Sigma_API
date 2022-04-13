// Fetch Test Data
// =======================================================================================

// Dependencies
const file = require("../file");
const folder = require("../dir");
const token = require("../token/main");
const helper = require("../helper");

// Component
const fetch_tests = (data, callback) => {
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
                        // ==========
                        const month = helper.month();

                        // Check Directory
                        folder.read(dir + "/" + companyID + "/tests/" + month, (err) => {
                            if (!err) {
                                // Try Unsettled Reading File
                                file.read(dir + "/" + companyID + "/tests", "unsettled", (err, details_1) => {
                                    if (!err && details_1) {
                                        // Try settled Reading File
                                        file.read(dir + "/" + companyID + "/tests/" + month, "settled", (err, details_2) => {
                                            if (!err && details_2) {
                                                // Return
                                                callback(200, {
                                                    unsettled: details_1,
                                                    settled: details_2,
                                                });
                                            } else {
                                                // Create File
                                                const _data = {};

                                                // Create settled File
                                                file.create(dir + "/" + companyID + "/tests/" + month, "settled", _data, (err) => {
                                                    if (!err) {
                                                        // Return
                                                        callback(200, {
                                                            unsettled: details_1,
                                                            settled: _data,
                                                        });
                                                    } else {
                                                        callback(500, { Error: "Something Happened, Please Try Again LAter" });
                                                    }
                                                });
                                            }
                                        });
                                    } else {
                                        // Create File
                                        const _data = {};

                                        // Create unsettled File
                                        file.create(dir + "/" + companyID + "/tests", "unsettled", _data, (err) => {
                                            if (!err) {
                                                // Create settled File
                                                file.create(dir + "/" + companyID + "/tests/" + month, "settled", _data, (err) => {
                                                    if (!err) {
                                                        // Return
                                                        callback(200, {
                                                            unsettled: _data,
                                                            settled: _data,
                                                        });
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
                                // Create Unsettled Directory
                                folder.create(dir + "/" + companyID + "/tests/" + month, (err) => {
                                    if (!err) {
                                        // Create File
                                        const _data = {};

                                        // Create unsettled File
                                        file.create(dir + "/" + companyID + "/tests", "unsettled", _data, (err) => {
                                            if (!err) {
                                                // Create settled File
                                                file.create(dir + "/" + companyID + "/tests/" + month, "settled", _data, (err) => {
                                                    if (!err) {
                                                        // Return
                                                        callback(200, {
                                                            unsettled: _data,
                                                            settled: _data,
                                                        });
                                                    } else {
                                                        callback(500, { Error: "Something Happened, Please Try Again LAter" });
                                                    }
                                                });
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
module.exports = fetch_tests;
