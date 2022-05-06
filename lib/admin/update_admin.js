// Handler for account creation
// =====================================================================

// Import Dependencies
const file = require("../file");
const { validate } = require("../token/main");

// Create Account
const update_account = (data, callback) => {
    // Check Method
    switch (data.method) {
        case "options":
            callback(200, {});
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
                                            callback(200, message);
                                        } else {
                                            callback(500, { Error: "Could Not Update Profile" });
                                        }
                                    });
                                } else {
                                    callback(500, { Error: "Password" });
                                }
                            } else {
                                callback(400, { Error: "User With Email Address Does Not Exist" });
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
module.exports = update_account;
