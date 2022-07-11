// handler for Admin
// =======================================================

// Import Dependencies
// =======================================================
const file = require("./file");
const directory = require("./directory");
const { validate } = require("./token");
const { hash, createCode } = require("./helper");
const { verification } = require("./mailing");

// Container
// =======================================================
const admin = {};

// Create Admin Directory
// =======================================================
admin["create_admin_directory"] = (type, companyId, email, callback) => {
    // Validate variables
    const path = typeof email === "string" && email.trim().length > 10 ? email.trim() : false;
    const companyID = typeof companyId === "string" && companyId.trim().length > 10 ? companyId.trim() : false;
    const dir = typeof type === "string" && type.trim().length > 5 ? type.trim().toLowerCase() : false;

    if (dir && companyID && path) {
        // Create admin Directory
        directory.create(dir + "/" + companyID + "/admin", (err) => {
            if (!err) {
                // create activities
                directory.create(dir + "/" + companyID + "/admin/activities", (err) => {
                    if (!err) {
                        callback(false);
                    } else {
                        callback(true);
                    }
                });
            } else {
                callback(true);
            }
        });
    } else {
        callback(true);
    }
};

// Create Admin Account
// =======================================================
admin["create_account"] = (data, callback) => {
    // Check Method
    switch (data.method) {
        case "options":
            callback(200, {}, "json");
            break;

        case "post":
            // Check that all fields are present
            const firstname = typeof data.payload.firstname === "string" && data.payload.firstname.trim().length > 0 ? data.payload.firstname.trim().toLowerCase() : false;
            const lastname = typeof data.payload.lastname === "string" && data.payload.lastname.trim().length > 0 ? data.payload.lastname.trim().toLowerCase() : false;
            const other = typeof data.payload.other === "string" && data.payload.other.trim().length > 0 ? data.payload.other.trim().toLowerCase() : false;
            const sex = typeof data.payload.sex === "string" && data.payload.sex.trim().length > 0 ? data.payload.sex.trim().toLowerCase() : false;
            const phone = typeof data.payload.phone === "string" && data.payload.phone.trim().length > 0 ? data.payload.phone.trim() : false;
            const email = typeof data.payload.email === "string" && data.payload.email.trim().length > 0 ? data.payload.email.trim().toLowerCase() : false;
            const day = typeof data.payload.day === "string" && data.payload.day.trim().length > 0 ? data.payload.day.trim() : false;
            const month = typeof data.payload.month === "string" && data.payload.month.trim().length > 0 ? data.payload.month.trim().toLowerCase() : false;
            const time = typeof data.payload.time === "string" && data.payload.time.trim().length > 0 ? data.payload.time.trim().toLowerCase() : false;
            const date = typeof data.payload.date === "string" && data.payload.date.trim().length > 0 ? data.payload.date.trim().toLowerCase() : false;
            const year = typeof data.payload.year === "string" && data.payload.year.trim().length > 0 ? data.payload.year.trim() : false;
            const password = typeof data.payload.password === "string" && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
            const state = typeof data.payload.state === "string" && data.payload.state.trim().length > 0 ? data.payload.state.trim().toLowerCase() : false;
            const country = typeof data.payload.country === "string" && data.payload.country.trim().length > 0 ? data.payload.country.trim().toLowerCase() : false;

            // Validate
            if (firstname && lastname && other && sex && phone && email && day && month && year && time && date && password && state && country) {
                // Check if User exist
                file.read("accounts/admin", email.replace(".com", ""), (err) => {
                    if (err) {
                        // Hash Password
                        const Hashed_Password = hash(password);

                        if (Hashed_Password) {
                            // Define User Data
                            const _data = {
                                firstname: firstname,
                                lastname: lastname,
                                other: other,
                                sex: sex,
                                day: day,
                                month: month,
                                year: year,
                                time: time,
                                date: date,
                                phone: phone,
                                email: email,
                                password: Hashed_Password,
                                state: state,
                                country: country,
                                company: [],
                                display: "default.png",
                                account: "administrator",
                                verified: false,
                            };

                            // Store User
                            file.create("accounts/admin", email.replace(".com", ""), _data, (err) => {
                                if (!err) {
                                    // Create Verification Code
                                    const veriCode = createCode(6);
                                    const time = Date.now() + 1000 * 60 * 15;

                                    // Send Mail
                                    verification(email, veriCode, (err) => {
                                        if (!err) {
                                            // Define verification data
                                            const veriData = {
                                                code: veriCode,
                                                time: time,
                                            };

                                            // Create file
                                            file.create("verification", email.replace(".com", ""), veriData, (err) => {
                                                if (!err) {
                                                    // Return
                                                    callback(200, { message: "Success" }, "json");
                                                } else {
                                                    callback(500, { error: "Something Went Wrong, Please Try Again Later2" }, "json");
                                                }
                                            });
                                        } else {
                                            callback(500, { error: "Something Went Wrong, Please Try Again Later1" }, "json");
                                        }
                                    });
                                } else {
                                    callback(500, { error: "Could Not Create New User" }, "json");
                                }
                            });
                        } else {
                            callback(500, { error: "Password" }, "json");
                        }
                    } else {
                        callback(400, { error: "User With Email Already Exist" }, "json");
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

// Fetch Admin Account
// =======================================================
admin["fetch_account"] = (data, callback) => {
    // Check Method
    switch (data.method) {
        case "options":
            callback(200, {}, "json");
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
                            file.read("accounts/admin", tokenDetails.email.replace(".com", ""), (err, userDetails) => {
                                if (!err && userDetails) {
                                    // Remove Password
                                    delete userDetails.password;

                                    // return data
                                    callback(200, userDetails, "json");
                                } else {
                                    callback(400, { error: "User With Email Address Does Not Exist" }, "json");
                                }
                            });
                        } else {
                            // Check if User exist
                            file.read("accounts/admin", tokenDetails.email.replace(".com", ""), (err, userDetails) => {
                                if (!err && userDetails) {
                                    // Remove Password
                                    delete userDetails.password;

                                    // return data
                                    callback(200, userDetails, "json");
                                } else {
                                    callback(400, { error: "User With Email Address Does Not Exist" }, "json");
                                }
                            });
                        }
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

// Update Admin Account
// =======================================================
admin["update_account"] = (data, callback) => {
    // Check Method
    switch (data.method) {
        case "options":
            callback(200, {}, "json");
            break;

        case "put":
            // Check that all fields are present
            const firstname = typeof data.payload.firstname === "string" && data.payload.firstname.trim().length > 0 ? data.payload.firstname.trim().toLowerCase() : false;
            const lastname = typeof data.payload.lastname === "string" && data.payload.lastname.trim().length > 0 ? data.payload.lastname.trim().toLowerCase() : false;
            const other = typeof data.payload.other === "string" && data.payload.other.trim().length > 0 ? data.payload.other.trim().toLowerCase() : false;
            const sex = typeof data.payload.sex === "string" && data.payload.sex.trim().length > 0 ? data.payload.sex.trim().toLowerCase() : false;
            const phone = typeof data.payload.phone === "string" && data.payload.phone.trim().length > 0 ? data.payload.phone.trim() : false;
            const email = typeof data.payload.email === "string" && data.payload.email.trim().length > 0 ? data.payload.email.trim().toLowerCase() : false;
            const state = typeof data.payload.state === "string" && data.payload.state.trim().length > 0 ? data.payload.state.trim().toLowerCase() : false;
            const country = typeof data.payload.country === "string" && data.payload.country.trim().length > 0 ? data.payload.country.trim().toLowerCase() : false;
            const tokenID = typeof data.payload.tokenID === "string" && data.payload.tokenID.trim().length >= 20 ? data.payload.tokenID.trim() : false;
            const day = typeof data.payload.day === "string" && data.payload.day.trim().length > 0 ? data.payload.day.trim() : false;
            const month = typeof data.payload.month === "string" && data.payload.month.trim().length > 0 ? data.payload.month.trim().toLowerCase() : false;
            const year = typeof data.payload.year === "string" && data.payload.year.trim().length > 0 ? data.payload.year.trim() : false;

            // Validate
            if (firstname && lastname && other && sex && phone && email && state && country && day && month && year && tokenID) {
                // Validate Token
                validate(tokenID, (err) => {
                    if (!err) {
                        // Check if User exist
                        file.read("accounts/admin", email.replace(".com", ""), (err, userDetails) => {
                            if (!err && userDetails) {
                                // Hash Password
                                const Hashed_Password = userDetails.password;

                                if (Hashed_Password) {
                                    // Define User Data
                                    const data = {
                                        firstname: firstname,
                                        lastname: lastname,
                                        other: other,
                                        sex: sex,
                                        day: day,
                                        month: month,
                                        year: year,
                                        phone: phone,
                                        email: email,
                                        display: userDetails.display,
                                        password: userDetails.password,
                                        state: state,
                                        country: country,
                                        company: userDetails.company,
                                        account: "Administrator",
                                    };

                                    // Store User
                                    file.update("accounts/admin", email.replace(".com", ""), data, (err) => {
                                        if (!err) {
                                            // Delete Password
                                            delete data.password;

                                            // Define Payload
                                            const message = {};
                                            message["message"] = "Success";
                                            message["data"] = data;

                                            // return data
                                            callback(200, message, "json");
                                        } else {
                                            callback(500, { error: "Could Not Update Profile" }, "json");
                                        }
                                    });
                                } else {
                                    callback(500, { error: "Password" }, "json");
                                }
                            } else {
                                callback(400, { error: "User With Email Address Does Not Exist" }, "json");
                            }
                        });
                    } else {
                        callback(400, { error: "Invalid Token ID" }, "json");
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

// Delete Admin Account
// =======================================================
admin["delete_account"] = (data, callback) => {
    // Check Method
    switch (data.method) {
        case "options":
            callback(200, {}, "json");
            break;

        case "delete":
            // Check that all fields are present
            const email = typeof data.payload.email === "string" && data.payload.email.trim().length > 0 ? data.payload.email.trim().toLowerCase() : false;
            const tokenID = typeof data.payload.tokenID === "string" && data.payload.tokenID.trim().length >= 20 ? data.payload.tokenID.trim() : false;

            // Validate
            if (email && tokenID) {
                // Check if User exist
                validate(tokenID, (err) => {
                    if (!err) {
                        // Proceed
                        file.read("accounts/admin", email.replace(".com", ""), (err, userDetails) => {
                            if (!err && userDetails) {
                                // Hash Password
                                const Hashed_Password = hash(password);

                                if (Hashed_Password === userDetails.password) {
                                    // Delete Account
                                    file.delete("accounts/admin", email.replace(".com", ""), (err) => {
                                        if (!err) {
                                            callback(200, {}, "json");
                                        } else {
                                            callback(500, { error: "Something Went Wrong, Try Again Later ...." }, "json");
                                        }
                                    });
                                } else {
                                    callback(400, { error: "Wrong Password" }, "json");
                                }
                            } else {
                                callback(400, { error: "User With Email Address Does Not Exist" }, "json");
                            }
                        });
                    } else {
                        callback(400, { error: "Something happened, Please Try Again Later" }, "json");
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
module.exports = admin;
