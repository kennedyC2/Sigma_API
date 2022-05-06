//  Move test to completed Test
// ==============================================================================================

// Dependencies
const file = require("../file");
const { year } = require("../helper");
const { validate } = require("../token/main");

// Components
const completed_result = (data, callback) => {
    // Check Method
    switch (data.method) {
        case "options":
            callback(200, {});
            break;

        case "put":
            // Check that all fields are present
            const date = typeof data.payload.date === "string" ? data.payload.date : false;
            const index = typeof data.payload.position === "string" ? data.payload.position : false;
            const tokenID = typeof data.payload.tokenID === "string" && data.payload.tokenID.trim().length > 0 ? data.payload.tokenID.trim() : false;
            const companyID = typeof data.payload.companyID === "string" && data.payload.companyID.trim().length > 10 ? data.payload.companyID.trim() : false;
            const dir = typeof data.payload.type === "string" && data.payload.type.trim().length > 0 ? data.payload.type.trim() : false;

            if (date && index && tokenID && companyID && dir) {
                // Validate token
                validate(tokenID, (err, tokenDetails) => {
                    if (!err && tokenDetails) {
                        // Get TestList
                        file.read(dir + "/" + companyID + "/tests", "unsettled", (err, testDetails) => {
                            if (!err && testDetails) {
                                // Get REsults
                                file.read(dir + "/" + companyID + "/tests/settled", year, (err, resultDetails) => {
                                    if (!err && resultDetails) {
                                        // Get target from unsettled
                                        const old = testDetails[date][index];

                                        // Remove target from unsettled
                                        testDetails[date] = testDetails[date].filter((item) => item !== testDetails[date][index]);

                                        // Add target to results
                                        if (resultDetails[date] !== undefined) {
                                            resultDetails[date] = [old, ...resultDetails[date]];
                                        } else {
                                            resultDetails[date] = [old];
                                        }

                                        if (testDetails[date].length < 1) {
                                            delete testDetails[date];
                                        }

                                        // Save Test
                                        file.update(dir + "/" + companyID + "/tests", "unsettled", testDetails, (err) => {
                                            if (!err) {
                                                // Save Completed
                                                file.update(dir + "/" + companyID + "/tests/settled", year, resultDetails, (err) => {
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
                                                                        // Payload
                                                                        const _data = {
                                                                            tests: {
                                                                                settled: resultDetails,
                                                                                unsettled: testDetails,
                                                                            },
                                                                            storage: storage,
                                                                        };
                                                                        // Return
                                                                        callback(200, _data);
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
