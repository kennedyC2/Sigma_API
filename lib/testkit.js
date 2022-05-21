// handler for TestKit
// =======================================================

// Import Dependencies
// =======================================================
const fs = require("fs");
const file = require("./file");
const directory = require("./directory");
const { year, month } = require("./helper");
const { validate } = require("./token");

// Container
// =======================================================
const testKit = {};

// Create TestKit Directory
// =======================================================
testKit["create_testKits_directory"] = (type, companyId, callback) => {
    // Validate variables
    const companyID = typeof companyId === "string" && companyId.trim().length > 10 ? companyId.trim() : false;
    const dir = typeof type === "string" && type.trim().length > 5 ? type.trim().toLowerCase() : false;

    if (dir && companyID) {
        // Create testKits Directory
        directory.create(dir + "/" + companyID + "/testKits", (err) => {
            if (!err) {
                callback(false);
            } else {
                callback(true);
            }
        });
    } else {
        callback(true);
    }
};

// Compile TestKit
// =======================================================
const compile_testKits = async (dir, companyID, each, year) => {
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

// Add TestKit
// =======================================================
testKit["add_kit"] = (data, callback) => {
    // Validate Method
    switch (data.method) {
        case "options":
            callback(200, {}, "json");
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
                        directory.create(dir + "/" + companyID + "/testKits/" + name, (err) => {
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
                                        directory.create(dir + "/" + companyID + "/testKits/" + name + "/activities", (err) => {
                                            if (!err) {
                                                // create file
                                                file.create(dir + "/" + companyID + "/testKits/" + name + "/activities", year, activity, (err) => {
                                                    if (!err) {
                                                        // Update Services
                                                        file.read(dir + "/" + companyID + "/services", "services", (err, services) => {
                                                            if (!err && services) {
                                                                // Add
                                                                services[test.split(":")[0]]["testList"][test.split(":")[1].toLowerCase()]["kit"] = name;

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
                                                                                        directory.read(dir + "/" + companyID + "/testKits", async (err, list) => {
                                                                                            if (!err && list) {
                                                                                                // Container
                                                                                                const allKits = {};

                                                                                                // Loop
                                                                                                await list.forEach(async (each) => {
                                                                                                    const kit = await compile_testKits(dir, companyID, each, year);
                                                                                                    allKits[each] = kit;
                                                                                                });

                                                                                                // PAyload
                                                                                                const payload = {
                                                                                                    testKits: allKits,
                                                                                                    storage: storage,
                                                                                                    services: services,
                                                                                                    message: "success",
                                                                                                };

                                                                                                // Return
                                                                                                callback(200, payload, "json");
                                                                                            }
                                                                                        });
                                                                                    } else {
                                                                                        callback(500, { error: "Something Happened, Please Try Again Later 8" }, "json");
                                                                                    }
                                                                                });
                                                                            } else {
                                                                                callback(500, { error: "Something Happened, Please Try Again Later 7" }, "json");
                                                                            }
                                                                        });
                                                                    } else {
                                                                        callback(500, { error: "Something Happened, Please Try Again Later 6" }, "json");
                                                                    }
                                                                });
                                                            } else {
                                                                callback(500, { error: "Something Happened, Please Try Again Later 5" }, "json");
                                                            }
                                                        });
                                                    } else {
                                                        callback(500, { error: "Something Happened, Please Try Again Later 4" }, "json");
                                                    }
                                                });
                                            } else {
                                                callback(500, { error: "Something Happened, Please Try aAgain Later 3" }, "json");
                                            }
                                        });
                                    } else {
                                        callback(500, { error: "Something Happened, Please Try aAgain Later 2" }, "json");
                                    }
                                });
                            } else {
                                callback(500, { error: "Something Happened, Please Try aAgain Later 1" }, "json");
                            }
                        });
                    } else {
                        callback(400, { error: "Invalid Token" }, "json");
                    }
                });
            } else {
                callback(400, { error: "Missing Required Fields" }, "json");
            }
            break;

        default:
            callback(405, {}, "json");
            break;
    }
};

