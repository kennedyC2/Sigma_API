// handler for Services
// =======================================================

// Import Dependencies
// =======================================================
const { client, database } = require("./mongo")

// Container
// =======================================================
const services = {};

// Update Services
// =======================================================
services["update_services"] = async (data, callback) => {
    // Validate Method
    switch (data.method) {
        case "options":
            callback(200, {}, "json");
            break;

        case "put":
            // Validate amount
            const test = typeof data.payload.test === "object" && Object.keys(data.payload.test).length > 0 ? data.payload.test : false;
            const serv = typeof data.payload.serv === "object" && Object.keys(data.payload.serv).length > 0 ? data.payload.serv : false;
            const num = typeof data.payload.num === "number" ? data.payload.num : false;
            const dir = typeof data.payload.type === "string" && data.payload.type.trim().length > 0 ? data.payload.type.trim() : false;
            const companyID = typeof data.payload.companyID === "string" && data.payload.companyID.trim().length > 0 ? data.payload.companyID.trim() : false;

            if (test && num && serv && dir && companyID) {
                // Check if Company exist
                try {
                    const directory = client.db(database);
                    const cDir = directory.collection(dir);
                    const data_1 = await cDir.findOne({ cid: companyID });

                    if (data_1 !== null && data_1 !== undefined) {
                        // Update Services
                        for (const category in test) {
                            if (data_1.services[category] !== undefined) {
                                data_1.services[category]["testList"] = { ...data_1.services[category]["testList"], ...test[category]["testList"] };
                            } else {
                                data_1.services[category] = {};
                                data_1.services[category]["name"] = test[category]["name"];
                                data_1.services[category]["testList"] = test[category]["testList"];
                            }
                        }

                        // Update Stats
                        data_1.stats.services += num;

                        // Update top_5
                        data_1.top_5.tests = { ...data_1.top_5["tests"], ...serv };

                        // Delete _id
                        delete data_1._id

                        // Update DB
                        await cDir.replaceOne({ cid: data_1.cid }, { ...data_1 }, { upsert: true })

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

// Delete Services Directory
// =======================================================
services["delete_services"] = async (data, callback) => {
    // Validate Method
    switch (data.method) {
        case "options":
            callback(200, {}, "json");
            break;

        case "delete":
            // Validate
            const test = typeof data.payload.test === "string" && data.payload.test.length > 0 ? data.payload.test.trim() : false;
            const category = typeof data.payload.category === "string" && data.payload.category.length > 0 ? data.payload.category.trim() : false;
            const dir = typeof data.payload.type === "string" && data.payload.type.trim().length > 0 ? data.payload.type.trim() : false;
            const companyID = typeof data.payload.companyID === "string" && data.payload.companyID.trim().length > 0 ? data.payload.companyID.trim() : false;

            if (test && category && dir && companyID) {
                // Check if Company exist
                try {
                    const directory = client.db(database);
                    const cDir = directory.collection(dir);
                    const data_1 = await cDir.findOne({ cid: companyID });

                    if (data_1 !== null && data_1 !== undefined) {
                        // Delete Services
                        delete data_1["services"][category]["testList"][test]

                        // check if now empty
                        if (Object.keys(data_1["services"][category]["testList"]).length === 0) {
                            delete data_1["services"]
                        }

                        // Update Stats
                        data_1.stats.services -= 1;

                        // Update top_5
                        delete data_1.top_5.tests[test];

                        // Delete _id
                        delete data_1._id

                        // Update DB
                        await cDir.replaceOne({ cid: data_1.cid }, { ...data_1 }, { upsert: true })

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

// Export Modules
module.exports = services;
