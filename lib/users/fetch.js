// Fetch Users Data
// =======================================================================================

// Dependencies
const file = require("./../file");
const folder = require("./../dir");
const token = require("./../token/main");
const helper = require("./../helper");

// Component
const fetch_users = (data, callback) => {
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

                        // Get List of Users
                        folder.read(type + "/" + companyID + "/users", (err, list) => {
                            if (!err && list) {
                                // check LIst LEngth
                                if (list.length > 0) {
                                    // Fetch Details
                                    const users = [];

                                    // Loop
                                    list.forEach((each) => {
                                        // Get Profile Details
                                        file.read(type + "/" + companyID + "/users/" + each, "profile", (err, profile) => {
                                            if (!err && profile) {
                                                // Get First 10 Activity Of User Today
                                                folder.read(type + "/" + companyID + "/users/" + each + "/activity/" + month, (err) => {
                                                    if (!err) {
                                                        // Try Reading Today
                                                        file.read(type + "/" + companyID + "/users/" + each + "/activity/" + month, today, (err, activities) => {
                                                            if (!err && activities) {
                                                                // Get Recent 10
                                                                const data = [];

                                                                activities.forEach((item, index) => {
                                                                    if (index < 10) {
                                                                        data.push(item);
                                                                    }
                                                                });

                                                                // Update Users
                                                                profile["activities"] = data;
                                                                users.push(profile);
                                                            } else {
                                                                // Define Default
                                                                const data = [];

                                                                // Save
                                                                file.create(type + "/" + companyID + "/users/" + each + "/activity/" + month, today, data, (err) => {
                                                                    if (!err) {
                                                                        // Update Users
                                                                        profile["activities"] = data;
                                                                        users.push(profile);
                                                                    } else {
                                                                        callback(500, { Error: "Something Happened, Please Try Again LAter" });
                                                                    }
                                                                });
                                                            }
                                                        });
                                                    } else {
                                                        // Create Month Directory
                                                        folder.create(type + "/" + companyID + "/users/" + each + "/activity/" + month, (err) => {
                                                            if (!err) {
                                                                // Define Default
                                                                const data = [];

                                                                // Save
                                                                file.create(type + "/" + companyID + "/users/" + each + "/activity/" + month, today, data, (err) => {
                                                                    if (!err) {
                                                                        // Update Users
                                                                        profile["activities"] = data;
                                                                        users.push(profile);
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
                                                callback(500, { Error: "Something Happened, Please Try Again LAter" });
                                            }
                                        });
                                    });

                                    // Return
                                    callback(200, users);
                                } else {
                                    callback(200, []);
                                }
                            } else {
                                callback(500, { Error: "Something Happened, Please Try Again LAter" });
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
module.exports = fetch_users;
