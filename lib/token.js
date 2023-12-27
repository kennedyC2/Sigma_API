// Token Handler
// =================================================================================

// Import Dependencies
// =================================================================================
const file = require("./file");
const { createRandomString } = require("./helper");

// Container
// =================================================================================
const tokens = {};

// Create Token
// =================================================================================
tokens["create_token"] = (method, emailAdr, callback) => {
    // Check Method
    switch (method) {
        case "post":
            // Check that all fields are present
            const email = typeof emailAdr === "string" && emailAdr.trim().length > 0 ? emailAdr.trim().toLowerCase() : false;
            if (email) {
                // Token
                const str = createRandomString(30);

                // Create TOken Data
                const data = {
                    email: email,
                    tokenID: str.toUpperCase(),
                    session: Date.now() + 1000 * 60 * 30,
                };

                // create Token file
                file.create("token", str.toUpperCase(), data, (err) => {
                    if (!err) {
                        callback(false, data);
                    } else {
                        callback(true);
                    }
                });
            } else {
                callback(true);
            }
            break;

        default:
            callback(true);
            break;
    }
};

// Fetch Token
// =================================================================================
tokens["fetch_token"] = (method, tokenID, ID, callback) => {
    // Check Method
    switch (method) {
        case "get":
            // Check that all fields are present
            const token = typeof tokenID === "string" && tokenID.trim().length >= 20 ? tokenID.trim() : false;
            const companyID = typeof ID === "string" && ID.trim().length >= 10 ? ID.trim() : false;

            if (token && companyID) {
                // Get Token File
                file.read("token", token, (err, tokenDetails) => {
                    if (!err && tokenDetails) {
                        // Confirm Details
                        if (email === tokenDetails.email && tokenDetails.company.indexOf(companyID) > -1) {
                            // Return token
                            callback(false, tokenDetails);
                        } else {
                            callback(true, { error: "Token Not Found" });
                        }
                    } else {
                        callback(true, { error: "Token Not Found" });
                    }
                });
            } else {
                callback(true, { error: "Something happened, Please Try Again Later" });
            }
            break;

        default:
            callback(true, { error: "Something happened, Please Try Again Later" });
            break;
    }
};

// Update Token
// =================================================================================
tokens["update_token"] = (data, callback) => {
    // Check Method
    switch (data.method) {
        case "options":
            callback(200, {}, "json");
            break;

        case "put":
            // Check that all fields are present
            const email = typeof data.payload.email === "string" && data.payload.email.trim().length > 0 ? data.payload.email.trim().toLowerCase() : false;
            const tokenID = typeof data.payload.tokenID === "string" && data.payload.tokenID.trim().length > 0 ? data.payload.tokenID.trim() : false;
            const companyID = typeof data.payload.companyID === "string" && data.payload.companyID.trim().length > 10 ? data.payload.companyID.trim() : false;

            if (email && tokenID && companyID) {
                // Get Token File
                file.read("token", tokenID, (err, tokenDetails) => {
                    if (!err && tokenDetails) {
                        // Confirm Details
                        if (email === tokenDetails.email) {
                            // Update Time
                            tokenDetails.session = Date.now() + 1000 * 60 * 30;

                            // Save
                            file.update("token", tokenID, tokenDetails, (err) => {
                                if (!err) {
                                    // Return
                                    callback(200, tokenDetails);
                                } else {
                                    callback(500, { error: "Something happened, Please Try Again Later 2" }, "json");
                                }
                            });
                        } else {
                            callback(400, { error: "Invalid Token ID" }, "json");
                        }
                    } else {
                        callback(400, { error: "Invalid Token ID" }, "json");
                    }
                });
            } else {
                callback(400, { error: "Something happened, Please Try Again Later 1" }, "json");
            }
            break;

        default:
            callback(406, { error: "Something happened, Please Try Again Later" }, "json");
            break;
    }
};

// Validate Token
// =================================================================================
tokens["validate"] = (tokenID, callback) => {
    // Check that all fields are present
    const token = typeof tokenID === "string" && tokenID.trim().length >= 20 ? tokenID.trim() : false;

    if (token) {
        // Get Token File
        file.read("token", token, (err, tokenDetails) => {
            if (!err && tokenDetails) {
                // Confirm Details
                if (tokenDetails.session > Date.now()) {
                    // Validated
                    callback(false, tokenDetails);
                } else {
                    callback(false);
                }
            } else {
                callback(false);
            }
        });
    } else {
        callback(false);
    }
};

// Delete Token
// =================================================================================
tokens["delete_token"] = (method, emailAdr, tokenID, ID, callback) => {
    // Check Method
    switch (method) {
        case "delete":
            // Check that all fields are present
            const email = typeof emailAdr === "string" && emailAdr.trim().length > 0 ? emailAdr.trim().toLowerCase() : false;
            const token = typeof tokenID === "string" && tokenID.trim().length >= 20 ? tokenID.trim() : false;
            const companyID = typeof ID === "string" && ID.trim().length >= 10 ? ID.trim() : false;

            if (email && token && companyID) {
                // Get Token File
                file.read("token", token, (err, tokenDetails) => {
                    if (!err && tokenDetails) {
                        // Confirm Details
                        if (email === tokenDetails.email && tokenDetails.company.indexOf(companyID) > -1) {
                            // Delete file
                            file.delete("token", token, (err) => {
                                if (!err) {
                                    callback(false, {});
                                } else {
                                    callback(true, { error: "Something happened, Please Try Again Later" });
                                }
                            });
                        } else {
                            callback(true, { error: "Token Not Found" });
                        }
                    } else {
                        callback(true, { error: "Token Not Found" });
                    }
                });
            } else {
                callback(true, { error: "Something happened, Please Try Again Later" });
            }
            break;

        default:
            callback(true, { error: "Something happened, Please Try Again Later" });
            break;
    }
};

// Export Module
module.exports = tokens;