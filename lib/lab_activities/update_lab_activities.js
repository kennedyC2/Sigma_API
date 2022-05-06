// Update lab activity Data
// ==========================================================================================

// Dependencies
const file = require("../file");
const folder = require("../dir");
const { year, today } = require("../helper");

// Component
const update_lab_activity = (type, ID, data, source, callback) => {
    // Validate amount
    const firstname = typeof data.firstname === "string" && data.firstname.trim().length > 0 ? data.firstname.trim().toLowerCase() : false;
    const lastname = typeof data.lastname === "string" && data.lastname.trim().length > 0 ? data.lastname.trim().toLowerCase() : false;
    const other = typeof data.other === "string" && data.other.trim().length > 0 ? data.other.trim().toLowerCase() : false;
    const time = typeof data.time === "string" && data.time.trim().length > 0 ? data.time.trim().toLowerCase() : false;
    const date = typeof data.date === "string" && data.date.trim().length > 0 ? data.date.trim().toLowerCase() : false;
    const user = typeof source === "string" && source.trim().length > 5 ? source.trim().toLowerCase() : false;
    const dir = typeof type === "string" && type.length > 5 ? type : false;
    const companyID = typeof ID === "string" && ID.length > 5 ? ID : false;

    if (firstname && lastname && other && time && date && user && dir && companyID) {
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
        folder.read(type + "/" + companyID + "/lab_activities", (err) => {
            if (!err) {
                // Try Reading File
                file.read(type + "/" + companyID + "/lab_activities", year, (err, details) => {
                    if (!err && details) {
                        if (details[today()] !== undefined) {
                            // Update
                            details[today()] = [payload, ...details[today()]];
                        } else {
                            // Update
                            details[today()] = [payload];
                        }

                        file.update(type + "/" + companyID + "/lab_activities", year, details, (err) => {
                            if (!err) {
                                callback(false, details);
                            } else {
                                callback(true);
                            }
                        });
                    } else {
                        //  Define Data
                        const _data = {};

                        // update
                        _data[today()] = [payload];

                        // Create File
                        file.create(type + "/" + companyID + "/lab_activities", year, _data, (err) => {
                            if (!err) {
                                // Return
                                callback(false, _data);
                            } else {
                                callback(true);
                            }
                        });
                    }
                });
            } else {
                callback(true);
            }
        });
    } else {
        callback(true);
    }
};

// Export
module.exports = update_lab_activity;
