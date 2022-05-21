// handler for Revenue
// =======================================================

// Import Dependencies
// =======================================================
const file = require("./file");
const directory = require("./directory");
const { validate } = require("./token");
const { date, month, days_In_Month } = require("./helper");

// Container
// =======================================================
const revenue = {};

// Create Revenue Directory
// =======================================================
revenue["create_revenue_directory"] = (type, companyId, callback) => {
    // Validate variables
    const companyID = typeof companyId === "string" && companyId.trim().length > 10 ? companyId.trim() : false;
    const dir = typeof dir === "string" && type.trim().length > 5 ? type.trim().toLowerCase() : false;

    if (dir && companyID) {
        // Create revenue Directory
        directory.create(dir + "/" + companyID + "/revenue", (err) => {
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

// Fetch Revenue
// =======================================================
revenue["fetch_revenue"] = (data, callback) => {
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
                        directory.read(dir + "/" + companyID + "/revenue", (err, list) => {
                            if (!err && list) {
                                if (list.length > 0) {
                                    // Check if this month
                                    if (list[0] === month) {
                                        // Try Reading File
                                        file.read(dir + "/" + companyID + "/revenue", month, (err, details) => {
                                            if (!err && details) {
                                                // Return
                                                callback(200, details, "json");
                                            } else {
                                                callback(500, { error: "Something Happened, Please Try Again LAter" }, "json");
                                            }
                                        });
                                    } else {
                                        // Try Reading File
                                        file.delete(dir + "/" + companyID + "/revenue", list[0], (err) => {
                                            if (!err && details) {
                                                // Create File
                                                const a = [];
                                                const b = [];
                                                for (var i = 1; i < days_In_Month(month) + 1; i++) {
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
                                                        callback(200, _data, "json");
                                                    } else {
                                                        callback(500, { error: "Something Happened, Please Try Again LAter" }, "json");
                                                    }
                                                });
                                            } else {
                                                callback(500, { error: "Something Happened, Please Try Again LAter" }, "json");
                                            }
                                        });
                                    }
                                } else {
                                    // Create File
                                    const a = [];
                                    const b = [];
                                    for (var i = 1; i < days_In_Month(month) + 1; i++) {
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
                                            callback(200, _data, "json");
                                        } else {
                                            callback(500, { error: "Something Happened, Please Try Again LAter" }, "json");
                                        }
                                    });
                                }
                            } else {
                                callback(500, { error: "Something Happened, Please Try Again LAter" }, "json");
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

// Update Revenue
// =======================================================
revenue["update_revenue"] = (type, ID, amount, callback) => {
    // Validate data
    const data = typeof amount === "number" && amount.toString().length > 0 ? amount : false;
    const dir = typeof type === "string" && type.length > 5 ? type : false;
    const companyID = typeof ID === "string" && ID.length > 5 ? ID : false;

    if (data && dir && companyID) {
        // Try Reading File
        file.read(dir + "/" + companyID + "/revenue", month, (err, details) => {
            if (!err && details) {
                // Update
                details.amount[date - 1] = data;
                details.total = data;

                file.update(dir + "/" + companyID + "/revenue", month, details, (err) => {
                    if (!err) {
                        callback(false, details);
                    } else {
                        callback(true);
                    }
                });
            } else {
                // Create File
                const a = [];
                const b = [];
                for (var i = 1; i < days_In_Month(month) + 1; i++) {
                    a.push(i);
                    b.push(0);
                }

                // Update values with New DAta
                b[date - 1] = data;

                const _data = {
                    days: a,
                    amount: b,
                };

                // Create File
                file.create(dir + "/" + companyID + "/revenue", month, _data, (err) => {
                    if (!err) {
                        // Return
                        callback(false, details);
                    } else {
                        callback(true);
                    }
                });
            }
        });
    } else {
        callback(true);
    }
};

// Delete Revenue Directory
// =======================================================
revenue["delete_revenue_directory"] = (type, ID, callback) => {
    // Validate
    const dir = typeof type === "string" && type.length > 5 ? type : false;
    const companyID = typeof ID === "string" && ID.length > 5 ? ID : false;

    if (dir && companyID) {
        directory.delete(dir + "/" + companyID + "/revenue", (err) => {
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

// Export Module
module.exports = revenue;
