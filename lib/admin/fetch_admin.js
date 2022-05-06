// Handler for account creation
// =====================================================================

// Import Dependencies
const file = require("../file");
const { validate } = require("../token/main");

// Create Account
const fetch_account = (data, callback) => {
    // Check Method
    switch (data.method) {
        case "options":
            callback(200, {});
            break;

        case "get":
            // Validate data
            const tokenID = typeof data.query.tokenID === "string" && data.query.tokenID.trim().length > 20 ? data.query.tokenID.trim() : false;

            // Validate
            if (tokenID) {
                // Validate Token
                validate(tokenID, (err, tokenDetails) => {
                    if (!err) {
                        // Check account
                        if (data.query.admin) {
                            // Check if User exist
                            file.read("accounts/admin", data.query.admin.replace(".com", ""), (err, userDetails) => {
                                if (!err && userDetails) {
                                    // Remove Password
                                    delete userDetails.password;

                                    // return data
                                    callback(200, userDetails);
                                } else {
                                    callback(400, { Error: "User With Email Address Does Not Exist" });
                                }
                            });
                        } else {
                            // Check if User exist
                            file.read("accounts/admin", tokenDetails.email.replace(".com", ""), (err, userDetails) => {
                                if (!err && userDetails) {
                                    // Remove Password
                                    delete userDetails.password;

                                    // return data
                                    callback(200, userDetails);
                                } else {
                                    callback(400, { Error: "User With Email Address Does Not Exist" });
                                }
                            });
                        }
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

// Export Module
module.exports = fetch_account;
