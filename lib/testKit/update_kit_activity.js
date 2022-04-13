// Update TestKit ACtivity Data
// ==========================================================================================

// Dependencies
const file = require("../file");
const folder = require("../dir");
const helper = require("../helper");

// Component
const update_testKits_activity = (kit, nm, type, ID) => {
    // Validate
    const title = typeof kit === "string" && kit.trim().length > 0 ? kit.trim() : false;
    const name = typeof nm === "string" && nm.trim().length > 0 ? nm.trim() : false;
    const dir = typeof type === "string" && type.trim().length > 0 ? type.trim() : false;
    const companyID = typeof ID === "string" && ID.trim().length > 0 ? ID.trim() : false;

    if (name && dir && companyID && title) {
        // ================================
        const month = helper.month();

        // New
        const newData = {
            name: name,
            date: "",
            time: "",
            case: "",
        };

        // check Directory
        folder.read(dir + "/" + companyID + "/testKits/" + title + "/activities", (err) => {
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
                folder.create(dir + "/" + companyID + "/testKits/" + title + "/activities", (err) => {
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

// Export
module.exports = update_testKits_activity;
