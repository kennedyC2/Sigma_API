// Update Services Data
// ==========================================================================================

// Dependencies
const file = require("./../file");
const folder = require("./../dir");
const helper = require("./../helper");
const token = require("./../token/main");

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
            const type = typeof data.payload.type === "string" && data.payload.type.trim().length > 0 ? data.payload.type.trim() : false;
            const description = typeof data.payload.description === "string" && data.payload.description.trim().length > 0 ? data.payload.description.trim().toLowerCase() : false;
            const title = typeof data.payload.title === "string" && data.payload.title.trim().length > 0 ? data.payload.title.trim().toLowerCase() : false;
            const tokenID = typeof data.payload.tokenID === "string" && data.payload.tokenID.trim().length > 0 ? data.payload.tokenID.trim() : false;
            const companyID = typeof data.payload.companyID === "string" && data.payload.companyID.trim().length > 0 ? data.payload.companyID.trim() : false;

            if (name && category && cost && type && description && title && tokenID) {
                //  Validate token
                token.validate(tokenID, (err) => {
                    if (!err) {
                        const month = helper.month();
                        const today = helper.today();

                        // Check Folder
                        folder.read(type + "/" + companyID + "/services/" + month, (err) => {
                            if (!err) {
                                // Try Reading File
                                file.read(type + "/" + companyID + "/services/" + month, today, (err, details) => {
                                    if (!err && details) {
                                        //  Define Data to be Stored
                                        const data = {};
                                        data["title"] = action.payload.title;
                                        data["cost"] = action.payload.cost;
                                        data["description"] = action.payload.description;

                                        // Merge with Previous Data
                                        // const oldData = state.services;
                                        // const stats = state.stats;
                                        // const top_5 = state.top_5;
                                        details[category].testList.push(data);
                                        // stats.services += 1;
                                        // top_5["tests"][action.payload.title.trim().replaceAll(" ", "_")] = 0;

                                        file.update(type + "/" + companyID + "/services/" + month, today, details, (err) => {
                                            if (!err) {
                                                callback(200, {});
                                            } else {
                                                callback(500, { Error: "Something Happened, Please Try again Later" });
                                            }
                                        });
                                    } else {
                                        // Container
                                        const container = {};
                                        //  Define Data to be Stored
                                        const data = {};
                                        data["name"] = name;
                                        data["testList"] = [];

                                        // ===========================
                                        const newTest = {};
                                        newTest["title"] = title;
                                        newTest["cost"] = cost;
                                        newTest["description"] = description;
                                        data["testList"].push(newTest);

                                        // Merge With Previous Data
                                        // const stats = state.stats;
                                        // const top_5 = state.top_5;
                                        container[category] = data;
                                        // stats.services += 1;
                                        // top_5["tests"][action.payload.title.trim().replaceAll(" ", "_")] = 0;

                                        // Create File
                                        file.create(type + "/" + companyID + "/services/" + month, today, container, (err) => {
                                            if (!err) {
                                                // Return
                                                callback(200, {});
                                            } else {
                                                callback(500, { Error: "Something Happened, Please Try again Later" });
                                            }
                                        });
                                    }
                                });
                            } else {
                                // Create Directory & File
                                folder.create(type + "/" + companyID + "/services/" + month, (err) => {
                                    if (!err) {
                                        // Container
                                        const container = {};
                                        //  Define Data to be Stored
                                        const data = {};
                                        data["name"] = name;
                                        data["testList"] = [];

                                        // ===========================
                                        const newTest = {};
                                        newTest["title"] = title;
                                        newTest["cost"] = cost;
                                        newTest["description"] = description;
                                        data["testList"].push(newTest);

                                        // Merge With Previous Data
                                        // const stats = state.stats;
                                        // const top_5 = state.top_5;
                                        container[category] = data;
                                        // stats.services += 1;
                                        // top_5["tests"][action.payload.title.trim().replaceAll(" ", "_")] = 0;

                                        // Create File
                                        file.create(type + "/" + companyID + "/services/" + month, today, container, (err) => {
                                            if (!err) {
                                                // Return
                                                callback(200, {});
                                            } else {
                                                callback(500, { Error: "Something Happened, Please Try again Later" });
                                            }
                                        });
                                    } else {
                                        callback(500, { Error: "Something Happened, Please Try again Later" });
                                    }
                                });
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
