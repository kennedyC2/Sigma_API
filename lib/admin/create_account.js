// Handler for account creation
// =====================================================================

// Import Dependencies
const file = require("../file");
const helper = require("../helper");

// Create Account
const create_account = (data, callback) => {
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
            const state = typeof data.payload.state === "string" && data.payload.state.trim().length > 0 ? data.payload.state.trim().toLowerCase() : false;
            const country = typeof data.payload.country === "string" && data.payload.country.trim().length > 0 ? data.payload.country.trim().toLowerCase() : false;

            // Validate
            if (firstname && lastname && other && sex && phone && email && day && month && year && time && date && password && state && country) {
                // Check if User exist
                file.read("accounts/admin", email.replace(".com", ""), (err) => {
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
                                state: state,
                                country: country,
                                company: [],
                                account: "Administrator",
                            };

                            // Store User
                            file.create("accounts/admin", email.replace(".com", ""), data, (err) => {
                                if (!err) {
                                    callback(200, { Message: "Success" });
                                } else {
                                    callback(500, { Error: "Could Not Create New User" });
                                }
                            });
                        } else {
                            callback(500, { Error: "Password" });
                        }
                    } else {
                        callback(400, { Error: "User Already Exist" });
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
module.exports = create_account;
