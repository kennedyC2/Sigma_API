// Fetch Stats Data
// =======================================================================================

// Dependencies
const file = require("../file");
const folder = require("../dir");
const { validate } = require("../token/main");
const { today } = require("../helper");

// Component
const fetch_stats = (data, callback) => {
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
                        folder.read(dir + "/" + companyID + "/stats", (err, item) => {
                            if (!err && item) {
                                if (item.length > 0) {
                                    // Check File
                                    if (item[0] === today()) {
                                        file.read(dir + "/" + companyID + "/stats", item[0], (err, details) => {
                                            if (!err) {
                                                // Return
                                                callback(200, details);
                                            } else {
                                                callback(500, {});
                                            }
                                        });
                                    } else {
                                        file.read(dir + "/" + companyID + "/stats", item[0], (err, details) => {
                                            if (!err) {
                                                // Modify
                                                details.test = 0;
                                                details.revenue = 0;

                                                // Create file for today
                                                file.create(dir + "/" + companyID + "/stats", today(), details, (err) => {
                                                    if (!err) {
                                                        // Delete Previous
                                                        file.delete(dir + "/" + companyID + "/stats", item[0], (err) => {
                                                            if (!err) {
                                                                // Return
                                                                callback(200, details);
                                                            } else {
                                                                callback(500, { Error: "Something Happened, Please Try Again Later 6" });
                                                            }
                                                        });
                                                    } else {
                                                        callback(500, { Error: "Something Happened, Please Try Again Later 5" });
                                                    }
                                                });
                                            } else {
                                                callback(500, { Error: "Something Happened, Please Try Again Later 4" });
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
                                    file.create(dir + "/" + companyID + "/stats", today(), data, (err) => {
                                        if (!err) {
                                            // Return
                                            callback(200, data);
                                        } else {
                                            callback(500, { Error: "Something Happened, Please Try Again Later 3" });
                                        }
                                    });
                                }
                            } else {
                                folder.create(dir + "/" + companyID + "/stats", (err) => {
                                    if (!err) {
                                        // Define Data
                                        const data = {
                                            test: 0,
                                            revenue: 0,
                                            services: 0,
                                            employees: 0,
                                        };

                                        // Update
                                        file.create(dir + "/" + companyID + "/stats", today(), data, (err) => {
                                            if (!err) {
                                                // Return
                                                callback(200, data);
                                            } else {
                                                callback(500, { Error: "Something Happened, Please Try Again Later 2" });
                                            }
                                        });
                                    } else {
                                        callback(500, { Error: "Something Happened, Please Try Again Later 1" });
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
module.exports = fetch_stats;
