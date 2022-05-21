// handler for Hourly Inputs
// =======================================================

// Import Dependencies
// =======================================================
const file = require("./file");
const directory = require("./directory");
const { validate } = require("./token");
const { today, hour } = require("./helper");

// Container
// =======================================================
const hourly = {};

// Create Hourly Directory
// =======================================================
hourly["create_hourly_directory"] = (type, companyId, callback) => {
    // Validate variables
    const companyID = typeof companyId === "string" && companyId.trim().length > 10 ? companyId.trim() : false;
    const dir = typeof type === "string" && type.trim().length > 5 ? type.trim().toLowerCase() : false;

    if (dir && companyID) {
        // Create hourly Directory
        directory.create(dir + "/" + companyID + "/hourly", (err) => {
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

// Fetch Hourly
// =======================================================
hourly["fetch_hourly"] = (data, callback) => {
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
                        directory.read(dir + "/" + companyID + "/hourly", (err, list) => {
                            if (!err && list) {
                                // Check If Empty
                                if (list.length > 0) {
                                    // Check NEw Day
                                    if (list[0] === today) {
                                        // Try Reading File
                                        file.read(dir + "/" + companyID + "/hourly", today, (err, details) => {
                                            if (!err && details) {
                                                // Return
                                                callback(200, details, "json");
                                            } else {
                                                callback(500, { error: "Something Happened, Please Try Again LAter" }, "json");
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
                                                file.create(dir + "/" + companyID + "/hourly", today, details, (err) => {
                                                    if (!err) {
                                                        // Delete Yesterday
                                                        file.delete(dir + "/" + companyID + "/hourly", list[0], (err) => {
                                                            if (!err) {
                                                                // Return
                                                                callback(200, details, "json");
                                                            } else {
                                                                callback(500, { error: "Something Happened, Please Try Again LAter" }, "json");
                                                            }
                                                        });
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
                                    //  Define Data
                                    const _data = {
                                        amount: [0, 0, 0, 0, 0, 0, 0, 0],
                                        total: 0,
                                    };

                                    // Create File
                                    file.create(dir + "/" + companyID + "/hourly", today, _data, (err) => {
                                        if (!err) {
                                            // Return
                                            callback(200, _data, "json");
                                        } else {
                                            callback(500, { error: "Something Happened, Please Try Again LAter" }, "json");
                                        }
                                    });
                                }
                            } else {
                                // Create Directory & File
                                directory.create(dir + "/" + companyID + "/hourly", (err) => {
                                    if (!err) {
                                        //  Define Data
                                        const _data = {
                                            amount: [0, 0, 0, 0, 0, 0, 0, 0],
                                            total: 0,
                                        };

                                        // Create File
                                        file.create(dir + "/" + companyID + "/hourly", today, _data, (err) => {
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

// Update Hourly
// =======================================================
hourly["update_hourly"] = (dir, ID, data, callback) => {
    // Validate amount
    const payload = typeof data === "object" ? data : false;
    const type = typeof dir === "string" && dir.length > 5 ? dir : false;
    const companyID = typeof ID === "string" && ID.length > 5 ? ID : false;

    if (payload && type && companyID) {
        // Check directory
        directory.read(type + "/" + companyID + "/hourly", (err, item) => {
            if (!err && item) {
                if (item.length > 0) {
                    // Check File
                    if (item[0] === today) {
                        // Try Reading File
                        file.read(type + "/" + companyID + "/hourly", today, (err, details) => {
                            if (!err && details) {
                                // Update

                                if (parseInt(hour.split(":")[0]) <= 8 && hour.split(":")[1] === "am") {
                                    details["amount"][0] += parseInt(payload.selectedTest.map((cost) => cost.split(":").pop()));
                                }

                                if (parseInt(hour.split(":")[0]) > 8 && parseInt(hour.split(":")[0]) <= 10 && hour.split(":")[1] === "am") {
                                    details["amount"][1] += parseInt(payload.selectedTest.map((cost) => cost.split(":").pop()));
                                }

                                if (parseInt(hour.split(":")[0]) > 10 && parseInt(hour.split(":")[0]) <= 12 && hour.split(":")[1] === "pm") {
                                    details["amount"][2] += parseInt(payload.selectedTest.map((cost) => cost.split(":").pop()));
                                }

                                if (parseInt(hour.split(":")[0]) > 0 && parseInt(hour.split(":")[0]) <= 2 && hour.split(":")[1] === "pm") {
                                    details["amount"][3] += parseInt(payload.selectedTest.map((cost) => cost.split(":").pop()));
                                }

                                if (parseInt(hour.split(":")[0]) > 2 && parseInt(hour.split(":")[0]) <= 4 && hour.split(":")[1] === "pm") {
                                    details["amount"][4] += parseInt(payload.selectedTest.map((cost) => cost.split(":").pop()));
                                }

                                if (parseInt(hour.split(":")[0]) > 4 && parseInt(hour.split(":")[0]) <= 6 && hour.split(":")[1] === "pm") {
                                    details["amount"][5] += parseInt(payload.selectedTest.map((cost) => cost.split(":").pop()));
                                }

                                if (parseInt(hour.split(":")[0]) > 6 && parseInt(hour.split(":")[0]) <= 8 && hour.split(":")[1] === "pm") {
                                    details["amount"][6] += parseInt(payload.selectedTest.map((cost) => cost.split(":").pop()));
                                }

                                if (parseInt(hour.split(":")[0]) > 8 && parseInt(hour.split(":")[0]) <= 10 && hour.split(":")[1] === "pm") {
                                    details["amount"][7] += parseInt(payload.selectedTest.map((cost) => cost.split(":").pop()));
                                }

                                details["total"] += parseInt(payload.selectedTest.map((cost) => cost.split(":").pop()));

                                file.update(type + "/" + companyID + "/hourly", today, details, (err) => {
                                    if (!err) {
                                        callback(false, details);
                                    } else {
                                        callback(true);
                                    }
                                });
                            } else {
                                callback(true);
                            }
                        });
                    } else {
                        //  Define Data
                        const _data = {
                            amount: [0, 0, 0, 0, 0, 0, 0, 0],
                            total: 0,
                        };

                        // Update
                        if (parseInt(hour.split(":")[0]) <= 8 && hour.split(":")[1] === "am") {
                            _data["amount"][0] += parseInt(payload.selectedTest.map((cost) => cost.split(":").pop()));
                        }

                        if (parseInt(hour.split(":")[0]) > 8 && parseInt(hour.split(":")[0]) <= 10 && hour.split(":")[1] === "am") {
                            _data["amount"][1] += parseInt(payload.selectedTest.map((cost) => cost.split(":").pop()));
                        }

                        if (parseInt(hour.split(":")[0]) > 10 && parseInt(hour.split(":")[0]) <= 12 && hour.split(":")[1] === "pm") {
                            _data["amount"][2] += parseInt(payload.selectedTest.map((cost) => cost.split(":").pop()));
                        }

                        if (parseInt(hour.split(":")[0]) > 0 && parseInt(hour.split(":")[0]) <= 2 && hour.split(":")[1] === "pm") {
                            _data["amount"][3] += parseInt(payload.selectedTest.map((cost) => cost.split(":").pop()));
                        }

                        if (parseInt(hour.split(":")[0]) > 2 && parseInt(hour.split(":")[0]) <= 4 && hour.split(":")[1] === "pm") {
                            _data["amount"][4] += parseInt(payload.selectedTest.map((cost) => cost.split(":").pop()));
                        }

                        if (parseInt(hour.split(":")[0]) > 4 && parseInt(hour.split(":")[0]) <= 6 && hour.split(":")[1] === "pm") {
                            _data["amount"][5] += parseInt(payload.selectedTest.map((cost) => cost.split(":").pop()));
                        }

                        if (parseInt(hour.split(":")[0]) > 6 && parseInt(hour.split(":")[0]) <= 8 && hour.split(":")[1] === "pm") {
                            _data["amount"][6] += parseInt(payload.selectedTest.map((cost) => cost.split(":").pop()));
                        }

                        if (parseInt(hour.split(":")[0]) > 8 && parseInt(hour.split(":")[0]) <= 10 && hour.split(":")[1] === "pm") {
                            _data["amount"][7] += parseInt(payload.selectedTest.map((cost) => cost.split(":").pop()));
                        }

                        _data["total"] += parseInt(payload.selectedTest.map((cost) => cost.split(":").pop()));

                        // Create file for today
                        file.create(dir + "/" + companyID + "/hourly", today, _data, (err) => {
                            if (!err) {
                                // Delete Previous
                                file.delete(dir + "/" + companyID + "/hourly", item[0], (err) => {
                                    if (!err) {
                                        // Return
                                        callback(false, _data);
                                    } else {
                                        callback(true);
                                    }
                                });
                            } else {
                                callback(true);
                            }
                        });
                    }
                } else {
                    callback(true);
                }
            } else {
                callback(true);
            }
        });
    } else {
        callback(true);
    }
};

// Delete Hourly Directory
// =======================================================
hourly["delete_hourly_directory"] = (dir, ID, callback) => {
    // Validate
    const type = typeof dir === "string" && dir.length > 5 ? dir : false;
    const companyID = typeof ID === "string" && ID.length > 5 ? ID : false;

    if (type && companyID) {
        directory.delete(type + "/" + companyID + "/hourly", (err) => {
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
module.exports = hourly;
