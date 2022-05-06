// Update Services Data
// ==========================================================================================

// Dependencies
const file = require("../file");
const folder = require("../dir");
const { today } = require("../helper");
const { validate } = require("../token/main");

// Component
const update_services = (data, callback) => {
    // Validate Method
    switch (data.method) {
        case "options":
            callback(200, {});
            break;

        case "put":
            // Validate amount
            const name = typeof data.payload.name === "string" && data.payload.name.trim().length > 0 ? data.payload.name.trim().toLowerCase() : false;
            const category = typeof data.payload.category === "string" && data.payload.category.trim().length > 0 ? data.payload.category.trim() : false;
            const cost = typeof data.payload.cost === "string" && data.payload.cost.trim().length > 0 ? data.payload.cost.trim().toLowerCase() : false;
            const dir = typeof data.payload.type === "string" && data.payload.type.trim().length > 0 ? data.payload.type.trim() : false;
            const description = typeof data.payload.description === "string" && data.payload.description.trim().length > 0 ? data.payload.description.trim().toLowerCase() : false;
            const title = typeof data.payload.title === "string" && data.payload.title.trim().length > 0 ? data.payload.title.trim().toLowerCase() : false;
            const tokenID = typeof data.payload.tokenID === "string" && data.payload.tokenID.trim().length > 0 ? data.payload.tokenID.trim() : false;
            const companyID = typeof data.payload.companyID === "string" && data.payload.companyID.trim().length > 0 ? data.payload.companyID.trim() : false;

            if (name && category && cost && dir && description && title && tokenID) {
                //  Validate token
                validate(tokenID, (err) => {
                    if (!err) {
                        // Check Folder
                        folder.read(dir + "/" + companyID + "/services", (err) => {
                            if (!err) {
                                // Try Reading File
                                file.read(dir + "/" + companyID + "/services", "services", (err, services) => {
                                    if (!err && services) {
                                        if (services[category] !== undefined) {
                                            //  Define Data to be Stored
                                            const data = {};
                                            data["title"] = title;
                                            data["cost"] = cost;
                                            data["description"] = description;

                                            // Add
                                            if (services[category].testList[title] !== undefined) {
                                                callback(400, { Message: "Service Already Exists" });
                                            } else {
                                                services[category].testList[title] = data;

                                                // SAve
                                                file.update(dir + "/" + companyID + "/services", "services", services, (err) => {
                                                    if (!err) {
                                                        // Fetch Stats
                                                        file.read(dir + "/" + companyID + "/stats", today(), (err, stats) => {
                                                            if (!err && stats) {
                                                                stats.services += 1;

                                                                // Update
                                                                file.update(dir + "/" + companyID + "/stats", today(), stats, (err) => {
                                                                    if (!err) {
                                                                        // Fetch Top_5

                                                                        file.read(dir + "/" + companyID + "/top_5", "top_5", (err, top_5) => {
                                                                            if (!err && top_5) {
                                                                                // Update
                                                                                top_5.tests[title] = 0;

                                                                                // Save
                                                                                file.update(dir + "/" + companyID + "/top_5", "top_5", top_5, (err) => {
                                                                                    if (!err) {
                                                                                        // Return
                                                                                        const payload = {
                                                                                            services: services,
                                                                                            stats: stats,
                                                                                            top_5: top_5,
                                                                                        };

                                                                                        callback(200, payload);
                                                                                    } else {
                                                                                        callback(500, { Error: "Something Happened, Please Try again Later 7" });
                                                                                    }
                                                                                });
                                                                            } else {
                                                                                callback(500, { Error: "Something Happened, Please Try again Later 6" });
                                                                            }
                                                                        });
                                                                    } else {
                                                                        callback(500, { Error: "Something Happened, Please Try again Later 5" });
                                                                    }
                                                                });
                                                            } else {
                                                                callback(500, { Error: "Something Happened, Please Try again Later 4" });
                                                            }
                                                        });
                                                    } else {
                                                        callback(500, { Error: "Something Happened, Please Try again Later 3" });
                                                    }
                                                });
                                            }
                                        } else {
                                            //  Define Data to be Stored
                                            const data = {};
                                            data["name"] = name;
                                            data["testList"] = {};

                                            // ====================================
                                            const newTest = {};
                                            newTest["cost"] = cost;
                                            newTest["description"] = description;
                                            data["testList"][title] = newTest;

                                            // Add
                                            services[category] = data;

                                            file.update(dir + "/" + companyID + "/services", "services", services, (err) => {
                                                if (!err) {
                                                    // Fetch Stats
                                                    file.read(dir + "/" + companyID + "/stats", today(), (err, stats) => {
                                                        if (!err && stats) {
                                                            stats.services += 1;

                                                            // Update
                                                            file.update(dir + "/" + companyID + "/stats", today(), stats, (err) => {
                                                                if (!err) {
                                                                    // Fetch Top_5

                                                                    file.read(dir + "/" + companyID + "/top_5", "top_5", (err, top_5) => {
                                                                        if (!err && top_5) {
                                                                            // Update
                                                                            top_5.tests[title] = 0;

                                                                            // Save
                                                                            file.update(dir + "/" + companyID + "/top_5", "top_5", top_5, (err) => {
                                                                                if (!err) {
                                                                                    // Return
                                                                                    const payload = {
                                                                                        services: services,
                                                                                        stats: stats,
                                                                                        top_5: top_5,
                                                                                    };

                                                                                    callback(200, payload);
                                                                                } else {
                                                                                    callback(500, { Error: "Something Happened, Please Try again Later 7" });
                                                                                }
                                                                            });
                                                                        } else {
                                                                            callback(500, { Error: "Something Happened, Please Try again Later 6" });
                                                                        }
                                                                    });
                                                                } else {
                                                                    callback(500, { Error: "Something Happened, Please Try again Later 5" });
                                                                }
                                                            });
                                                        } else {
                                                            callback(500, { Error: "Something Happened, Please Try again Later 4" });
                                                        }
                                                    });
                                                } else {
                                                    callback(500, { Error: "Something Happened, Please Try again Later 3" });
                                                }
                                            });
                                        }
                                    } else {
                                        callback(500, { Error: "Something Happened, Please Try again Later 2" });
                                    }
                                });
                            } else {
                                callback(500, { Error: "Something Happened, Please Try again Later 1" });
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
module.exports = update_services;
