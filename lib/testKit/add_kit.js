// Add testKits
// ==========================================================================================

// Dependencies
const file = require("./../file");
const fs = require("fs");
const folder = require("./../dir");
const { year } = require("./../helper");
const { validate } = require("./../token/main");

const fetchKit = async (dir, companyID, each, year) => {
    // Get detail
    const detail = JSON.parse(fs.readFileSync(file.base_directory + dir + "/" + companyID + "/testKits/" + each + "/kit.json", "utf8"));
    const actv = JSON.parse(fs.readFileSync(file.base_directory + dir + "/" + companyID + "/testKits/" + each + "/activities/" + year + ".json", "utf8"));

    // Cont
    const kit = {};

    // Update Kit
    kit["details"] = detail;
    kit["activities"] = actv;

    return kit;
};

// Component
const add_kit = (data, callback) => {
    // Validate Method
    switch (data.method) {
        case "options":
            callback(200, {});
            break;

        case "post":
            // Validate amount
            const name = typeof data.payload.title === "string" && data.payload.title.trim().length > 0 ? data.payload.title.trim().toLowerCase() : false;
            const quantity = typeof data.payload.quantity === "string" && data.payload.quantity.trim().length > 0 ? data.payload.quantity.trim() : false;
            const test = typeof data.payload.test === "string" && data.payload.test.trim().length > 0 ? data.payload.test.trim() : false;
            const dir = typeof data.payload.type === "string" && data.payload.type.trim().length > 0 ? data.payload.type.trim() : false;
            const tokenID = typeof data.payload.tokenID === "string" && data.payload.tokenID.trim().length > 0 ? data.payload.tokenID.trim() : false;
            const companyID = typeof data.payload.companyID === "string" && data.payload.companyID.trim().length > 0 ? data.payload.companyID.trim() : false;

            if (name && quantity && test && dir && companyID && tokenID) {
                //  Validate token
                validate(tokenID, (err) => {
                    if (!err) {
                        // Create kit
                        folder.create(dir + "/" + companyID + "/testKits/" + name, (err) => {
                            if (!err) {
                                // Define Data
                                const data = {
                                    title: name,
                                    quantity: quantity,
                                    test: test,
                                };

                                // Save
                                file.create(dir + "/" + companyID + "/testKits/" + name, "kit", data, (err) => {
                                    if (!err) {
                                        // Activity
                                        const activity = {};

                                        // Save
                                        folder.create(dir + "/" + companyID + "/testKits/" + name + "/activities", (err) => {
                                            if (!err) {
                                                // create file
                                                file.create(dir + "/" + companyID + "/testKits/" + name + "/activities", year, activity, (err) => {
                                                    if (!err) {
                                                        // Update Services
                                                        file.read(dir + "/" + companyID + "/services", "services", (err, services) => {
                                                            if (!err && services) {
                                                                // Add
                                                                services[test.split(":")[0]]["testList"][test.split(":")[1].replaceAll("_", " ")]["kit"] = name;

                                                                // Save
                                                                file.update(dir + "/" + companyID + "/services", "services", services, (err) => {
                                                                    if (!err) {
                                                                        // Get Storage
                                                                        file.read(dir + "/" + companyID + "/storage", "storage", (err, storage) => {
                                                                            if (!err && storage) {
                                                                                // Update Storage
                                                                                storage["kits"] += 1;

                                                                                // Save
                                                                                file.update(dir + "/" + companyID + "/storage", "storage", storage, (err) => {
                                                                                    if (!err) {
                                                                                        // Get test Kit
                                                                                        folder.read(dir + "/" + companyID + "/testKits", async (err, list) => {
                                                                                            if (!err && list) {
                                                                                                // Container
                                                                                                const allKits = {};

                                                                                                // Loop
                                                                                                await list.forEach(async (each) => {
                                                                                                    const kit = await fetchKit(dir, companyID, each, year);
                                                                                                    allKits[each] = kit;
                                                                                                });

                                                                                                // PAyload
                                                                                                const payload = {
                                                                                                    testKits: allKits,
                                                                                                    storage: storage,
                                                                                                    services: services,
                                                                                                };

                                                                                                // Return
                                                                                                callback(200, payload);
                                                                                            }
                                                                                        });
                                                                                    } else {
                                                                                        callback(500, { Error: "Something Happened, Please Try Again Later 8" });
                                                                                    }
                                                                                });
                                                                            } else {
                                                                                callback(500, { Error: "Something Happened, Please Try Again Later 7" });
                                                                            }
                                                                        });
                                                                    } else {
                                                                        callback(500, { Error: "Something Happened, Please Try Again Later 6" });
                                                                    }
                                                                });
                                                            } else {
                                                                callback(500, { Error: "Something Happened, Please Try Again Later 5" });
                                                            }
                                                        });
                                                    } else {
                                                        callback(500, { Error: "Something Happened, Please Try Again Later 4" });
                                                    }
                                                });
                                            } else {
                                                callback(500, { Error: "Something Happened, Please Try aAgain Later 3" });
                                            }
                                        });
                                    } else {
                                        callback(500, { Error: "Something Happened, Please Try aAgain Later 2" });
                                    }
                                });
                            } else {
                                callback(500, { Error: "Something Happened, Please Try aAgain Later 1" });
                            }
                        });
                    } else {
                        callback(400, { Error: "Invalid Token" });
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

// Export
module.exports = add_kit;