// Fetch TestKit
// =======================================================
testKit["fetch_testKit"] = (data, callback) => {
    // Validate Method
    switch (data.method) {
        case "options":
            callback(200, {}, "json");
            break;

        case "get":
            // Validate data
            const tokenID = typeof data.query.tokenID === "string" && data.query.tokenID.trim().length > 20 ? data.query.tokenID.trim() : false;
            const dir = typeof data.query.type === "string" && data.query.type.trim().length > 5 ? data.query.type.trim().toLowerCase() : false;
            const companyID = typeof data.query.companyID === "string" && data.query.companyID.trim().length > 10 ? data.query.companyID.trim() : false;

            if (tokenID && companyID && dir) {
                // Validate Token
                validate(tokenID, (err) => {
                    if (!err) {
                        // Check Directory
                        directory.read(dir + "/" + companyID + "/testKits", async (err, list) => {
                            if (!err && list) {
                                // Check List
                                if (list.length > 0) {
                                    // Container
                                    const allKits = {};

                                    // Loop
                                    await list.forEach(async (each) => {
                                        const kit = await compile_testKits(dir, companyID, each, year);
                                        allKits[each] = kit;
                                    });

                                    // Return
                                    callback(200, allKits, "json");
                                } else {
                                    callback(200, {}, "json");
                                }
                            } else {
                                // Create directory
                                directory.create(dir + "/" + companyID + "/testKits", (err) => {
                                    if (!err) {
                                        callback(200, {}, "json");
                                    } else {
                                        callback(500, { error: "Something Happened, Please Try Again Later" }, "json");
                                    }
                                });
                            }
                        });
                    } else {
                        callback(400, { error: "Invalid Token" }, "json");
                    }
                });
            } else {
                callback(400, { error: "Missing Required Fields" }, "json");
            }
            break;

        default:
            callback(405, {}, "json");
            break;
    }
};

// Update TestKit Quantity
// =================================================================================
testKit["update_testKits_quantity"] = (data, callback) => {
    // Validate Method
    switch (data.method) {
        case "options":
            callback(200, {}, "json");
            break;

        case "put":
            // Validate amount
            const title = typeof data.payload.title === "string" && data.payload.title.trim().length > 0 ? data.payload.title.trim().toLowerCase() : false;
            const quantity = typeof data.payload.quantity === "string" && data.payload.quantity.trim().length > 0 ? data.payload.quantity.trim() : false;
            const tokenID = typeof data.payload.tokenID === "string" && data.payload.tokenID.trim().length > 0 ? data.payload.tokenID.trim() : false;
            const dir = typeof data.query.type === "string" && data.query.type.trim().length > 5 ? data.query.type.trim().toLowerCase() : false;
            const companyID = typeof data.payload.companyID === "string" && data.payload.companyID.trim().length > 0 ? data.payload.companyID.trim() : false;

            if (quantity && companyID && title && dir && tokenID) {
                //  Validate token
                validate(tokenID, (err) => {
                    if (!err) {
                        // fetch file
                        file.read(dir + "/" + companyID + "/testKits", title, (err, details) => {
                            if (!err && details) {
                                // Update
                                details.quantity += quantity;

                                // Save
                                file.update(dir + "/" + companyID + "/testKits", title, details, (err) => {
                                    if (!err) {
                                        callback(200, {}, "json");
                                    } else {
                                        callback(500, { error: "Something Happened, Please Try aAgain Later" }, "json");
                                    }
                                });
                            } else {
                                callback(500, { error: "Something Happened, Please Try aAgain Later" }, "json");
                            }
                        });
                    } else {
                        callback(400, { error: "Invalid Token" }, "json");
                    }
                });
            } else {
                callback(400, { error: "Missing Required Fields" }, "json");
            }
            break;

        default:
            callback(405, {}, "json");
            break;
    }
};

