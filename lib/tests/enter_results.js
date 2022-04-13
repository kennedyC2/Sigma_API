// Enter Result For Test
// ==============================================================================================

// Dependencies
const file = require("../file");

// Components
const pending_result = (data, callback) => {
    // Check Method
    switch (data.method) {
        case "options":
            callback(200, {});
            break;

        case "put":
            // Check that all fields are present
            const result = typeof data.payload.result === "object" ? data.payload.result : false;
            const tokenID = typeof data.payload.tokenID === "string" && data.payload.tokenID.trim().length > 0 ? data.payload.tokenID.trim() : false;
            const companyID = typeof data.query.companyID === "string" && data.query.companyID.trim().length > 10 ? data.query.companyID.trim() : false;
            const dir = typeof data.payload.type === "string" && data.payload.type.trim().length > 0 ? data.payload.type.trim() : false;

            if (result && tokenID && companyID && dir) {
                // Validate token
                token.validate(tokenID, (err, tokenDetails) => {
                    if (!err && tokenDetails) {
                        // Check Directory
                        file.read(dir + "/" + companyID + "/tests", "unsettled", (err, testDetails) => {
                            if (!err && testDetails) {
                                // Process
                                for (const category in result.testData) {
                                    if (testDetails[result.date][result.index]["result"][category] !== undefined) {
                                        for (const item in result.testData[category]) {
                                            testDetails[result.date].map((each, index) => (index === result.index ? (each["result"][category][item] = result.testData[category][item]) : each));
                                        }
                                    } else {
                                        testDetails[result.date].map((each, index) => (index === result.index ? (each["result"][category] = result.testData[category]) : each));
                                    }
                                }

                                // Save
                                file.update(dir + "/" + companyID + "/tests", "unsettled", testDetails, (err) => {
                                    if (!err) {
                                        // return
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
