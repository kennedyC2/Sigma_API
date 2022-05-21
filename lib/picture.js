// Handler for account creation
// =====================================================================

// Import Dependencies
const fs = require("fs");
const path = require("path");
const file = require("./file");
const { validate } = require("./token");

// Create Account
const save_image = (data, callback) => {
    // Check Method
    switch (data.method) {
        case "options":
            callback(200, {}, "json");
            break;

        case "post":
            // Validate data
            const tokenID = typeof data.payload.tokenID === "string" && data.payload.tokenID.trim().length > 20 ? data.payload.tokenID.trim() : false;
            const email = typeof data.payload.email === "string" && data.payload.email.trim().length > 0 ? data.payload.email.trim().toLowerCase() : false;
            const base64 = typeof data.payload.base64 === "string" && data.payload.base64.trim().length > 0 ? data.payload.base64.trim() : false;

            if (tokenID && email && base64) {
                // Validate Token
                validate(tokenID, (err) => {
                    if (!err) {
                        const base_directory = path.join(__dirname, "./../.data/images/");
                        const filename = Date.now() + ".jpg";

                        // Open File
                        fs.open(base_directory + filename, "wx", (err, fd) => {
                            // Check for error
                            if (!err && fd) {
                                // Get Payload
                                const base64_file = base64.toString("base64");

                                // Define Filename
                                const _file = base64_file.split(",")[1];

                                // Write data
                                fs.writeFile(fd, _file, "base64", (err) => {
                                    if (!err) {
                                        // Close File
                                        fs.close(fd, (err) => {
                                            if (!err) {
                                                file.read("accounts/admin", email.replace(".com", ""), (err, userDetails) => {
                                                    if (!err && userDetails) {
                                                        // Do not Delete default image
                                                        if (userDetails.display !== "default.png") {
                                                            // Delete Prev
                                                            fs.unlink(base_directory + userDetails.display, (err) => {
                                                                if (!err) {
                                                                    // Update display
                                                                    userDetails.display = filename;

                                                                    // Update
                                                                    file.update("accounts/admin", email.replace(".com", ""), userDetails, (err) => {
                                                                        if (!err) {
                                                                            // Delete Password
                                                                            delete userDetails.password;

                                                                            // Return
                                                                            callback(200, userDetails, "json");
                                                                        } else {
                                                                            callback(500, { error: "Something Happened, Please Try Again Later" }, "json");
                                                                        }
                                                                    });
                                                                } else {
                                                                    callback(500, { error: "Something Happened, Please Try Again Later" }, "json");
                                                                }
                                                            });
                                                        } else {
                                                            // Update display
                                                            userDetails.display = filename;

                                                            // Update
                                                            file.update("accounts/admin", email.replace(".com", ""), userDetails, (err) => {
                                                                if (!err) {
                                                                    // Delete Password
                                                                    delete userDetails.password;

                                                                    // Return
                                                                    callback(200, userDetails, "json");
                                                                } else {
                                                                    callback(500, { error: "Something Happened, Please Try Again Later" }, "json");
                                                                }
                                                            });
                                                        }
                                                    } else {
                                                        callback(500, { error: "Something Happened, Please Try Again Later" }, "json");
                                                    }
                                                });
                                            } else {
                                                callback(500, { error: "Something Happened, Please Try Again Later" }, "json");
                                            }
                                        });
                                    } else {
                                        callback(500, { error: "Something Happened, Please Try Again Later" }, "json");
                                    }
                                });
                            } else {
                                console.log(err);
                                callback(500, { error: "Something Happened, Please Try Again Later" }, "json");
                            }
                        });
                    } else {
                        callback(400, { error: "Invalid Token" }, "json");
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
module.exports = save_image;