// Update TestKit Quantity
// =================================================================================
testKit["update_testKit_activity"] = (kit, nm, type, ID) => {
    // Validate
    const title = typeof kit === "string" && kit.trim().length > 0 ? kit.trim() : false;
    const name = typeof nm === "string" && nm.trim().length > 0 ? nm.trim() : false;
    const dir = typeof type === "string" && type.trim().length > 0 ? type.trim() : false;
    const companyID = typeof ID === "string" && ID.trim().length > 0 ? ID.trim() : false;

    if (name && dir && companyID && title) {
        // New
        const newData = {
            name: name,
            date: "",
            time: "",
            case: "",
        };

        // check Directory
        directory.read(dir + "/" + companyID + "/testKits/" + title + "/activities", (err) => {
            if (!err) {
                // Fetch The file
                file.read(dir + "/" + companyID + "/testKits/" + title + "/activities", month, (err, details) => {
                    if (!err && details) {
                        // Update
                        details.push(newData);

                        // Save
                        file.update(dir + "/" + companyID + "/testKits/" + title + "/activities", month, details, (err) => {
                            if (!err) {
                                //  Update Quantity
                                file.read(dir + "/" + companyID + "/testKits", title, (err, details) => {
                                    if (!err && details) {
                                        // Deduct
                                        details.quantity -= 1;
                                        file.update(dir + "/" + companyID + "/testKits", title, details, (err) => {
                                            if (!err) {
                                                // Return
                                                callback(false);
                                            } else {
                                                callback(true);
                                            }
                                        });
                                    } else {
                                        callback(true);
                                    }
                                });
                            } else {
                                callback(true);
                            }
                        });
                    } else {
                        // Create file
                        const data = [];
                        data.push(newData);

                        // Save
                        file.create(dir + "/" + companyID + "/testKits/" + title + "/activities", month, data, (err) => {
                            if (!err) {
                                //  Update Quantity
                                file.read(dir + "/" + companyID + "/testKits", title, (err, details) => {
                                    if (!err && details) {
                                        // Deduct
                                        details.quantity -= 1;
                                        file.update(dir + "/" + companyID + "/testKits", title, details, (err) => {
                                            if (!err) {
                                                // Return
                                                callback(false);
                                            } else {
                                                callback(true);
                                            }
                                        });
                                    } else {
                                        callback(true);
                                    }
                                });
                            } else {
                                callback(true);
                            }
                        });
                    }
                });
            } else {
                // Create Directory
                directory.create(dir + "/" + companyID + "/testKits/" + title + "/activities", (err) => {
                    if (!err) {
                        // Create file
                        const data = [];
                        data.push(newData);

                        // Save
                        file.create(dir + "/" + companyID + "/testKits/" + title + "/activities", month, data, (err) => {
                            if (!err) {
                                //  Update Quantity
                                file.read(dir + "/" + companyID + "/testKits", title, (err, details) => {
                                    if (!err && details) {
                                        // Deduct
                                        details.quantity -= 1;
                                        file.update(dir + "/" + companyID + "/testKits", title, details, (err) => {
                                            if (!err) {
                                                // Return
                                                callback(false);
                                            } else {
                                                callback(true);
                                            }
                                        });
                                    } else {
                                        callback(true);
                                    }
                                });
                            } else {
                                callback(true);
                            }
                        });
                    } else {
                        callback(true);
                    }
                });
            }
        });
        callback(true);
    }
};

// Delete TestKit Directory
// =================================================================================
testKit["delete_testKits_directory"] = (dir, ID, callback) => {
    // Validate
    const type = typeof dir === "string" && dir.length > 5 ? dir : false;
    const companyID = typeof ID === "string" && ID.length > 5 ? ID : false;

    if (type && companyID) {
        directory.delete(type + "/" + companyID + "/testKits", (err) => {
            if (!err) {
                // Return
                callback(false);
            } else {
                callback(true);
            }
        });
    } else {
        callback(true);
    }
};

// Export Module
module.exports = testKit;
