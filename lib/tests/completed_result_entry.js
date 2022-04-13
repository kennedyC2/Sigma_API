//  Move test to completed Test
// ==============================================================================================

// Dependencies
const file = require("../file");
const helper = require("../helper");

// Components
const completed_result = (data, callback) => {
    // Check Method
    switch (data.method) {
        case "options":
            callback(200, {});
            break;

        case "put":
            // Check that all fields are present
            const data = typeof data.payload.result === "object" ? data.payload.result : false;
            const tokenID = typeof data.payload.tokenID === "string" && data.payload.tokenID.trim().length > 0 ? data.payload.tokenID.trim() : false;
            const companyID = typeof data.query.companyID === "string" && data.query.companyID.trim().length > 10 ? data.query.companyID.trim() : false;
            const dir = typeof data.payload.type === "string" && data.payload.type.trim().length > 0 ? data.payload.type.trim() : false;

            if (data && tokenID && companyID && dir) {
                // Validate token
                token.validate(tokenID, (err, tokenDetails) => {
                    if (!err && tokenDetails) {
                        // ==========
                        const month = helper.month();

                        // Get TestList
                        file.read(dir + "/" + companyID + "/tests", "unsettled", (err, testDetails) => {
                            if (!err && testDetails) {
                                // Get REsults
                                file.read(type + "/" + companyID + "/tests/" + month, "settled", (err, resultDetails) => {
                                    if (!err && resultDetails) {
                                        // Get target from unsettled
                                        const old = testDetails[data.date][data.position];

                                        // Remove target from unsettled
                                        testDetails[data.date] = testDetails[data.date].filter((data) => data !== testDetails[data.date][data.position]);

                                        // Add target to results
                                        if (resultDetails[data.date] !== undefined) {
                                            resultDetails[data.date] = [...resultDetails[data.date], old];
                                        } else {
                                            resultDetails[data.date] = [old];
                                        }

                                        if (testDetails[data.date].length < 1) {
                                            delete testDetails[data.date];
                                        }

                                        // Save Test
                                        file.update(dir + "/" + companyID + "/tests", "unsettled", testDetails, (err) => {
                                            if (!err) {
                                                // Save Completed
                                                file.update(dir + "/" + companyID + "/tests/" + month, "settled", resultDetails, (err) => {
                                                    if (!err) {
                                                        // Get Storage
                                                        file.read(dir + "/" + companyID + "/storage", "storage", (err, storage) => {
                                                            if (!err && storage) {
                                                                // Update Storage
                                                                storage["pending"] -= 1;
                                                                storage["completed"] += 1;

                                                                // Save
                                                                file.update(dir + "/" + companyID + "/storage", "storage", storage, (err) => {
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
                        callback(400, { Error: "Invalid Token ID" });
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
module.exports = completed_result;
