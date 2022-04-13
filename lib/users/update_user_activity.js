// Update user Activity
// ===================================================================

// Dependencies
const file = require("../file");
const helper = require("../helper");

// Component
const update_user_activity = (data, type, ID, email, callback) => {
    // Check that all fields are present
    const firstname = typeof data.firstname === "string" && data.firstname.trim().length > 0 ? data.firstname.trim().toLowerCase() : false;
    const lastname = typeof data.lastname === "string" && data.lastname.trim().length > 0 ? data.lastname.trim().toLowerCase() : false;
    const other = typeof data.other === "string" && data.other.trim().length > 0 ? data.other.trim().toLowerCase() : false;
    const time = typeof data.time === "string" && data.time.trim().length > 0 ? data.time.trim().toLowerCase() : false;
    const date = typeof data.date === "string" && data.date.trim().length > 0 ? data.date.trim().toLowerCase() : false;
    const user = typeof email === "string" && email.trim().length > 5 ? email.trim().toLowerCase() : false;
    const dir = typeof type === "string" && type.trim().length > 5 ? type.trim().toLowerCase() : false;
    const companyID = typeof ID === "string" && ID.trim().length > 10 ? ID.trim() : false;

    if (firstname && lastname && other && time && date && user && dir && companyID) {
        // ========================================
        const month = helper.month();

        // Fetch File
        file.read(dir + "/" + companyID + "/users/" + user.replace(".com", "") + "/activities", month, (err, activities) => {
            if (!err && activities) {
                // Update
                const payload = {
                    firstname: firstname,
                    lastname: lastname,
                    other: other,
                    time: time,
                    date: date,
                    type: "Booked A Test",
                };

                activities = [...activities, payload];

                // Save
                file.update(dir + "/" + companyID + "/users/" + user.replace(".com", "") + "/activities", month, activities, (err) => {
                    if (err) {
                        // Return
                        callback(false);
                    } else {
                        callback(true);
                    }
                });
            } else {
                // Define Data
                const data = [];
                const payload = {
                    firstname: firstname,
                    lastname: lastname,
                    other: other,
                    time: time,
                    date: date,
                    type: "Booked A Test",
                };

                data = [...data, payload];

                // Create file
                file.create(dir + "/" + companyID + "/users/" + user.replace(".com", "") + "/activities", month, data, (err) => {
                    if (!err) {
                        callback(false);
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
module.exports = update_user_activity;
