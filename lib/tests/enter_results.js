// Enter Result For Test
// ==============================================================================================

// Dependencies
const file = require("../file");
const { validate } = require("../token/main");

// Components
const pending_result = (data, callback) => {
    // Check Method
    switch (data.method) {
        case "options":
            callback(200, {});
            break;

        case "put":
            // Check that all fields are present
            const date = typeof data.payload.date === "string" ? data.payload.date : false;
            const index = typeof data.payload.position === "string" ? data.payload.position : false;
            const testData = typeof data.payload.testData === "object" ? data.payload.testData : false;
            const tokenID = typeof data.payload.tokenID === "string" && data.payload.tokenID.trim().length > 0 ? data.payload.tokenID.trim() : false;
            const companyID = typeof data.payload.companyID === "string" && data.payload.companyID.trim().length > 10 ? data.payload.companyID.trim() : false;
            const dir = typeof data.payload.type === "string" && data.payload.type.trim().length > 0 ? data.payload.type.trim() : false;

            if (date && testData && tokenID && companyID && dir) {
                // Validate token
                validate(tokenID, (err, tokenDetails) => {
                    if (!err && tokenDetails) {
                        // Check Directory
                        file.read(dir + "/" + companyID + "/tests", "unsettled", (err, testDetails) => {
                            if (!err && testDetails) {
                                // Process
                                for (const category in testData) {
                                    if (testDetails[date][index]["result"][category] !== undefined) {
                                        for (const item in testData[category]) {
                                            testDetails[date][index]["result"][category][item] = testData[category][item];
                                        }
                                    } else {
                                        testDetails[date][index]["result"][category] = testData[category];
                                    }
                                }

                                // Save
                                file.update(dir + "/" + companyID + "/tests", "unsettled", testDetails, (err) => {
                                    if (!err) {
                                        // return
                                        callback(200, testDetails);
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
module.exports = pending_result;
