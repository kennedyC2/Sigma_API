// User's Handler
// =====================================================================

// Import Dependencies
// =================================================================================
const { hash } = require("./helper");
const { client, database } = require("./mongo")

// Container
// =================================================================================
const user = {};

// Create User
// =================================================================================
user["create_user"] = async (data, callback) => {
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
            const yr = typeof data.payload.year === "string" && data.payload.year.trim().length > 0 ? data.payload.year.trim() : false;
            const password = typeof data.payload.password === "string" && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
            const account = typeof data.payload.account_type === "string" && data.payload.account_type.trim().length > 0 ? data.payload.account_type.trim().toLowerCase() : false;
            const company = typeof data.payload.company === "object" && Object.keys(data.payload.company).length > 0 ? data.payload.company : false;

            // Validate
            if (firstname && lastname && other && sex && phone && email && day && month && yr && password && account && company) {
                // Connect to database
                try {
                    const directory = client.db(database);
                    const userDir = directory.collection("Users");
                    const cDir = directory.collection(company.type)
                    const data_1 = await userDir.findOne({ email: email });
                    const data_2 = await cDir.findOne({ cid: company.cid });

                    // Check if user exist
                    if (data_1 === null || data_1 === undefined) {
                        // Hash password
                        const hashedPassword = hash(password)

                        // Define User Data
                        const response = {
                            firstname: firstname,
                            lastname: lastname,
                            other: other,
                            sex: sex,
                            day: day,
                            month: month,
                            year: yr,
                            phone: phone,
                            email: email,
                            account: account,
                            recent: [],
                            fetched: true,
                            display: "default.png",
                            verified: true,
                        };

                        // Update Users
                        data_2.users = [...data_2.users, { ...response }]

                        // Update Stats
                        data_2.stats.employees += 1

                        // Add Company Details
                        response["company"] = company

                        // Add Password
                        response["password"] = hashedPassword

                        // Update Users
                        await userDir.insertOne(response);

                        // Update Company Details
                        await cDir.replaceOne({ cid: company.cid }, { ...data_2 }, { upsert: true })

                        // Delete Password
                        delete response.password

                        // Return
                        callback(200, data_2, "json");
                    } else {
                        console.log("Yes")
                        // Return
                        callback(400, { message: "User with email already exist" }, "json");
                    }
                } catch (error) {
                    console.log(error)
                    // Return
                    callback(502, { message: "Oops, Something Went Wrong, Try Again Later" }, "json");
                } finally {
                    client.close;
                }
            } else {
                callback(400, { message: "Missing Required Fields" }, "json");
            }
            break;

        default:
            callback(405, {}, "json");
            break;
    }
};

// Delete User
// =================================================================================
user["delete_user"] = async (data, callback) => {
    // Validate Method
    switch (data.method) {
        case "options":
            callback(200, {}, "json");
            break;

        case "delete":
            // Validate
            const position = typeof data.payload.position === "string" && data.payload.position.length > 0 ? data.payload.position.trim() : false;
            const email = typeof data.payload.email === "string" && data.payload.email.length > 0 ? data.payload.email.trim() : false;
            const dir = typeof data.payload.type === "string" && data.payload.type.trim().length > 0 ? data.payload.type.trim() : false;
            const companyID = typeof data.payload.companyID === "string" && data.payload.companyID.trim().length > 0 ? data.payload.companyID.trim() : false;
            console.log(position, email, dir, companyID)

            if (position && email && dir && companyID) {
                // Check if Company exist
                try {
                    const directory = client.db(database);
                    const userDir = directory.collection("Users");
                    const cDir = directory.collection(dir);
                    const data_1 = await cDir.findOne({ cid: companyID });

                    if (data_1 !== null && data_1 !== undefined) {
                        // Delete User
                        data_1.users = data_1.users.filter((each, index) => {
                            return index !== parseInt(position)
                        })

                        // Update Stats
                        data_1.stats.employees -= 1;

                        // Delete _id
                        delete data_1._id

                        // Update DB
                        await cDir.replaceOne({ cid: data_1.cid }, { ...data_1 }, { upsert: true })
                        await userDir.deleteOne({ email: email })

                        // Return
                        callback(200, data_1, "json");
                    } else {
                        // Return
                        callback(400, { message: "Company ID does not exist" }, "json");
                    }
                } catch (error) {
                    // Return
                    console.log(error);
                    callback(502, { message: "Oops, Something Went Wrong, Try Again Later" }, "json");
                } finally {
                    client.close;
                }
            } else {
                callback(400, { message: "Missing Required Fields" }, "json");
            }
            break;

        default:
            callback(405, {}, "json");
            break;
    }
};

// Export MOdule
module.exports = user;
