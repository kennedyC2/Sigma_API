// handler for Services
// =======================================================

// Import Dependencies
// =======================================================
const file = require("./file");
const directory = require("./directory");
const { validate } = require("./token");
const { today } = require("./helper");

// Container
// =======================================================
const services = {};

// Create Services Directory
// =======================================================
services["create_services_directory"] = (type, companyId, callback) => {
    // Validate variables
    const companyID = typeof companyId === "string" && companyId.trim().length > 10 ? companyId.trim() : false;
    const dir = typeof type === "string" && type.trim().length > 5 ? type.trim().toLowerCase() : false;

    if (dir && companyID) {
        // Create services Directory
        directory.create(dir + "/" + companyID + "/services", (err) => {
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

// Fetch Services
// =======================================================
services["fetch_services"] = (data, callback) => {
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
                        directory.read(dir + "/" + companyID + "/services", (err) => {
                            if (!err) {
                                // Try Reading File
                                file.read(dir + "/" + companyID + "/services", "services", (err, details) => {
                                    if (!err && details) {
                                        // Return
                                        callback(200, details, "json");
                                    } else {
                                        // Create File
                                        const _data = {};

                                        // Create File
                                        file.create(dir + "/" + companyID + "/services", "services", _data, (err) => {
                                            if (!err) {
                                                // Return
                                                callback(200, _data, "json");
                                            } else {
                                                callback(500, { error: "Something Went Wrong, Please Try Again Later" }, "json");
                                            }
                                        });
                                    }
                                });
                            } else {
                                // Create Directory & File
                                directory.create(dir + "/" + companyID + "/services", (err) => {
                                    if (!err) {
                                        // Create File
                                        const _data = {};
                                        // Create File
                                        file.create(dir + "/" + companyID + "/services", "services", _data, (err) => {
                                            if (!err) {
                                                // Return
                                                callback(200, _data, "json");
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

// Update Services
// =======================================================
services["update_services"] = (data, callback) => {
    // Validate Method
    switch (data.method) {
        case "options":
            callback(200, {}, "json");
            break;

        case "put":
            // Validate amount
            const name = typeof data.payload.name === "string" && data.payload.name.trim().length > 0 ? data.payload.name.trim().toLowerCase() : false;
            const category = typeof data.payload.category === "string" && data.payload.category.trim().length > 0 ? data.payload.category.trim() : false;
            const cost = typeof data.payload.cost === "string" && data.payload.cost.trim().length > 0 ? data.payload.cost.trim().toLowerCase() : false;
            const dir = typeof data.payload.type === "string" && data.payload.type.trim().length > 0 ? data.payload.type.trim() : false;
            const title = typeof data.payload.title === "string" && data.payload.title.trim().length > 0 ? data.payload.title.trim().toLowerCase() : false;
            const tokenID = typeof data.payload.tokenID === "string" && data.payload.tokenID.trim().length > 0 ? data.payload.tokenID.trim() : false;
            const companyID = typeof data.payload.companyID === "string" && data.payload.companyID.trim().length > 0 ? data.payload.companyID.trim() : false;

            if (name && category && cost && dir && title && tokenID) {
                //  Validate token
                validate(tokenID, (err) => {
                    if (!err) {
                        // Check directory
                        directory.read(dir + "/" + companyID + "/services", (err) => {
                            if (!err) {
                                // Try Reading File
                                file.read(dir + "/" + companyID + "/services", "services", (err, _services) => {
                                    if (!err && _services) {
                                        if (_services[category] !== undefined) {
                                            //  Define Data to be Stored
                                            const data = {};
                                            data["title"] = title;
                                            data["cost"] = cost;
                                            data["kit"] = "";

                                            // Add
                                            if (_services[category].testList[title] !== undefined) {
                                                callback(400, { Message: "Service Already Exists" }, "json");
                                            } else {
                                                _services[category].testList[title] = data;

                                                // SAve
                                                file.update(dir + "/" + companyID + "/services", "services", _services, (err) => {
                                                    if (!err) {
                                                        // Fetch Stats
                                                        file.read(dir + "/" + companyID + "/stats", today, (err, stats) => {
                                                            if (!err && stats) {
                                                                stats.services += 1;

                                                                // Update
                                                                file.update(dir + "/" + companyID + "/stats", today, stats, (err) => {
                                                                    if (!err) {
                                                                        // Fetch Top_5

                                                                        file.read(dir + "/" + companyID + "/top_5", "top_5", (err, top_5) => {
                                                                            if (!err && top_5) {
                                                                                // Update
                                                                                top_5.tests[title] = 0;

                                                                                // Save
                                                                                file.update(dir + "/" + companyID + "/top_5", "top_5", top_5, (err) => {
                                                                                    if (!err) {
                                                                                        // Return
                                                                                        const payload = {
                                                                                            message: "success",
                                                                                            services: _services,
                                                                                            stats: stats,
                                                                                            top_5: top_5,
                                                                                        };

                                                                                        callback(200, payload, "json");
                                                                                    } else {
                                                                                        callback(500, { error: "Something Went Wrong, Please Try again Later" }, "json");
                                                                                    }
                                                                                });
                                                                            } else {
                                                                                callback(500, { error: "Something Went Wrong, Please Try again Later" }, "json");
                                                                            }
                                                                        });
                                                                    } else {
                                                                        callback(500, { error: "Something Went Wrong, Please Try again Later" }, "json");
                                                                    }
                                                                });
                                                            } else {
                                                                callback(500, { error: "Something Went Wrong, Please Try again Later" }, "json");
                                                            }
                                                        });
                                                    } else {
                                                        callback(500, { error: "Something Went Wrong, Please Try again Later" }, "json");
                                                    }
                                                });
                                            }
                                        } else {
                                            //  Define Data to be Stored
                                            const data = {};
                                            data["name"] = name;
                                            data["testList"] = {};

                                            // ====================================
                                            const newTest = {};
                                            newTest["cost"] = cost;
                                            data["testList"][title] = newTest;

                                            // Add
                                            _services[category] = data;

                                            file.update(dir + "/" + companyID + "/services", "services", _services, (err) => {
                                                if (!err) {
                                                    // Fetch Stats
                                                    file.read(dir + "/" + companyID + "/stats", today, (err, stats) => {
                                                        if (!err && stats) {
                                                            stats.services += 1;

                                                            // Update
                                                            file.update(dir + "/" + companyID + "/stats", today, stats, (err) => {
                                                                if (!err) {
                                                                    // Fetch Top_5

                                                                    file.read(dir + "/" + companyID + "/top_5", "top_5", (err, top_5) => {
                                                                        if (!err && top_5) {
                                                                            // Update
                                                                            top_5.tests[title] = 0;

                                                                            // Save
                                                                            file.update(dir + "/" + companyID + "/top_5", "top_5", top_5, (err) => {
                                                                                if (!err) {
                                                                                    // Return
                                                                                    const payload = {
                                                                                        message: "success",
                                                                                        services: _services,
                                                                                        stats: stats,
                                                                                        top_5: top_5,
                                                                                    };

                                                                                    callback(200, payload, "json");
                                                                                } else {
                                                                                    callback(500, { error: "Something Went Wrong, Please Try again Later" }, "json");
                                                                                }
                                                                            });
                                                                        } else {
                                                                            callback(500, { error: "Something Went Wrong, Please Try again Later" }, "json");
                                                                        }
                                                                    });
                                                                } else {
                                                                    callback(500, { error: "Something Went Wrong, Please Try again Later" }, "json");
                                                                }
                                                            });
                                                        } else {
                                                            callback(500, { error: "Something Went Wrong, Please Try again Later" }, "json");
                                                        }
                                                    });
                                                } else {
                                                    callback(500, { error: "Something Went Wrong, Please Try again Later" }, "json");
                                                }
                                            });
                                        }
                                    } else {
                                        callback(500, { error: "Something Went Wrong, Please Try again Later" }, "json");
                                    }
                                });
                            } else {
                                callback(500, { error: "Something Went Wrong, Please Try again Later" }, "json");
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

// Delete Services Directory
// =======================================================
services["delete_services_directory"] = (dir, ID, callback) => {
    // Validate
    const type = typeof dir === "string" && dir.length > 5 ? dir : false;
    const companyID = typeof ID === "string" && ID.length > 5 ? ID : false;

    if (type && companyID) {
        directory.delete(type + "/" + companyID + "/services", (err) => {
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

// Export Modules
module.exports = services;
