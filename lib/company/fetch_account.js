// Fetch Hourly Data For Today
// =======================================================================================

// Dependencies
const file = require("./../file");
const token = require("./../token/main");

// Component
const fetch_company = (data, callback) => {
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
                        // Get Company Details
                        file.read(dir + "/" + companyID + "/profile", companyID, (err, details) => {
                            if (!err && details) {
                                // Return
                                callback(200, details);
                            } else {
                                callback(400, { Error: "Profile Does Not Exist" });
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
module.exports = fetch_company;
