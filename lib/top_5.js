// Handler For Top-5 Test
// =======================================================

// Import Dependencies
// =================================================================================
const file = require("./file");
const directory = require("./directory");
const { validate } = require("./token");
const { month } = require("./helper");

// Container
// =================================================================================
const top_5 = {};

// Create Top-5 Directory
// =================================================================================
top_5["create_top_5_directory"] = (type, companyId, callback) => {
    // Validate variables
    const companyID = typeof companyId === "string" && companyId.trim().length > 10 ? companyId.trim() : false;
    const dir = typeof type === "string" && type.trim().length > 5 ? type.trim().toLowerCase() : false;

    if (dir && companyID) {
        // Create top_5 Directory
        directory.create(dir + "/" + companyID + "/top_5", (err) => {
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

// Fetch Top-5
// =================================================================================
top_5["fetch_top_5"] = (data, callback) => {
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
                        // Try Reading File
                        file.read(dir + "/" + companyID + "/top_5", "top_5", (err, details) => {
                            if (!err && details) {
                                // Return
                                callback(200, details, "json");
                            } else {
                                // Create File
                                const _data = {
                                    sorted: false,
                                    tests: {},
                                };

                                // Create File
                                file.create(dir + "/" + companyID + "/top_5", "top_5", _data, (err) => {
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

// Update Top-5 Stats
// =================================================================================
top_5["update_test_stat"] = (data, type, ID, callback) => {
    // Validate
    const payload = typeof data === "object" ? data : false;
    const dir = typeof type === "string" && type.trim().length > 0 ? type.trim() : false;
    const companyID = typeof ID === "string" && ID.trim().length > 0 ? ID.trim() : false;

    if (payload && dir && companyID) {
        // Fetch File
        file.read(dir + "/" + companyID + "/top_5", "top_5", (err, _top_5) => {
            if (!err && _top_5) {
                // Update
                for (const item of payload.selectedTest) {
                    _top_5["tests"][item.split(":")[2].trim().replaceAll(" ", "_").toLowerCase()] += 1;
                }

                // Save
                file.update(dir + "/" + companyID + "/top_5", "top_5", _top_5, (err) => {
                    if (!err) {
                        // Return
                        callback(false, _top_5);
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
};

// Update Top-5 Tests
// =================================================================================
top_5["update_test_list"] = (test, type, ID, callback) => {
    // Validate
    const testName = typeof test === "string" && test.trim().length > 0 ? test.trim() : false;
    const dir = typeof type === "string" && type.trim().length > 0 ? type.trim() : false;
    const companyID = typeof ID === "string" && ID.trim().length > 0 ? ID.trim() : false;

    if (testName && dir && companyID) {
        // Fetch File
        file.read(dir + "/" + companyID + "/top_5", month, (err, _top_5) => {
            if (!err && _top_5) {
                // Update
                _top_5.tests[testName].trim().replaceAll(" ", "_").toLowerCase() = 0;

                // Save
                file.update(dir + "/" + companyID + "/top_5", month, _top_5, (err) => {
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
        });
    } else {
        callback(true);
    }
};

// Delete Top-5 Directory
// =================================================================================
top_5["delete_top_5_directory"] = (dir, ID, callback) => {
    // Validate
    const type = typeof dir === "string" && dir.length > 5 ? dir : false;
    const companyID = typeof ID === "string" && ID.length > 5 ? ID : false;

    if (type && companyID) {
        directory.delete(type + "/" + companyID + "/top_5", (err) => {
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
module.exports = top_5;