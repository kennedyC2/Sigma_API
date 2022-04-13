// Delete Company Data For Today
// =======================================================================================

// Dependencies
const file = require("../file");
const folder = require("../dir");
const token = require("../token/main");
const hourly = require("../hourly/main");
const lab_activities = require("../lab_activities/main");
const revenue = require("../revenue/main");
const services = require("../services/main");
const testKit = require("../testKit/main");
const test = require("../tests/main");
const top_5 = require("../top_5/main");
const user = require("../users/main");
const stats = require("../stats/main");
const storage = require("../storage/main");

// Component
const delete_company = (data, callback) => {
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
                token.validate(tokenID, (err) => {
                    if (!err) {
                        // Delete hourly
                        hourly.delete(dir, companyID, (err) => {
                            if (!err) {
                                // Delete lab_activities
                                lab_activities.delete(dir, companyID, (err) => {
                                    if (!err) {
                                        // Delete revenue
                                        revenue.delete(dir, companyID, (err) => {
                                            if (!err) {
                                                // Delete services
                                                services.delete(dir, companyID, (err) => {
                                                    if (!err) {
                                                        // Delete tetsKit
                                                        testKit.delete(dir, companyID, (err) => {
                                                            if (!err) {
                                                                // DElete Test
                                                                test.delete(dir, companyID, (err) => {
                                                                    if (!err) {
                                                                        // Delete Top_5
                                                                        top_5.delete(dir, companyID, (err) => {
                                                                            if (!err) {
                                                                                // Delete Users
                                                                                folder.read(dir + "/" + companyID + "/users", (err, list) => {
                                                                                    if (!err && list) {
                                                                                        if (list.length > 0) {
                                                                                            for (const prop of list) {
                                                                                                file.delete("accounts/users", prop);
                                                                                            }
                                                                                        }

                                                                                        user.delete_user(dir, companyID, (err) => {
                                                                                            if (!err) {
                                                                                                // Delete Stats
                                                                                                stats.delete(dir, companyID, (err) => {
                                                                                                    if (!err) {
                                                                                                        // Delete storage
                                                                                                        storage.delete(dir, companyID, (err) => {
                                                                                                            if (!err) {
                                                                                                                // Return
                                                                                                                callback(200, {});
                                                                                                            } else {
                                                                                                                callback(500, { Error: "Something Happened, Please Try Again Later" });
                                                                                                            }
                                                                                                        });
                                                                                                    } else {
                                                                                                        callback(500, { Error: "Something Happened, Please Try Again Later" });
                                                                                                    }
                                                                                                });
                                                                                            } else {
                                                                                                callback(500, { Error: "Something Happened, Please Try Again Later" });
                                                                                            }
                                                                                        });
                                                                                    } else {
                                                                                        callback(500, { Error: "Something Happened, Please Try Again Later" });
                                                                                    }
                                                                                });
                                                                            } else {
                                                                                callback(500, { Error: "Something Happened, Please Try Again Later" });
                                                                            }
                                                                        });
                                                                    } else {
                                                                        callback(500, { Error: "Something Happened, Please Try Again Later" });
                                                                    }
                                                                });
                                                            } else {
                                                                callback(500, { Error: "Something Happened, Please Try Again Later" });
                                                            }
                                                        });
                                                    } else {
                                                        callback(500, { Error: "Something Happened, Please Try Again Later" });
                                                    }
                                                });
                                            } else {
                                                callback(500, { Error: "Something Happened, Please Try Again Later" });
                                            }
                                        });
                                    } else {
                                        callback(500, { Error: "Something Happened, Please Try Again Later" });
                                    }
                                });
                            } else {
                                callback(500, { Error: "Something Happened, Please Try Again Later" });
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
module.exports = delete_company;
