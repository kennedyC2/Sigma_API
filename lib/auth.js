// Handler for account creation
// =====================================================================

// Import Dependencies
const { hash } = require("./helper");
const { client, database } = require("./mongo")

// Create Account
const authenticate = async (data, callback) => {
    // Check Method
    switch (data.method) {
        case "options":
            callback(200, {}, "json");
            break;

        case "post":
            // Check that all fields are present
            const email = typeof data.payload.email === "string" && data.payload.email.trim().length > 0 ? data.payload.email.trim().toLowerCase() : false;
            const account = typeof data.payload.account === "string" && data.payload.account.trim().length > 0 ? data.payload.account.trim().toLowerCase() : false;
            const password = typeof data.payload.password === "string" && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;

            // Validate
            if (email && account && password) {
                // Check if User exist
                try {
                    const directory = client.db(database);
                    const userDir = directory.collection("Users");
                    const data_1 = await userDir.findOne({ email: email, account: account });

                    if (data_1 !== null && data_1 !== undefined) {
                        // Verify
                        const hashedPassword = hash(password)

                        if (hashedPassword === data_1.password) {
                            let company = {}

                            if (Object.keys(data_1.company).length > 0) {
                                // Fetch Company
                                const cDir = directory.collection(data_1.company.type);
                                // company = await cDir.findOne({ cid: data_1.company.cid }, { _id: 0 });
                                company = await cDir.aggregate([
                                    {
                                        $match: { cid: data_1.company.cid }
                                    },
                                    {
                                        $lookup: {
                                            from: "Tests",
                                            localField: "unsettled",
                                            foreignField: "_id",
                                            as: "pending"
                                        }
                                    }
                                ]).toArray()
                            }

                            // Delete password
                            delete data_1.password

                            // Delete code
                            delete data_1.code

                            // Delete _id
                            delete data_1._id
                            delete company[0]._id

                            // Return
                            callback(200, {
                                user: data_1,
                                company: company[0]
                            }, "json");
                        } else {
                            // Return
                            callback(400, { message: "Wrong Password" }, "json");
                        }
                    } else {
                        // Return
                        callback(400, { message: "User with email does not exist" }, "json");
                    }
                } catch (error) {
                    // Return
                    console.log(error);
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
module.exports = authenticate;
