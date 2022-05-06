// Fetch Hourly Data For Today
// =======================================================================================

// Dependencies
const file = require("../file");
const folder = require("../dir");
const { validate } = require("../token/main");
const { today } = require("../helper");

// Component
const fetch_hourly = (data, callback) => {
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
                        folder.read(dir + "/" + companyID + "/hourly", (err, list) => {
                            if (!err && list) {
                                // Check If Empty
                                if (list.length > 0) {
                                    // Check NEw Day
                                    if (list[0] === today()) {
                                        // Try Reading File
                                        file.read(dir + "/" + companyID + "/hourly", today(), (err, details) => {
                                            if (!err && details) {
                                                // Return
                                                callback(200, details);
                                            } else {
                                                callback(500, { Error: "Something Happened, Please Try Again LAter" });
                                            }
                                        });
                                    } else {
                                        // Try Reading File
                                        file.read(dir + "/" + companyID + "/hourly", list[0], (err, details) => {
                                            if (!err && details) {
                                                // Write New
                                                details.amount = [0, 0, 0, 0, 0, 0, 0, 0];
                                                details.total = 0;

                                                // Create Today
                                                file.create(dir + "/" + companyID + "/hourly", today(), details, (err) => {
                                                    if (!err) {
                                                        // Delete Yesterday
                                                        file.delete(dir + "/" + companyID + "/hourly", list[0], (err) => {
                                                            if (!err) {
                                                                // Return
                                                                callback(200, details);
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
                                } else {
                                    //  Define Data
                                    const _data = {
                                        amount: [0, 0, 0, 0, 0, 0, 0, 0],
                                        total: 0,
                                    };

                                    // Create File
                                    file.create(dir + "/" + companyID + "/hourly", today(), _data, (err) => {
                                        if (!err) {
                                            // Return
                                            callback(200, _data);
                                        } else {
                                            callback(500, { Error: "Something Happened, Please Try Again LAter" });
                                        }
                                    });
                                }
                            } else {
                                // Create Directory & File
                                folder.create(dir + "/" + companyID + "/hourly", (err) => {
                                    if (!err) {
                                        //  Define Data
                                        const _data = {
                                            amount: [0, 0, 0, 0, 0, 0, 0, 0],
                                            total: 0,
                                        };

                                        // Create File
                                        file.create(dir + "/" + companyID + "/hourly", today(), _data, (err) => {
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
module.exports = fetch_hourly;
