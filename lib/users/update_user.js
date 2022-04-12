// Handler for user account update
// =====================================================================

// Import Dependencies
const file = require("../file");
const helper = require("../helper");
const token = require("./../token/main");

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
                token.validate(tokenID, (err) => {
                    if (!err) {
                        // Check if User exist
                        file.read(dir + "/" + companyID + "/users/" + email.replace(".com", ""), "profile", (err) => {
                            if (err) {
                                // Hash Password
                                const Hashed_Password = helper.hash(password);

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
                                        time: time,
                                        date: date,
                                        phone: phone,
                                        email: email,
                                        password: Hashed_Password,
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
                                                password: Hashed_Password,
                                                account: "user",
                                                account_type: account,
                                                companyID: companyID,
                                            };

                                            file.update("accounts/users", email.replace(".com", ""), user, (err) => {
                                                if (err) {
                                                    // Return
                                                    callback(200, { Message: "Success" });
                                                } else {
                                                    callback(500, { Error: "Something Happened, Please Try Again Later" });
                                                }
                                            });
                                        } else {
                                            callback(500, { Error: "Could Not Create New User" });
                                        }
                                    });
                                } else {
                                    callback(500, { Error: "Password" });
                                }
                            } else {
                                callback(400, { Error: "User Does Not Exist" });
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
