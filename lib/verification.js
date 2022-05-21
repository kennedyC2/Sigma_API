// Import Dependencies
const file = require("./file");
const { createCode } = require("./helper");
const { verification } = require("./mailing");

// Container
const verify = {};

// Verify Account
verify["verifyAccount"] = (data, callback) => {
    // Check Method
    switch (data.method) {
        case "options":
            callback(200, {}, "json");
            break;

        case "post":
            // Check that all required variables are present
            const code = typeof data.payload.code === "string" && data.payload.code.trim().length > 0 ? data.payload.code.trim().toLowerCase() : false;
            const email = typeof data.payload.email === "string" && data.payload.email.trim().length > 0 ? data.payload.email.trim().toLowerCase() : false;

            if (code && email) {
                // Check file
                file.read("verification", email.replace(".com", ""), (err, details) => {
                    if (!err && details) {
                        // Verify
                        if (details.code === code && details.time > Date.now()) {
                            if (details.time > Date.now()) {
                                // Fetch User
                                file.read("accounts/admin", email.replace(".com", ""), (err, userDetails) => {
                                    if (!err && userDetails) {
                                        userDetails.verified = true;

                                        // Update
                                        file.update("accounts/admin", email.replace(".com", ""), userDetails, (err) => {
                                            if (!err) {
                                                // Delete
                                                file.delete("verification", email.replace(".com", ""), (err) => {
                                                    if (!err) {
                                                        // Return
                                                        callback(200, { message: "Success" }, "json");
                                                    } else {
                                                        callback(500, { error: "Something Went Wrong, Please Try Again Later ...." }, "json");
                                                    }
                                                });
                                            } else {
                                                callback(500, { error: "Something Went Wrong, Please Try Again Later ...." }, "json");
                                            }
                                        });
                                    } else {
                                        callback(500, { error: "Something Went Wrong, Please Try Again Later ...." }, "json");
                                    }
                                });
                            } else {
                                callback(400, { error: "Expired Verification Code" }, "json");
                            }
                        } else {
                            callback(400, { error: "Wrong Verification Code" }, "json");
                        }
                    } else {
                        callback(404, { error: "Profile Does Not Exist" }, "json");
                    }
                });
            } else {
                callback(400, { error: "Missing Required Fields" }, "json");
            }
            break;

        default:
            callback(405, {}, "json");
            break;
    }
};

// Resend Verification Code
verify["SendCode"] = (data, callback) => {
    // Check Method
    switch (data.method) {
        case "options":
            callback(200, {}, "json");
            break;

        case "post":
            // Check that all required variables are present
            const email = typeof data.payload.email === "string" && data.payload.email.trim().length > 0 ? data.payload.email.trim().toLowerCase() : false;

            if (email) {
                // Check file
                file.read("verification", email.replace(".com", ""), (err, details) => {
                    if (!err && details) {
                        // NEw Code
                        details.code = createCode(6);
                        details.time = Date.now() + 1000 * 60 * 5;

                        // Send Code
                        verification(email, details.code, (err) => {
                            if (!err) {
                                // Update User
                                file.update("verification", email.replace(".com", ""), details, (err) => {
                                    if (!err) {
                                        // Return
                                        callback(200, { message: "Verification Code Sent" }, "json");
                                    } else {
                                        callback(500, { error: "Something Went Wrong, Please Try Again Later ...." }, "json");
                                    }
                                });
                            } else {
                                callback(500, { error: "Something Went Wrong, Please Try Again Later ...." }, "json");
                            }
                        });
                    } else {
                        callback(404, { error: "Profile Does Not Exist" }, "json");
                    }
                });
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
module.exports = verify;
