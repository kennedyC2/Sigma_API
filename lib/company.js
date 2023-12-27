// handler for Company
// =======================================================

// Import Dependencies
// =======================================================
const file = require("./file");
const { validate } = require("./token");
const { createID, days_In_Month, month } = require("./helper");
const { year } = require("./helper");
const { client, database, ObjectId } = require("./mongo")

// Container
// =======================================================
const company = {};

// Create Company
// =======================================================
company["create_company"] = async (data, callback) => {
    // Confirm Methods
    switch (data.method) {
        case "options":
            callback(200, {}, "json");
            break;

        case "post":
            // Check that all fields are present
            const name = typeof data.payload.name === "string" && data.payload.name.trim().length > 0 ? data.payload.name.trim().toLowerCase() : false;
            const email = typeof data.payload.email === "string" && data.payload.email.trim().length > 0 ? data.payload.email.trim().toLowerCase() : false;
            const phone = typeof data.payload.phone === "string" && data.payload.phone.trim().length > 0 ? data.payload.phone.trim() : false;
            const account = typeof data.payload.account === "string" && data.payload.account.trim().length > 0 ? data.payload.account.trim() : false;
            const time = typeof data.payload.time === "string" && data.payload.time.trim().length > 0 ? data.payload.time.trim() : false;
            const date = typeof data.payload.date === "string" && data.payload.date.trim().length > 0 ? data.payload.date.trim() : false;
            const reg_no = typeof data.payload.reg_no === "string" && data.payload.reg_no.trim().length > 0 ? data.payload.reg_no.trim().toLowerCase() : false;
            const address = typeof data.payload.address === "string" && data.payload.address.trim().length > 0 ? data.payload.address.trim().toLowerCase() : false;
            const state = typeof data.payload.state === "string" && data.payload.state.trim().length > 0 ? data.payload.state.trim().toLowerCase() : false;
            const country = typeof data.payload.country === "string" && data.payload.country.trim().length > 0 ? data.payload.country.trim().toLowerCase() : false;
            const dir = typeof data.payload.type === "string" && data.payload.type.trim().length > 5 ? data.payload.type.charAt(0).toUpperCase() + data.payload.type.slice(1) : false;

            if (name && email && phone && account && time && date && reg_no && address && state && country && dir) {
                // Confirm Admin
                if (account === "admin") {
                    // Create Company ID
                    const companyID = createID(name);

                    if (companyID) {
                        // Connect to database
                        try {
                            const directory = client.db(database);
                            const userDir = directory.collection("Users");
                            const cDir = directory.collection(dir)
                            const data = await userDir.findOne({ email: email });

                            // Check if user exist
                            if (data !== null || data !== undefined) {
                                // Create Company Object
                                const _data = {
                                    cid: companyID,
                                    name: name,
                                    email, email,
                                    phone: phone,
                                    time: time,
                                    date: date,
                                    reg_no: reg_no,
                                    type: dir,
                                    address: address,
                                    state: state,
                                    country: country,
                                };

                                // Define Revenue Object
                                const a = [];
                                const b = [];
                                for (var i = 1; i < days_In_Month(month) + 1; i++) {
                                    a.push(i);
                                    b.push(0);
                                }
                                // ===================================================

                                const company = {
                                    cid: companyID,
                                    hourly: {
                                        amount: [0, 0, 0, 0, 0, 0, 0, 0],
                                        total: 0,
                                    },
                                    lab_activities: {
                                        [year]: {}
                                    },
                                    admin: {},
                                    revenue: {
                                        days: a,
                                        amount: b,
                                        total: 0,
                                    },
                                    services: {},
                                    stats: {
                                        test: 0,
                                        revenue: 0,
                                        total: 0,
                                        services: 0,
                                        employees: 0,
                                    },
                                    storage: {
                                        completed: 0,
                                        pending: 0,
                                        kits: 0,
                                    },
                                    testKits: {},
                                    tests: {
                                        unsettled: {},
                                        settled: {},
                                    },
                                    top_5: {
                                        sorted: false,
                                        tests: {},
                                    },
                                    users: {},
                                    pid: 0,
                                    fetched: true,
                                    pending: []
                                }

                                await cDir.insertOne(company);
                                await userDir.updateOne({ email: email }, { $set: { "company": _data } })

                                // Return
                                callback(200, {
                                    company: _data,
                                    companyD: company
                                }, "json");
                            } else {
                                // Return
                                callback(400, { message: "User Account Does Not Exist, Create A New Account" }, "json");
                            }
                        } catch (error) {
                            console.log(error)
                            // Return
                            callback(502, { message: "Oops, Something Went Wrong, Try Again Later" }, "json");
                        } finally {
                            client.close;
                        }
                    } else {
                        callback(500, { error: "Something Went Wrong, Please Try Again Later" }, "json");
                    }
                } else {
                    callback(400, { error: "Sorry, You do not have admin privileges" }, "json");
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

// Update Company
// =======================================================
company["update_company"] = async (data, callback) => {
    // Confirm Methods
    switch (data.method) {
        case "options":
            callback(200, {}, "json");
            break;

        case "put":
            // Check that all fields are present
            const name = typeof data.payload.name === "string" && data.payload.name.trim().length > 0 ? data.payload.name.trim().toLowerCase() : false;
            const phone = typeof data.payload.phone === "string" && data.payload.phone.trim().length > 0 ? data.payload.phone.trim() : false;
            const email = typeof data.payload.email === "string" && data.payload.email.trim().length > 0 ? data.payload.email.trim().toLowerCase() : false;
            const account = typeof data.payload.type === "string" && data.payload.type.trim().length > 0 ? data.payload.type.trim() : false;
            const reg_no = typeof data.payload.reg_no === "string" && data.payload.reg_no.trim().length > 0 ? data.payload.reg_no.trim().toLowerCase() : false;
            const address = typeof data.payload.address === "string" && data.payload.address.trim().length > 0 ? data.payload.address.trim().toLowerCase() : false;
            const user = typeof data.payload.user === "string" && data.payload.user.trim().length > 0 ? data.payload.user.trim() : false;
            const state = typeof data.payload.state === "string" && data.payload.state.trim().length > 0 ? data.payload.state.trim().toLowerCase() : false;
            const country = typeof data.payload.country === "string" && data.payload.country.trim().length > 0 ? data.payload.country.trim().toLowerCase() : false;
            const dir = typeof data.payload.type === "string" && data.payload.type.trim().length > 5 ? data.payload.type.trim().toLowerCase() : false;

            if (name && phone && email && account && reg_no && address && user && state && country && dir) {
                // Connect to database
                try {
                    const directory = client.db(database);
                    const userDir = directory.collection("Users");
                    const data = await userDir.findOne({ email: user });

                    // Check if user exist
                    if (data !== null || data !== undefined) {
                        // Update Data
                        data.company.name = name
                        data.company.phone = phone
                        data.company.email = email
                        data.company.reg_no = reg_no
                        data.company.address = address
                        data.company.state = state
                        data.company.country = country

                        // Update DB
                        await userDir.replaceOne({ email: user }, { ...data }, { upsert: true })

                        // Delete Password
                        delete response.password

                        // Delete Code
                        delete response.code

                        // Return
                        callback(200, response, "json");
                    } else {
                        console.log("Yes")
                        // Return
                        callback(400, { message: "Company Account Does Not Exist" }, "json");
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

// Delete Company
// =======================================================

// Export Module
module.exports = company;
