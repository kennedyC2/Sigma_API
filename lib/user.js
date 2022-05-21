// User's Handler
// =====================================================================

// Import Dependencies
// =================================================================================
const fs = require("fs");
const file = require("./file");
const directory = require("./directory");
const { today, year } = require("./helper");
const { validate } = require("./token");

// Container
// =================================================================================
const user = {};

// Create User Directory
// =================================================================================
user["create_user_directory"] = (type, companyId, callback) => {
    // Validate variables
    const companyID = typeof companyId === "string" && companyId.trim().length > 10 ? companyId.trim() : false;
    const dir = typeof type === "string" && type.trim().length > 5 ? type.trim().toLowerCase() : false;

    if (dir && companyID) {
        // Create user Directory
        directory.create(dir + "/" + companyID + "/users", (err) => {
            if (!err) {
                callback(false);
            } else {
                callback(true);
            }
        });
    } else {
        callback(true);
    }
};

// Create User
// =================================================================================
user["create_user"] = (data, callback) => {
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
                        file.read("accounts/users", email.replace(".com", ""), (err) => {
                            if (err) {
                                directory.create(dir + "/" + companyID + "/users/" + email.replace(".com", ""), (err) => {
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
                                                        directory.create(dir + "/" + companyID + "/users/" + email.replace(".com", "") + "/activities", (err) => {
                                                            if (!err) {
                                                                // Instantiate Data
                                                                const fff = {};

                                                                // Create activity file file uer
                                                                file.create(dir + "/" + companyID + "/users/" + email.replace(".com", "") + "/activities", year, fff, (err) => {
                                                                    if (!err) {
                                                                        // Update stats
                                                                        file.read(dir + "/" + companyID + "/stats/", today, (err, stats) => {
                                                                            if (!err && stats) {
                                                                                stats.employees += 1;

                                                                                // Save
                                                                                file.update(dir + "/" + companyID + "/stats/", today, stats, (err) => {
                                                                                    if (!err) {
                                                                                        // Define data
                                                                                        const _data = {
                                                                                            user: {
                                                                                                details: data,
                                                                                                activities: fff,
                                                                                            },
                                                                                            stats: stats,
                                                                                            message: "success",
                                                                                        };

                                                                                        callback(200, _data, "json");
                                                                                    } else {
                                                                                        callback(500, { error: "Something Happened, Please Try Again Later 3" }, "json");
                                                                                    }
                                                                                });
                                                                            } else {
                                                                                callback(500, { error: "Something Happened, Please Try Again Later 3" }, "json");
                                                                            }
                                                                        });
                                                                    } else {
                                                                        callback(500, { error: "Something Happened, Please Try Again Later 3" }, "json");
                                                                    }
                                                                });
                                                            } else {
                                                                callback(500, { error: "Something Happened, Please Try Again Later 3" }, "json");
                                                            }
                                                        });
                                                    } else {
                                                        callback(500, { error: "Something Happened, Please Try Again Later 2" }, "json");
                                                    }
                                                });
                                            } else {
                                                callback(500, { error: "Could Not Create New User" }, "json");
                                            }
                                        });
                                    } else {
                                        callback(500, { error: "Something Happened, Please Try Again Later 1" }, "json");
                                    }
                                });
                            } else {
                                callback(400, { error: "User Already Exist" }, "json");
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

// Compile User
// =================================================================================
const compile_users = async (dir, companyID, each, year) => {
    // Get detail
    const detail = JSON.parse(fs.readFileSync(file.base_directory + dir + "/" + companyID + "/users/" + each + "/profile.json", "utf8"));
    const actv = JSON.parse(fs.readFileSync(file.base_directory + dir + "/" + companyID + "/users/" + each + "/activities/" + year + ".json", "utf8"));

    // Cont
    const user = {};

    // Update Kit
    user["details"] = detail;
    user["activities"] = actv;

    return user;
};

// Fetch User
// =================================================================================
user["fetch_users"] = (data, callback) => {
    // Validate Method
    switch (data.method) {
        case "options":
            callback(200, {}, "json");
            break;

        case "get":
            // Validate data
            const tokenID = typeof data.query.tokenID === "string" && data.query.tokenID.trim().length > 20 ? data.query.tokenID.trim() : false;
            const dir = typeof data.query.type === "string" && data.query.type.trim().length > 5 ? data.query.type.trim().toLowerCase() : false;
            const companyID = typeof data.query.companyID === "string" && data.query.companyID.trim().length > 10 ? data.query.companyID.trim() : false;

            if (tokenID && companyID && dir) {
                // Validate Token
                validate(tokenID, (err) => {
                    if (!err) {
                        // Get List of Users
                        directory.read(dir + "/" + companyID + "/users", async (err, list) => {
                            if (!err && list) {
                                // check LIst LEngth
                                if (list.length > 0) {
                                    // Fetch Details
                                    const users = {};

                                    // Loop
                                    await list.forEach(async (each) => {
                                        const user = await compile_users(dir, companyID, each, year);
                                        users[each] = user;
                                    });

                                    // Return
                                    callback(200, users, "json");
                                } else {
                                    callback(200, {}, "json");
                                }
                            } else {
                                // Create directory
                                directory.create(dir + "/" + companyID + "/users", (err) => {
                                    if (!err) {
                                        // Return
                                        callback(200, {}, "json");
                                    } else {
                                        callback(500, { error: "Something Happened, Please Try Again LAter" }, "json");
                                    }
                                });
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

// Update User
// =================================================================================
user["update_user"] = (data, callback) => {
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
            const account = typeof data.payload.account === "string" && data.payload.account.trim().length > 0 ? data.payload.account.trim().toLowerCase() : false;
            const tokenID = typeof data.query.tokenID === "string" && data.query.tokenID.trim().length > 20 ? data.query.tokenID.trim() : false;
            const dir = typeof data.query.type === "string" && data.query.type.trim().length > 5 ? data.query.type.trim().toLowerCase() : false;
            const companyID = typeof data.query.companyID === "string" && data.query.companyID.trim().length > 10 ? data.query.companyID.trim() : false;

            // Validate
            if (firstname && lastname && other && sex && phone && email && day && month && year && time && date && password && account && tokenID && dir && companyID) {
                // Validate TOKen
                validate(tokenID, (err) => {
                    if (!err) {
                        // Check if User exist
                        file.read(dir + "/" + companyID + "/users/" + email.replace(".com", ""), "profile", (err) => {
                            if (err) {
                                // Define User Data
                                const data = {
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
                                    password: password,
                                    account: "user",
                                    account_type: account,
                                    companyID: companyID,
                                };

                                // Store User
                                file.update(dir + "/" + companyID + "/users/" + email.replace(".com", ""), "profile", data, (err) => {
                                    if (!err) {
                                        // Add to user Account
                                        const user = {
                                            email: email,
                                            password: password,
                                            account: "user",
                                            account_type: account,
                                            companyID: companyID,
                                        };

                                        file.update("accounts/users", email.replace(".com", ""), user, (err) => {
                                            if (!err) {
                                                // Get List of Users
                                                directory.read(dir + "/" + companyID + "/users", async (err, list) => {
                                                    if (!err && list) {
                                                        // Fetch Details
                                                        const users = {};

                                                        // Loop
                                                        await list.forEach(async (each) => {
                                                            const user = await compile_users(dir, companyID, each, year);
                                                            users[each] = user;
                                                        });

                                                        // Return
                                                        callback(200, users, "json");
                                                    } else {
                                                        callback(500, { error: "Something Happened, Please Try Again LAter" }, "json");
                                                    }
                                                });
                                            } else {
                                                callback(500, { error: "Something Happened, Please Try Again Later" }, "json");
                                            }
                                        });
                                    } else {
                                        callback(500, { error: "Could Not Create New User" }, "json");
                                    }
                                });
                            } else {
                                callback(400, { error: "User Does Not Exist" }, "json");
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

// Update User Activity
// =================================================================================
user["update_user_activity"] = (data, type, ID, acct, src, email, callback) => {
    // Check that all fields are present
    const firstname = typeof data.firstname === "string" && data.firstname.trim().length > 0 ? data.firstname.trim().toLowerCase() : false;
    const lastname = typeof data.lastname === "string" && data.lastname.trim().length > 0 ? data.lastname.trim().toLowerCase() : false;
    const other = typeof data.other === "string" && data.other.trim().length > 0 ? data.other.trim().toLowerCase() : false;
    const account = typeof acct === "string" && acct.trim().length > 0 ? acct.trim() : false;
    const source = typeof src === "string" && src.trim().length > 0 ? src.trim() : false;
    const time = typeof data.time === "string" && data.time.trim().length > 0 ? data.time.trim().toLowerCase() : false;
    const date = typeof data.date === "string" && data.date.trim().length > 0 ? data.date.trim().toLowerCase() : false;
    const user = typeof email === "string" && email.trim().length > 5 ? email.trim().toLowerCase() : false;
    const dir = typeof type === "string" && type.trim().length > 5 ? type.trim().toLowerCase() : false;
    const companyID = typeof ID === "string" && ID.trim().length > 10 ? ID.trim() : false;

    if (firstname && lastname && other && time && date && user && dir && companyID && account && source) {
        if (account === "admin") {
            // Fetch File
            file.read(dir + "/" + companyID + "/" + account + "/activities", year, (err, activities) => {
                if (!err && activities) {
                    // Update
                    const payload = {
                        firstname: firstname,
                        lastname: lastname,
                        other: other,
                        source: source,
                        time: time,
                        date: date,
                        type: "Booked A Test",
                    };

                    if (activities[today] !== undefined) {
                        activities[today] = [payload, ...activities[today]];
                    } else {
                        activities[today] = [payload];
                    }

                    // Save
                    file.update(dir + "/" + companyID + "/" + account + "/activities", year, activities, (err) => {
                        if (!err) {
                            // Return
                            callback(false, activities, "admin");
                        } else {
                            console.log(err);
                            callback(true);
                        }
                    });
                } else {
                    console.log(err);
                    callback(true);
                }
            });
        } else {
            // Fetch File
            file.read(dir + "/" + companyID + "/users/" + user.replace(".com", "") + "/activities", year, (err, activities) => {
                if (!err && activities) {
                    // Update
                    const payload = {
                        firstname: firstname,
                        lastname: lastname,
                        other: other,
                        source: source,
                        time: time,
                        date: date,
                        type: "Booked A Test",
                    };

                    if (activities[today] !== undefined) {
                        activities[today] = [payload, ...activities[today]];
                    } else {
                        activities[today] = [payload];
                    }

                    // Save
                    file.update(dir + "/" + companyID + "/users/" + user.replace(".com", "") + "/activities", year, activities, (err) => {
                        if (!err) {
                            // Get List of Users
                            directory.read(dir + "/" + companyID + "/users", async (err, list) => {
                                if (!err && list) {
                                    // Fetch Details
                                    const users = {};

                                    // Loop
                                    await list.forEach(async (each) => {
                                        const user = await compile_users(dir, companyID, each, year);
                                        users[each] = user;
                                    });

                                    // Return
                                    callback(false, users, "user");
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
            });
        }
    } else {
        callback(true);
    }
};

// Delete User
// =================================================================================
user["delete_user"] = (dir, ID, callback) => {
    // Validate
    const user = typeof email === "string" && email.trim().length > 5 ? email.trim().toLowerCase() : false;
    const type = typeof dir === "string" && dir.length > 5 ? dir : false;
    const companyID = typeof ID === "string" && ID.length > 5 ? ID : false;

    if (type && user && companyID) {
        directory.delete(type + "/" + companyID + "/users/" + user.replace(".com", ""), (err) => {
            if (!err) {
                // Return
                callback(false);
            } else {
                callback(true);
            }
        });
    } else {
        callback(true);
    }
};

// Delete User Directory
// =================================================================================
user["delete_all_users"] = (dir, ID, callback) => {
    // Validate
    const type = typeof dir === "string" && dir.length > 5 ? dir : false;
    const companyID = typeof ID === "string" && ID.length > 5 ? ID : false;

    if (type && companyID) {
        directory.delete(type + "/" + companyID + "/users", (err) => {
            if (!err) {
                // Return
                callback(false);
            } else {
                callback(true);
            }
        });
    } else {
        callback(true);
    }
};

// Export MOdule
module.exports = user;
