// Handler for account creation
// =====================================================================

// Import Dependencies
const file = require("../file");
const helper = require("../helper");
const token = require("../token/main");

// Create Account
const fetch_account = (data, callback) => {
    // Check Method
    switch (data.method) {
        case "options":
            callback(200, {});
            break;

        case "post":
            // Check that all fields are present
            const email = typeof data.payload.email === "string" && data.payload.email.trim().length > 0 ? data.payload.email.trim().toLowerCase() : false;
            const password = typeof data.payload.password === "string" && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;

            // Validate
            if (email && password) {
                // Check if User exist
                file.read("accounts/admin", email.replace(".com", ""), (err, userDetails) => {
                    if (!err && userDetails) {
                        // Hash Password
                        const Hashed_Password = helper.hash(password);

                        // Check Password
                        if (userDetails.password === Hashed_Password) {
                            // Create Token
                            token.create(data.method, email, (err, tokenDetails) => {
                                if (!err && tokenDetails) {
                                    // Remove Password
                                    delete userDetails.password;

                                    // Define Payload
                                    const data = {};
                                    data["Message"] = "Success";
                                    data["auth"] = {
                                        loggedIn: true,
                                        token: { key: tokenDetails.tokenID, Timeout: tokenDetails.session },
                                    };
                                    data["data"] = userDetails;

                                    // return data
                                    callback(200, data);
                                } else {
                                    callback(500, { Error: "Something happened, Please Try Again Later" });
                                }
                            });
                        } else {
                            callback(400, { Error: "Incorrect Password" });
                        }
                    } else {
                        callback(400, { Error: "User With Email Address Does Not Exist" });
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
