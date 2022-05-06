// Handler for user account creation
// =====================================================================

// Import Dependencies
const file = require("../file");
const folder = require("../dir");
const { year, today } = require("../helper");
const { validate } = require("./../token/main");

// Create Account
const create_user = (data, callback) => {
    // Check Method
    switch (data.method) {
        case "options":
            callback(200, {});
            break;

        case "post":
            // Check that all fields are present
            const firstname = typeof data.payload.firstname === "string" && data.payload.firstname.trim().length > 0 ? data.payload.firstname.trim().toLowerCase() : false;
            const lastname = typeof data.payload.lastname === "string" && data.payload.lastname.trim().length > 0 ? data.payload.lastname.trim().toLowerCase() : false;
            const other = typeof data.payload.other === "string" && data.payload.other.trim().length > 0 ? data.payload.other.trim().toLowerCase() : false;
            const sex = typeof data.payload.sex === "string" && data.payload.sex.trim().length > 0 ? data.payload.sex.trim().toLowerCase() : false;
            const phone = typeof data.payload.phone === "string" && data.payload.phone.trim().length > 0 ? data.payload.phone.trim() : false;
            const email = typeof data.payload.email === "string" && data.payload.email.trim().length > 0 ? data.payload.email.trim().toLowerCase() : false;
            const admin = typeof data.payload.admin === "string" && data.payload.admin.trim().length > 0 ? data.payload.admin.trim().toLowerCase() : false;
            const day = typeof data.payload.day === "string" && data.payload.day.trim().length > 0 ? data.payload.day.trim() : false;
            const month = typeof data.payload.month === "string" && data.payload.month.trim().length > 0 ? data.payload.month.trim().toLowerCase() : false;
            const yr = typeof data.payload.year === "string" && data.payload.year.trim().length > 0 ? data.payload.year.trim() : false;
            const password = typeof data.payload.password === "string" && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
            const account = typeof data.payload.account_type === "string" && data.payload.account_type.trim().length > 0 ? data.payload.account_type.trim().toLowerCase() : false;
            const tokenID = typeof data.payload.tokenID === "string" && data.payload.tokenID.trim().length > 20 ? data.payload.tokenID.trim() : false;
            const dir = typeof data.payload.type === "string" && data.payload.type.trim().length > 5 ? data.payload.type.trim().toLowerCase() : false;
            const companyID = typeof data.payload.companyID === "string" && data.payload.companyID.trim().length > 10 ? data.payload.companyID.trim() : false;

            // Validate
            if (firstname && lastname && other && sex && phone && email && day && month && yr && password && account && tokenID && dir && companyID && admin) {
                // Validate TOKen
                validate(tokenID, (err) => {
                    if (!err) {
                        // Check if User exist
                        // folder.read(dir + "/" + companyID + "/users/" + email.replace(".com", ""), (err) => {
                        file.read("accounts/users", email.replace(".com", ""), (err) => {
                            if (err) {
                                folder.create(dir + "/" + companyID + "/users/" + email.replace(".com", ""), (err) => {
                                    if (!err) {
                                        // Define User Data
                                        const data = {
                                            firstname: firstname,
                                            lastname: lastname,
                                            other: other,
                                            sex: sex,
                                            day: day,
                                            month: month,
                                            year: yr,
                                            phone: phone,
                                            email: email,
                                            access_code: password,
                                            account: "user",
                                            account_type: account,
                                            companyID: companyID,
                                            type: dir,
                                        };

                                        // Store User
                                        file.create(dir + "/" + companyID + "/users/" + email.replace(".com", ""), "profile", data, (err) => {
                                            if (!err) {
                                                // Add to user Account
                                                const user = {
                                                    email: email,
                                                    password: password,
                                                    account: "user",
                                                    account_type: account,
                                                    companyID: companyID,
                                                    type: dir,
                                                    admin: admin,
                                                };

                                                file.create("accounts/users", email.replace(".com", ""), user, (err) => {
                                                    if (!err) {
                                                        // Create Activity Directory
                                                        folder.create(dir + "/" + companyID + "/users/" + email.replace(".com", "") + "/activities", (err) => {
                                                            if (!err) {
                                                                // Instantiate Data
                                                                const fff = {};

                                                                // Create activity file file uer
                                                                file.create(dir + "/" + companyID + "/users/" + email.replace(".com", "") + "/activities", year, fff, (err) => {
                                                                    if (!err) {
                                                                        // Update stats
                                                                        file.read(dir + "/" + companyID + "/stats/", today(), (err, stats) => {
                                                                            if (!err && stats) {
                                                                                stats.employees += 1;

                                                                                // Save
                                                                                file.update(dir + "/" + companyID + "/stats/", today(), stats, (err) => {
                                                                                    if (!err) {
                                                                                        // Define data
                                                                                        const _data = {
                                                                                            user: {
                                                                                                details: data,
                                                                                                activities: fff,
                                                                                            },
                                                                                            stats: stats,
                                                                                        };

                                                                                        callback(200, _data);
                                                                                    } else {
                                                                                        callback(500, { Error: "Something Happened, Please Try Again Later 3" });
                                                                                    }
                                                                                });
                                                                            } else {
                                                                                callback(500, { Error: "Something Happened, Please Try Again Later 3" });
                                                                            }
                                                                        });
                                                                    } else {
                                                                        callback(500, { Error: "Something Happened, Please Try Again Later 3" });
                                                                    }
                                                                });
                                                            } else {
                                                                callback(500, { Error: "Something Happened, Please Try Again Later 3" });
                                                            }
                                                        });
                                                    } else {
                                                        callback(500, { Error: "Something Happened, Please Try Again Later 2" });
                                                    }
                                                });
                                            } else {
                                                callback(500, { Error: "Could Not Create New User" });
                                            }
                                        });
                                    } else {
                                        callback(500, { Error: "Something Happened, Please Try Again Later 1" });
                                    }
                                });
                            } else {
                                callback(400, { Error: "User Already Exist" });
                            }
                        });
                    } else {
                        callback(400, { Error: "Invalid Token ID" });
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
module.exports = create_user;
