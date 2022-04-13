// Add testKits
// ==========================================================================================

// Dependencies
const file = require("./../file");
const folder = require("./../dir");
const helper = require("./../helper");
const token = require("./../token/main");

// Component
const add_kit = (data, callback) => {
    // Validate Method
    switch (data.method) {
        case "options":
            callback(200, {});
            break;

        case "put":
            // Validate amount
            const name = typeof data.payload.title === "string" && data.payload.title.trim().length > 0 ? data.payload.title.trim().toLowerCase() : false;
            const quantity = typeof data.payload.quantity === "string" && data.payload.quantity.trim().length > 0 ? data.payload.quantity.trim() : false;
            const dir = typeof data.payload.type === "string" && data.payload.type.trim().length > 0 ? data.payload.type.trim() : false;
            const tokenID = typeof data.payload.tokenID === "string" && data.payload.tokenID.trim().length > 0 ? data.payload.tokenID.trim() : false;
            const companyID = typeof data.payload.companyID === "string" && data.payload.companyID.trim().length > 0 ? data.payload.companyID.trim() : false;

            if (name && quantity && cost && dir && description && title && tokenID) {
                //  Validate token
                token.validate(tokenID, (err) => {
                    if (!err) {
                        const month = helper.month();

                        // Check Folder
                        folder.read(dir + "/" + companyID + "/testKits", (err) => {
                            if (!err) {
                                //
                            } else {
                                // Create Folder
                                folder.create(dir + "/" + companyID + "/testKits", (err) => {
                                    if (!err) {
                                        // Create kit
                                        folder.create(dir + "/" + companyID + "/testKits/" + name, (err) => {
                                            if (!err) {
                                                // Define Data
                                                const data = {
                                                    title: name,
                                                    quantity: quantity,
                                                };

                                                // Save
                                                file.create(dir + "/" + companyID + "/testKits/" + name, "kit", data, (err) => {
                                                    if (!err) {
                                                        // Activity
                                                        const activity = [];

                                                        // Save
                                                        folder.create(dir + "/" + companyID + "/testKits/" + name + "/activities", (err) => {
                                                            if (!err) {
                                                                // create file
                                                                file.create(dir + "/" + companyID + "/testKits/" + name + "/activities", month, activity, (err) => {
                                                                    if (!err) {
                                                                        // Get Storage
                                                                        file.read(dir + "/" + companyID + "/storage", "storage", (err, storage) => {
                                                                            if (!err && storage) {
                                                                                // Update Storage
                                                                                storage["kits"] += 1;

                                                                                // Save
                                                                                file.update(dir + "/" + companyID + "/storage", "storage", storage, (err) => {
                                                                                    if (!err) {
                                                                                        // Return
                                                                                        callback(200, {});
                                                                                    } else {
                                                                                        callback(500, { Error: "Something Happened, Please Try Again Later" });
                                                                                    }
                                                                                });
                                                                            } else {
                                                                                callback(500, { Error: "Something Happened, Please Try Again Later" });
                                                                            }
                                                                        });
                                                                    } else {
                                                                        callback(500, { Error: "Something Happened, Please Try Again Later" });
                                                                    }
                                                                });
                                                            } else {
                                                                callback(500, { Error: "Something Happened, Please Try aAgain Later" });
                                                            }
                                                        });
                                                    } else {
                                                        callback(500, { Error: "Something Happened, Please Try aAgain Later" });
                                                    }
                                                });
                                            } else {
                                                callback(500, { Error: "Something Happened, Please Try aAgain Later" });
                                            }
                                        });
                                    } else {
                                        callback(500, { Error: "Something Happened, Please Try aAgain Later" });
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
module.exports = add_kit;
