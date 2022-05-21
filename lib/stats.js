// handler for Stats
// =======================================================

// Import Dependencies
// =======================================================
const file = require("./file");
const directory = require("./directory");
const { validate } = require("./token");
const { today } = require("./helper");

// Container
// =======================================================
const stats = {};

// Create Stat Directory
// =======================================================
stats["create_stat_directory"] = (type, companyId, callback) => {
    // Validate variables
    const companyID = typeof companyId === "string" && companyId.trim().length > 10 ? companyId.trim() : false;
    const dir = typeof type === "string" && type.trim().length > 5 ? type.trim().toLowerCase() : false;

    if (dir && companyID) {
        // Create stats Directory
        directory.create(dir + "/" + companyID + "/stats", (err) => {
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

// Fetch Stat Data
// =======================================================
stats["fetch_stats"] = (data, callback) => {
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
                        directory.read(dir + "/" + companyID + "/stats", (err, item) => {
                            if (!err && item) {
                                if (item.length > 0) {
                                    // Check File
                                    if (item[0] === today) {
                                        file.read(dir + "/" + companyID + "/stats", item[0], (err, details) => {
                                            if (!err) {
                                                // Return
                                                callback(200, details, "json");
                                            } else {
                                                callback(500, {}, "json");
                                            }
                                        });
                                    } else {
                                        file.read(dir + "/" + companyID + "/stats", item[0], (err, details) => {
                                            if (!err) {
                                                // Modify
                                                details.test = 0;
                                                details.revenue = 0;

                                                // Create file for today
                                                file.create(dir + "/" + companyID + "/stats", today, details, (err) => {
                                                    if (!err) {
                                                        // Delete Previous
                                                        file.delete(dir + "/" + companyID + "/stats", item[0], (err) => {
                                                            if (!err) {
                                                                // Return
                                                                callback(200, details, "json");
                                                            } else {
                                                                callback(500, { error: "Something Went Wrong, Please Try Again Later" }, "json");
                                                            }
                                                        });
                                                    } else {
                                                        callback(500, { error: "Something Went Wrong, Please Try Again Later" }, "json");
                                                    }
                                                });
                                            } else {
                                                callback(500, { error: "Something Went Wrong, Please Try Again Later" }, "json");
                                            }
                                        });
                                    }
                                } else {
                                    // Define Data
                                    const data = {
                                        test: 0,
                                        revenue: 0,
                                        services: 0,
                                        employees: 0,
                                    };

                                    // Create file for today
                                    file.create(dir + "/" + companyID + "/stats", today, data, (err) => {
                                        if (!err) {
                                            // Return
                                            callback(200, data, "json");
                                        } else {
                                            callback(500, { error: "Something Went Wrong, Please Try Again Later" }, "json");
                                        }
                                    });
                                }
                            } else {
                                directory.create(dir + "/" + companyID + "/stats", (err) => {
                                    if (!err) {
                                        // Define Data
                                        const data = {
                                            test: 0,
                                            revenue: 0,
                                            services: 0,
                                            employees: 0,
                                        };

                                        // Update
                                        file.create(dir + "/" + companyID + "/stats", today, data, (err) => {
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

// Update Stat Data
// =======================================================
stats["update_stats"] = (type, companyId, data, callback) => {
    // Validate Method
    const dir = typeof type === "string" && type.trim().length > 5 ? type.trim().toLowerCase() : false;
    const companyID = typeof companyId === "string" && companyId.trim().length > 10 ? companyId.trim() : false;

    if (dir && companyID && data) {
        // Check Directory
        directory.read(dir + "/" + companyID + "/stats", (err, item) => {
            if (!err && item) {
                if (item.length > 0) {
                    // Check File
                    if (item[0] === today) {
                        file.read(dir + "/" + companyID + "/stats", item[0], (err, stats) => {
                            if (!err) {
                                // Update Stats
                                stats.test += 1;

                                for (const cost of data) {
                                    stats.revenue += parseInt(cost.split(":").pop());
                                }

                                // stats.revenue += parseInt(data.map((cost) => cost.split(":").pop()));

                                file.update(dir + "/" + companyID + "/stats", item[0], stats, (err) => {
                                    if (!err) {
                                        // Return
                                        callback(false, stats);
                                    } else {
                                        callback(true);
                                    }
                                });
                            } else {
                                callback(true);
                            }
                        });
                    } else {
                        file.read(dir + "/" + companyID + "/stats", item[0], (err, stats) => {
                            if (!err) {
                                // Update Stats
                                stats.test = 0;
                                stats.revenue = 0;

                                // Create file for today
                                file.create(dir + "/" + companyID + "/stats", today, stats, (err) => {
                                    if (!err) {
                                        // Delete Previous
                                        file.delete(dir + "/" + companyID + "/stats", item[0], (err) => {
                                            if (!err) {
                                                // Return
                                                callback(false, stats);
                                            } else {
                                                callback(true);
                                            }
                                        });
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

// Delete Stat Directory
// =======================================================
stats["delete_stat_directory"] = (dir, ID, callback) => {
    // Validate
    const type = typeof dir === "string" && dir.length > 5 ? dir : false;
    const companyID = typeof ID === "string" && ID.length > 5 ? ID : false;

    if (type && companyID) {
        directory.delete(type + "/" + companyID + "/stats", (err) => {
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
module.exports = stats;
