// Fetch TestKit Data
// =======================================================================================

// Dependencies
const file = require("../file");
const folder = require("../dir");
const token = require("../token/main");
const helper = require("../helper");

// Component
const fetch_testKit = (data, callback) => {
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
                        // ==========
                        const month = helper.month();

                        // Check Directory
                        folder.read(dir + "/" + companyID + "/testKits", (err, list) => {
                            if (!err && list) {
                                // Check List
                                if (list.length > 0) {
                                    // Container
                                    const data = {};

                                    // Loop
                                    list.forEach((each) => {
                                        const kit = {};

                                        // Get detail
                                        file.read(dir + "/" + companyID + "/testKits", each, (err, details) => {
                                            if (!err && details) {
                                                // Get Activities
                                                file.read(dir + "/" + companyID + "/testKits/" + each + "/activities", month, (err, activity) => {
                                                    if (!err && activity) {
                                                        // Update Kit
                                                        kit["details"] = details;
                                                        kit["activities"] = activity;
                                                        data[each] = kit;
                                                        // ========= END ===============
                                                    } else {
                                                        callback(500, { Error: "Something Happened, Please Try aAgain Later" });
                                                    }
                                                });
                                            } else {
                                                callback(500, { Error: "Something Happened, Please Try aAgain Later" });
                                            }
                                        });
                                    });

                                    // Return
                                    callback(200, data);
                                } else {
                                    callback(200, {});
                                }
                            } else {
                                // Create Folder
                                folder.create(dir + "/" + companyID + "/testKits", (err) => {
                                    if (!err) {
                                        callback(200, {});
                                    } else {
                                        callback(500, { Error: "Something Happened, Please Try Again Later" });
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
module.exports = fetch_testKit;
