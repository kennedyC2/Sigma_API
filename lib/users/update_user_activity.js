// Update user Activity
// ===================================================================

// Dependencies
const file = require("../file");
const { year, today } = require("../helper");

// Component
const update_user_activity = (data, type, ID, acct, src, email, callback) => {
    // Check that all fields are present
    const firstname = typeof data.firstname === "string" && data.firstname.trim().length > 0 ? data.firstname.trim().toLowerCase() : false;
    const lastname = typeof data.lastname === "string" && data.lastname.trim().length > 0 ? data.lastname.trim().toLowerCase() : false;
    const other = typeof data.other === "string" && data.other.trim().length > 0 ? data.other.trim().toLowerCase() : false;
    const account = typeof acct === "string" && acct.trim().length > 0 ? acct.trim() : false;
    const source = typeof src === "string" && src.trim().length > 0 ? src.trim() : false;
    const time = typeof data.time === "string" && data.time.trim().length > 0 ? data.time.trim().toLowerCase() : false;
    const date = typeof data.date === "string" && data.date.trim().length > 0 ? data.date.trim().toLowerCase() : false;
    const user = typeof email === "string" && email.trim().length > 5 ? email.trim().toLowerCase() : false;
    const dir = typeof type === "string" && type.trim().length > 5 ? type.trim().toLowerCase() : false;
    const companyID = typeof ID === "string" && ID.trim().length > 10 ? ID.trim() : false;

    if (firstname && lastname && other && time && date && user && dir && companyID && account && source) {
        const admin = account === "admin" ? true : false;

        if (admin) {
            // Fetch File
            file.read(dir + "/" + companyID + "/" + account + "/activities", year, (err, activities) => {
                if (!err && activities) {
                    // Update
                    const payload = {
                        firstname: firstname,
                        lastname: lastname,
                        other: other,
                        source: source,
                        time: time,
                        date: date,
                        type: "Booked A Test",
                    };

                    if (activities[today()] !== undefined) {
                        activities[today()] = [payload, ...activities[today()]];
                    } else {
                        activities[today()] = [payload];
                    }

                    // Save
                    file.update(dir + "/" + companyID + "/" + account + "/activities", year, activities, (err) => {
                        if (!err) {
                            // Return
                            callback(false, activities, "admin");
                        } else {
                            callback(true);
                        }
                    });
                } else {
                    // Define Data
                    const data = {};
                    const payload = {
                        firstname: firstname,
                        lastname: lastname,
                        other: other,
                        source: source,
                        time: time,
                        date: date,
                        type: "Booked A Test",
                    };

                    data[today()] = [payload];

                    // Create file
                    file.create(dir + "/" + companyID + "/" + account + "/activities", year, data, (err) => {
                        if (!err) {
                            callback(false, data, "admin");
                        } else {
                            callback(true);
                        }
                    });
                }
            });
        } else {
            // Fetch File
            file.read(dir + "/" + companyID + "/users/" + user.replace(".com", "") + "/activities", year, (err, activities) => {
                if (!err && activities) {
                    // Update
                    const payload = {
                        firstname: firstname,
                        lastname: lastname,
                        other: other,
                        source: source,
                        time: time,
                        date: date,
                        type: "Booked A Test",
                    };

                    if (activities[today()] !== undefined) {
                        activities[today()] = [payload, ...activities[today()]];
                    } else {
                        activities[today()] = [payload];
                    }

                    // Save
                    file.update(dir + "/" + companyID + "/users/" + user.replace(".com", "") + "/activities", year, activities, (err) => {
                        if (!err) {
                            // Return
                            callback(false, activities, "user");
                        } else {
                            callback(true);
                        }
                    });
                } else {
                    // Define Data
                    const data = {};
                    const payload = {
                        firstname: firstname,
                        lastname: lastname,
                        other: other,
                        source: source,
                        time: time,
                        date: date,
                        type: "Booked A Test",
                    };

                    data[today()] = [payload];

                    // Create file
                    file.create(dir + "/" + companyID + "/users/" + user.replace(".com", "") + "/activities", year, data, (err) => {
                        if (!err) {
                            callback(false, data, "user");
                        } else {
                            callback(true);
                        }
                    });
                }
            });
        }
    } else {
        callback(true);
    }
};

// Export
module.exports = update_user_activity;
