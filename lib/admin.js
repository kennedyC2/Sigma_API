// handler for Admin
// =======================================================

// Import Dependencies
// =======================================================
const file = require("./file");
const { validate } = require("./token");
const { hash, createRandomString } = require("./helper");
const { client, database, ObjectId } = require("./mongo")

// Container
// =======================================================
const admin = {};

// Create Admin Account
// =======================================================
admin["create_account"] = async (data, callback) => {
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
                // Connect to database
                try {
                    const directory = client.db(database);
                    const userDir = directory.collection("Users");
                    const data = await userDir.findOne({ email: email });

                    // Check if user exist
                    if (data === null || data === undefined) {
                        // Hash password
                        const hashedPassword = hash(password)

                        // Generate Verification Code
                        const vCode = createRandomString(8)

                        // Define User data
                        const response = {
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
                            password: hashedPassword,
                            state: state,
                            country: country,
                            company: {},
                            display: "default.png",
                            account: "administrator",
                            code: vCode.toUpperCase(),
                            fetched: true,
                            verified: false,
                        };

                        await userDir.insertOne(response);

                        // Delete Password
                        delete response.password

                        // Delete Code
                        delete response.code

                        // Return
                        callback(200, response, "json");
                    } else {
                        console.log("Yes")
                        // Return
                        callback(400, { message: "User with email already exist, Try Signing in" }, "json");
                    }
                } catch (error) {
                    console.log(error)
                    // Return
                    callback(502, { message: "Oops, Something Went Wrong, Try Again Later" }, "json");
                } finally {
                    client.close;
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

// Update Admin Account
// =======================================================
admin["update_account"] = async (data, callback) => {
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
            const day = typeof data.payload.day === "string" && data.payload.day.trim().length > 0 ? data.payload.day.trim() : false;
            const month = typeof data.payload.month === "string" && data.payload.month.trim().length > 0 ? data.payload.month.trim().toLowerCase() : false;
            const year = typeof data.payload.year === "string" && data.payload.year.trim().length > 0 ? data.payload.year.trim() : false;

            // Validate
            if (firstname && lastname && other && sex && phone && email && state && country && day && month && year) {
                // Connect to database
                try {
                    const directory = client.db(database);
                    const userDir = directory.collection("Users");
                    const data = await userDir.findOne({ email: email });

                    // Check if user exist
                    if (data === null || data === undefined) {
                        // Define User data
                        const response = {
                            firstname: firstname,
                            lastname: lastname,
                            other: other,
                            sex: sex,
                            day: day,
                            month: month,
                            year: year,
                            phone: phone,
                            email: email,
                            display: data.display,
                            password: data.password,
                            state: state,
                            country: country,
                            company: data.company,
                            account: data.account,
                            code: data.code,
                            fetched: data.fetched,
                            verified: data.verified,
                        };

                        // Update DB
                        await userDir.replaceOne({ email: email }, { ...response }, { upsert: true })

                        // Delete Password
                        delete response.password

                        // Delete Code
                        delete response.code

                        // Return
                        callback(200, response, "json");
                    } else {
                        console.log("Yes")
                        // Return
                        callback(400, { message: "User with email already exist, Try Signing in" }, "json");
                    }
                } catch (error) {
                    console.log(error)
                    // Return
                    callback(502, { message: "Oops, Something Went Wrong, Try Again Later" }, "json");
                } finally {
                    client.close;
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
module.exports = admin;
