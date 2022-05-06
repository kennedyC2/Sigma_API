// Handler for account creation
// =====================================================================

// Import Dependencies
const file = require("../file");
const helper = require("../helper");
const token = require("../token/main");

// Create Account
const authenticate = (data, callback) => {
    // Check Method
    switch (data.method) {
        case "options":
            callback(200, {});
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
                            const Hashed_Password = helper.hash(password);

                            // Check Password
                            if (userDetails.password === Hashed_Password) {
                                // Create Token
                                token.create(data.method, email, (err, tokenDetails) => {
                                    if (!err && tokenDetails) {
                                        // Define Payload
                                        const data = {};
                                        data["Message"] = "Success";
                                        data["auth"] = {
                                            loggedIn: true,
                                            key: tokenDetails.tokenID,
                                            ff: "admin",
                                            email: userDetails.email,
                                            path: {
                                                type: false,
                                                companyID: false,
                                            },
                                        };

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
                    // Check if User exist
                    file.read("accounts/users", email.replace(".com", ""), (err, userDetails) => {
                        if (!err && userDetails) {
                            // Check Password
                            if (userDetails.password === password) {
                                // Create Token
                                token.create(data.method, email, (err, tokenDetails) => {
                                    if (!err && tokenDetails) {
                                        // Define Payload
                                        const data = {};
                                        data["Message"] = "Success";
                                        data["auth"] = {
                                            loggedIn: true,
                                            key: tokenDetails.tokenID,
                                            ff: "user",
                                            admin: userDetails.admin,
                                            account_type: userDetails.account_type,
                                            path: {
                                                type: userDetails.type,
                                                companyID: userDetails.companyID,
                                            },
                                        };

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
module.exports = authenticate;
