// Fetch TestKit Data
// =======================================================================================

// Dependencies
const file = require("../file");
const folder = require("../dir");
const fs = require("fs");
const { validate } = require("../token/main");
const { year } = require("../helper");

const fetchKit = async (dir, companyID, each, year) => {
    // Get detail
    const detail = JSON.parse(fs.readFileSync(file.base_directory + dir + "/" + companyID + "/testKits/" + each + "/kit.json", "utf8"));
    const actv = JSON.parse(fs.readFileSync(file.base_directory + dir + "/" + companyID + "/testKits/" + each + "/activities/" + year + ".json", "utf8"));

    // Cont
    const kit = {};

    // Update Kit
    kit["details"] = detail;
    kit["activities"] = actv;

    return kit;
};

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
                validate(tokenID, (err) => {
                    if (!err) {
                        // Check Directory
                        folder.read(dir + "/" + companyID + "/testKits", async (err, list) => {
                            if (!err && list) {
                                // Check List
                                if (list.length > 0) {
                                    // Container
                                    const allKits = {};

                                    // Loop
                                    await list.forEach(async (each) => {
                                        const kit = await fetchKit(dir, companyID, each, year);
                                        allKits[each] = kit;
                                    });

                                    // Return
                                    callback(200, allKits);
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
