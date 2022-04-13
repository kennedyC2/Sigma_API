// Update lab activity Data
// ==========================================================================================

// Dependencies
const file = require("../file");
const folder = require("../dir");
const helper = require("../helper");

// Component
const update_lab_activity = (type, ID, data, email, callback) => {
    // Validate amount
    const firstname = typeof data.firstname === "string" && data.firstname.trim().length > 0 ? data.firstname.trim().toLowerCase() : false;
    const lastname = typeof data.lastname === "string" && data.lastname.trim().length > 0 ? data.lastname.trim().toLowerCase() : false;
    const other = typeof data.other === "string" && data.other.trim().length > 0 ? data.other.trim().toLowerCase() : false;
    const time = typeof data.time === "string" && data.time.trim().length > 0 ? data.time.trim().toLowerCase() : false;
    const date = typeof data.date === "string" && data.date.trim().length > 0 ? data.date.trim().toLowerCase() : false;
    const user = typeof email === "string" && email.trim().length > 5 ? email.trim().toLowerCase() : false;
    const dir = typeof type === "string" && type.length > 5 ? type : false;
    const companyID = typeof ID === "string" && ID.length > 5 ? ID : false;

    if (firstname && lastname && other && time && date && user && dir && companyID) {
        const month = helper.month();
        const today = helper.today();

        // Define payload
        const payload = {
            firstname: firstname,
            lastname: lastname,
            other: other,
            time: time,
            date: date,
            user: user,
            type: "Booked A Test",
        };

        // Check Folder
        folder.read(type + "/" + companyID + "/lab_activities/" + month, (err) => {
            if (!err) {
                // Try Reading File
                file.read(type + "/" + companyID + "/lab_activities/" + month, today, (err, details) => {
                    if (!err && details) {
                        // Update
                        details = [...details, payload];

                        file.update(type + "/" + companyID + "/lab_activities/" + month, today, details, (err) => {
                            if (!err) {
                                callback(false);
                            } else {
                                callback(true);
                            }
                        });
                    } else {
                        //  Define Data
                        const _data = [];

                        // Add
                        _data = [..._data, payload];

                        // Create File
                        file.create(type + "/" + companyID + "/lab_activities/" + month, today, _data, (err) => {
                            if (!err) {
                                // Return
                                callback(false);
                            } else {
                                callback(true);
                            }
                        });
                    }
                });
            } else {
                // Create Directory & File
                folder.create(type + "/" + companyID + "/lab_activities/" + month, (err) => {
                    if (!err) {
                        //  Define Data
                        const _data = [];

                        // Add
                        _data = [..._data, payload];

                        // Create File
                        file.create(type + "/" + companyID + "/lab_activities/" + month, today, _data, (err) => {
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
            }
        });
    } else {
        callback(true);
    }
};

// Export
module.exports = update_lab_activity;
