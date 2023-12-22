const { client, database, ObjectId } = require("../lib/mongo");
const { createRandomString } = require("../lib/helper")

// Container
const verify = {}

// VErify User
verify["user"] = async (data, callback) => {
    // Check Method
    switch (data.method) {
        case "options":
            callback(200, {}, "json");
            break;

        case "post":
            // Validate Data
            const email = typeof data.payload.email === "string" && data.payload.email.trim().length > 0 ? data.payload.email.trim() : false;
            const code = typeof data.payload.code === "string" && data.payload.code.trim().length > 0 ? data.payload.code.trim() : false;

            if (email && code) {
                // Check to database
                try {
                    const directory = client.db(database);
                    const sub_directory = directory.collection("Users");
                    const data = await sub_directory.findOne({ email: email });

                    if (data !== null && data !== undefined) {
                        // console.log(code, data.code)
                        // Check Code
                        if (code === data.code) {
                            // Update new code
                            await sub_directory.updateOne({ email: email }, { $set: { "verified": true } });

                            // Return
                            callback(200, { verified: true }, "json");
                        } else {
                            // Return
                            callback(400, { message: "Invalid Authentication Code" }, "json");
                        }
                    } else {
                        // Return
                        callback(400, { message: "User Account does not exist" }, "json");
                    }
                } catch (error) {
                    // Return
                    console.log(error)
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

// Resend Code
verify["code"] = async (data, callback) => {
    // Check Method
    switch (data.method) {
        case "options":
            callback(200, {}, "json");
            break;

        case "post":
            // Validate Data
            const id = typeof data.payload.id === "string" && data.payload.id.trim().length > 0 ? data.payload.id.trim() : false;

            if (id) {
                // Check to database
                try {
                    const directory = client.db(database);
                    const sub_directory = directory.collection("users");
                    const data = await sub_directory.findOne({ _id: new ObjectId(id) });

                    if (data !== null && data !== undefined) {
                        // Generate Verification Code
                        const vCode = createRandomString(8)

                        await sub_directory.updateOne({ _id: new ObjectId(id) }, { $set: { "code": vCode } });

                        // Send message
                        verification(data["email"], vCode, (err) => {
                            if (!err) {
                                // Return
                                callback(200, {}, "json");
                            } else {
                                // Return
                                callback(400, { message: "Invalid Authentication Code" }, "json");
                            }
                        })
                    } else {
                        // Return
                        callback(400, { message: "User Account does not exist" }, "json");
                    }
                } catch (error) {
                    // Return
                    console.log(error)
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

module.exports = verify