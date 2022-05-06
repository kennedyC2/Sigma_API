// Fetch Revenue Data For Today
// =======================================================================================

// Dependencies
const file = require("../file");
const folder = require("../dir");
const { validate } = require("../token/main");
const { month, days_In_Month } = require("../helper");

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
            const dir = typeof data.query.type === "string" && data.query.type.trim().length > 5 ? data.query.type.trim().toLowerCase() : false;
            const companyID = typeof data.query.companyID === "string" && data.query.companyID.trim().length > 10 ? data.query.companyID.trim() : false;

            if (tokenID && companyID && dir) {
                // Validate Token
                validate(tokenID, (err) => {
                    if (!err) {
                        // ==========
                        const days = days_In_Month(month);

                        // Check Directory
                        folder.read(dir + "/" + companyID + "/revenue", (err, list) => {
                            if (!err && list) {
                                if (list.length > 0) {
                                    // Check if this month
                                    if (list[0] === month) {
                                        // Try Reading File
                                        file.read(dir + "/" + companyID + "/revenue", month, (err, details) => {
                                            if (!err && details) {
                                                // Return
                                                callback(200, details);
                                            } else {
                                                callback(500, { Error: "Something Happened, Please Try Again LAter" });
                                            }
                                        });
                                    } else {
                                        // Try Reading File
                                        file.delete(dir + "/" + companyID + "/revenue", list[0], (err) => {
                                            if (!err && details) {
                                                // Create File
                                                const a = [];
                                                const b = [];
                                                for (var i = 1; i < days + 1; i++) {
                                                    a.push(i);
                                                    b.push(0);
                                                }

                                                const _data = {
                                                    days: a,
                                                    amount: b,
                                                    total: 0,
                                                };

                                                // Create this month
                                                file.create(dir + "/" + companyID + "/revenue", month, _data, (err) => {
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
                                } else {
                                    // Create File
                                    const a = [];
                                    const b = [];
                                    for (var i = 1; i < days + 1; i++) {
                                        a.push(i);
                                        b.push(0);
                                    }

                                    const _data = {
                                        days: a,
                                        amount: b,
                                        total: 0,
                                    };

                                    // Create File
                                    file.create(dir + "/" + companyID + "/revenue", month, _data, (err) => {
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
                                folder.create(dir + "/" + companyID + "/revenue", (err) => {
                                    if (!err) {
                                        // Create File
                                        const a = [];
                                        const b = [];
                                        for (var i = 1; i < days + 1; i++) {
                                            a.push(i);
                                            b.push(0);
                                        }

                                        const _data = {
                                            days: a,
                                            amount: b,
                                            total: 0,
                                        };

                                        // Create File
                                        file.create(dir + "/" + companyID + "/revenue", month, _data, (err) => {
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
