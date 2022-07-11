// Handler for account creation
// =====================================================================

// Import Dependencies
const file = require("./file");
const { hash } = require("./helper");
const { create_token } = require("./token");

// Create Account
const authenticate = (data, callback) => {
    // Check Method
    switch (data.method) {
        case "options":
            callback(200, {}, "json");
            break;

        case "post":
            // Check that all fields are present
            const email = typeof data.payload.email === "string" && data.payload.email.trim().length > 0 ? data.payload.email.trim().toLowerCase() : false;
            const account = typeof data.payload.account === "string" && data.payload.account.trim().length > 0 ? data.payload.account.trim() : false;
            const password = typeof data.payload.password === "string" && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;

            // Validate
            if (email && account && password) {
                if (account === "admin") {
                    // Check if User exist
                    file.read("accounts/admin", email.replace(".com", ""), (err, userDetails) => {
                        if (!err && userDetails) {
                            // Hash Password
                            const Hashed_Password = hash(password);

                            // Check Password
                            if (userDetails.password === Hashed_Password) {
                                // Create Token
                                create_token(data.method, email, (err, tokenDetails) => {
                                    if (!err && tokenDetails) {
                                        // Define Payload
                                        const data = {};
                                        data["message"] = "Success";
                                        data["auth"] = {
                                            loggedIn: true,
                                            key: tokenDetails.tokenID,
                                            ff: "admin",
                                            email: userDetails.email,
                                            verified: userDetails.verified,
                                            session: tokenDetails.session,
                                            path: {
                                                type: false,
                                                companyID: false,
                                            },
                                        };

                                        // return data
                                        callback(200, data, "json");
                                    } else {
                                        callback(500, { error: "Something Went Wrong, Please Try Again Later" }, "json");
                                    }
                                });
                            } else {
                                callback(400, { error: "Incorrect Password" }, "json");
                            }
                        } else {
                            callback(400, { error: "User With Email Address Does Not Exist" }, "json");
                        }
                    });
                } else {
                    // Check if User exist
                    file.read("accounts/users", email.replace(".com", ""), (err, userDetails) => {
                        if (!err && userDetails) {
                            // Check Password
                            if (userDetails.password === password) {
                                // Create Token
                                create_token(data.method, email, (err, tokenDetails) => {
                                    if (!err && tokenDetails) {
                                        // Define Payload
                                        const data = {};
                                        data["message"] = "Success";
                                        data["auth"] = {
                                            loggedIn: true,
                                            key: tokenDetails.tokenID,
                                            session: tokenDetails.session,
                                            ff: "user",
                                            admin: userDetails.admin,
                                            account_type: userDetails.account_type,
                                            path: {
                                                type: userDetails.type,
                                                companyID: userDetails.companyID,
                                            },
                                        };

                                        // return data
                                        callback(200, data, "json");
                                    } else {
                                        callback(500, { error: "Something Went Wrong, Please Try Again Later" }, "json");
                                    }
                                });
                            } else {
                                callback(400, { error: "Incorrect Password" }, "json");
                            }
                        } else {
                            callback(400, { error: "User With Email Address Does Not Exist" }, "json");
                        }
                    });
                }
            } else {
                callback(400, { error: "Missing Required Fields" }, "json");
            }
            break;

        default:
            callback(405, {}, "json");
            break;
    }
};

// Export Module
module.exports = authenticate;
