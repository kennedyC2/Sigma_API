// Handler for account creation
// =====================================================================

// Import Dependencies
const file = require("../file");
const helper = require("../helper");
const token = require("../token/main");

// Create Account
const delete_account = (data, callback) => {
    // Check Method
    switch (data.method) {
        case "options":
            callback(200, {});
            break;

        case "delete":
            // Check that all fields are present
            const email = typeof data.payload.email === "string" && data.payload.email.trim().length > 0 ? data.payload.email.trim().toLowerCase() : false;
            const tokenID = typeof data.payload.tokenID === "string" && data.payload.tokenID.trim().length >= 20 ? data.payload.tokenID.trim() : false;

            // Validate
            if (email && tokenID) {
                // Check if User exist
                if (token.validate(tokenID)) {
                    // Proceed
                    file.read("accounts/admin", email.replace(".com", ""), (err, userDetails) => {
                        if (!err && userDetails) {
                            // Hash Password
                            const Hashed_Password = helper.hash(password);

                            if (Hashed_Password === userDetails.password) {
                                // Delete Account
                                file.delete("accounts/admin", email.replace(".com", ""), (err) => {
                                    if (!err) {
                                        callback(200, {});
                                    } else {
                                        callback(500, { Error: "Something Went Wrong, Try Again Later ...." });
                                    }
                                });
                            } else {
                                callback(400, { Error: "Wrong Password" });
                            }
                        } else {
                            callback(400, { Error: "User With Email Address Does Not Exist" });
                        }
                    });
                } else {
                    callback(400, { Error: "Something happened, Please Try Again Later" });
                }
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
module.exports = delete_account;
