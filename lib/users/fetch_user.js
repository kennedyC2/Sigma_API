// Fetch Users Data
// =======================================================================================

// Dependencies
const file = require("../file");
const folder = require("../dir");
const fs = require("fs");
const token = require("../token/main");
const { year } = require("../helper");

const fetchUser = async (dir, companyID, each, year) => {
    // Get detail
    const detail = JSON.parse(fs.readFileSync(file.base_directory + dir + "/" + companyID + "/users/" + each + "/profile.json", "utf8"));
    const actv = JSON.parse(fs.readFileSync(file.base_directory + dir + "/" + companyID + "/users/" + each + "/activities/" + year + ".json", "utf8"));

    // Cont
    const user = {};

    // Update Kit
    user["details"] = detail;
    user["activities"] = actv;

    return user;
};

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
            const dir = typeof data.query.type === "string" && data.query.type.trim().length > 5 ? data.query.type.trim().toLowerCase() : false;
            const companyID = typeof data.query.companyID === "string" && data.query.companyID.trim().length > 10 ? data.query.companyID.trim() : false;

            if (tokenID && companyID && dir) {
                // Validate Token
                token.validate(tokenID, (err) => {
                    if (!err) {
                        // Get List of Users
                        folder.read(dir + "/" + companyID + "/users", async (err, list) => {
                            if (!err && list) {
                                // check LIst LEngth
                                if (list.length > 0) {
                                    // Fetch Details
                                    const users = {};

                                    // Loop
                                    await list.forEach(async (each) => {
                                        const user = await fetchUser(dir, companyID, each, year);
                                        users[each] = user;
                                    });

                                    // Return
                                    callback(200, users);
                                } else {
                                    callback(200, {});
                                }
                            } else {
                                // Create Folder
                                folder.create(dir + "/" + companyID + "/users", (err) => {
                                    if (!err) {
                                        // Return
                                        callback(200, {});
                                    } else {
                                        callback(500, { Error: "Something Happened, Please Try Again LAter" });
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
module.exports = fetch_users;
