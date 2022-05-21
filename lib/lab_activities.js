// handler for Laboratory Activities
// =======================================================

// Import Dependencies
// =======================================================
const file = require("./file");
const directory = require("./directory");
const { validate } = require("./token");
const { today, year } = require("./helper");

// Container
// =======================================================
const lab_activities = {};

// Create lab_activities Directory
// =======================================================
lab_activities["create_lab_activity_directory"] = (type, companyId, callback) => {
    // Validate variables
    const companyID = typeof companyId === "string" && companyId.trim().length > 10 ? companyId.trim() : false;
    const dir = typeof type === "string" && type.trim().length > 5 ? type.trim().toLowerCase() : false;

    if (dir && companyID) {
        // Create lab_activities Directory
        directory.create(dir + "/" + companyID + "/lab_activities", (err) => {
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

// Fetch Admin Activities
// =======================================================
lab_activities["fetch_admin_activities"] = (data, callback) => {
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
                        directory.read(dir + "/" + companyID + "/admin/activities", (err) => {
                            if (!err) {
                                // Try Reading File
                                file.read(dir + "/" + companyID + "/admin/activities", year, (err, details) => {
                                    if (!err && details) {
                                        // Return
                                        callback(200, details, "json");
                                    } else {
                                        // Create File
                                        const _data = {};

                                        // Create File
                                        file.create(dir + "/" + companyID + "/admin/activities", year, _data, (err) => {
                                            if (!err) {
                                                // Return
                                                callback(200, _data, "json");
                                            } else {
                                                callback(500, { error: "Something Happened, Please Try Again Later" }, "json");
                                            }
                                        });
                                    }
                                });
                            } else {
                                // Create Directory & File
                                directory.create(dir + "/" + companyID + "/admin/activities", (err) => {
                                    if (!err) {
                                        //  Define Data
                                        const _data = {};

                                        // Create File
                                        file.create(dir + "/" + companyID + "/admin/activities", year, _data, (err) => {
                                            if (!err) {
                                                // Return
                                                callback(200, _data, "json");
                                            } else {
                                                callback(500, { error: "Something Happened, Please Try Again Later" }, "json");
                                            }
                                        });
                                    } else {
                                        callback(500, { error: "Something Happened, Please Try Again Later" }, "json");
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

// Fetch USer Activities
// =======================================================
lab_activities["fetch_lab_activities"] = (data, callback) => {
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
                        directory.read(dir + "/" + companyID + "/lab_activities", (err) => {
                            if (!err) {
                                // Try Reading File
                                file.read(dir + "/" + companyID + "/lab_activities", year, (err, details) => {
                                    if (!err && details) {
                                        // Return
                                        callback(200, details, "json");
                                    } else {
                                        // Create File
                                        const _data = {};

                                        // Create File
                                        file.create(dir + "/" + companyID + "/lab_activities", year, _data, (err) => {
                                            if (!err) {
                                                // Return
                                                callback(200, _data, "json");
                                            } else {
                                                callback(500, { error: "Something Happened, Please Try Again Later" }, "json");
                                            }
                                        });
                                    }
                                });
                            } else {
                                // Create Directory & File
                                directory.create(dir + "/" + companyID + "/lab_activities", (err) => {
                                    if (!err) {
                                        //  Define Data
                                        const _data = {};

                                        // Create File
                                        file.create(dir + "/" + companyID + "/lab_activities", year, _data, (err) => {
                                            if (!err) {
                                                // Return
                                                callback(200, _data, "json");
                                            } else {
                                                callback(500, { error: "Something Happened, Please Try Again Later" }, "json");
                                            }
                                        });
                                    } else {
                                        callback(500, { error: "Something Happened, Please Try Again Later" }, "json");
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

// Update Lab Activities
// =======================================================
lab_activities["update_lab_activity"] = (type, ID, data, source, callback) => {
    // Validate amount
    const firstname = typeof data.firstname === "string" && data.firstname.trim().length > 0 ? data.firstname.trim().toLowerCase() : false;
    const lastname = typeof data.lastname === "string" && data.lastname.trim().length > 0 ? data.lastname.trim().toLowerCase() : false;
    const other = typeof data.other === "string" && data.other.trim().length > 0 ? data.other.trim().toLowerCase() : false;
    const time = typeof data.time === "string" && data.time.trim().length > 0 ? data.time.trim().toLowerCase() : false;
    const date = typeof data.date === "string" && data.date.trim().length > 0 ? data.date.trim().toLowerCase() : false;
    const user = typeof source === "string" && source.trim().length > 5 ? source.trim().toLowerCase() : false;
    const dir = typeof type === "string" && type.length > 5 ? type : false;
    const companyID = typeof ID === "string" && ID.length > 5 ? ID : false;

    if (firstname && lastname && other && time && date && user && dir && companyID) {
        // Define payload
        const payload = {
            firstname: firstname,
            lastname: lastname,
            other: other,
            time: time,
            date: date,
            user: user,
            type: "Booked A Test",
        };

        // Check directory
        directory.read(type + "/" + companyID + "/lab_activities", (err) => {
            if (!err) {
                // Try Reading File
                file.read(type + "/" + companyID + "/lab_activities", year, (err, details) => {
                    if (!err && details) {
                        if (details[today] !== undefined) {
                            // Update
                            details[today] = [payload, ...details[today]];
                        } else {
                            // Update
                            details[today] = [payload];
                        }

                        file.update(type + "/" + companyID + "/lab_activities", year, details, (err) => {
                            if (!err) {
                                callback(false, details);
                            } else {
                                callback(true);
                            }
                        });
                    } else {
                        //  Define Data
                        const _data = {};

                        // update
                        _data[today] = [payload];

                        // Create File
                        file.create(type + "/" + companyID + "/lab_activities", year, _data, (err) => {
                            if (!err) {
                                // Return
                                callback(false, _data);
                            } else {
                                callback(true);
                            }
                        });
                    }
                });
            } else {
                callback(true);
            }
        });
    } else {
        callback(true);
    }
};

// delete lab_activities Directory
// =======================================================
lab_activities["delete_lab_activities_directory"] = (dir, ID, callback) => {
    // Validate
    const type = typeof dir === "string" && dir.length > 5 ? dir : false;
    const companyID = typeof ID === "string" && ID.length > 5 ? ID : false;

    if (type && companyID) {
        directory.delete(type + "/" + companyID + "/lab_activities", (err) => {
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
module.exports = lab_activities;
