// Fetch Revenue Data For Today
// =======================================================================================

// Dependencies
const file = require("./../file");
const folder = require("./../dir");
const token = require("./../token/main");
const helper = require("./../helper");

// Component
const fetch_revenue = (data, callback) => {
    // Validate Method
    switch (data.method) {
        case "options":
            callback(200, {});
            break;

        case "get":
            // Validate data
            const tokenID = typeof data.query.tokenID === "string" && data.query.tokenID.trim().length > 20 ? data.query.tokenID.trim() : false;
            const type = typeof data.query.type === "string" && data.query.type.trim().length > 5 ? data.query.type.trim().toLowerCase() : false;
            const companyID = typeof data.query.companyID === "string" && data.query.companyID.trim().length > 10 ? data.query.companyID.trim() : false;

            if (tokenID && companyID && type) {
                // Validate Token
                token.validate(tokenID, (err) => {
                    if (!err) {
                        // ==========
                        const month = helper.month();
                        const today = helper.today();
                        const days = helper.days(month);

                        // Check Directory
                        folder.read(type + "/" + companyID + "/revenue/" + month, (err) => {
                            if (!err) {
                                // Try Reading File
                                file.read(type + "/" + companyID + "/revenue/" + month, today, (err, details) => {
                                    if (!err && details) {
                                        // Return
                                        callback(200, details);
                                    } else {
                                        // Create File
                                        const arr = [];
                                        for (var i = 0; i < days; i++) {
                                            arr.push(0);
                                        }

                                        const _data = {
                                            days: arr,
                                            amount: arr,
                                        };

                                        // Create File
                                        file.create(type + "/" + companyID + "/revenue/" + month, today, _data, (err) => {
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
                                folder.create(type + "/" + companyID + "/revenue/" + month, (err) => {
                                    if (!err) {
                                        // Create File
                                        const arr = [];
                                        for (var i = 0; i < days; i++) {
                                            arr.push(0);
                                        }

                                        const _data = {
                                            days: arr,
                                            amount: arr,
                                        };
                                        // Create File
                                        file.create(type + "/" + companyID + "/revenue/" + month, today, _data, (err) => {
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
module.exports = fetch_revenue;
