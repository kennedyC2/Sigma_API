// Update Revenue Data
// ==========================================================================================

// Dependencies
const file = require("./../file");
const folder = require("./../dir");
const helper = require("./../helper");

// Component
const update_revenue = (dir, ID, data, callback) => {
    // Validate amount
    const amount = typeof data === "number" && data.length > 0 ? data : false;
    const type = typeof dir === "string" && dir.length > 5 ? dir : false;
    const companyID = typeof ID === "string" && ID.length > 5 ? ID : false;

    if (amount && type && companyID) {
        const month = helper.month();
        const today = helper.today();
        const date = helper.date();
        const days = helper.days_In_Month();

        // Check Folder
        folder.read(type + "/" + companyID + "/revenue/" + month, (err) => {
            if (!err) {
                // Try Reading File
                file.read(type + "/" + companyID + "/revenue/" + month, today, (err, details) => {
                    if (!err && details) {
                        // Update
                        details.amount[date] += amount;

                        file.update(type + "/" + companyID + "/revenue/" + month, today, details, (err) => {
                            if (!err) {
                                callback(false);
                            } else {
                                callback(true);
                            }
                        });
                    } else {
                        // Create File
                        const a = [];
                        const b = [];
                        for (var i = 1; i < days + 1; i++) {
                            a.push(i);
                            b.push(0);
                        }

                        // Update values with New DAta
                        b[date] += amount;

                        const _data = {
                            days: a,
                            amount: b,
                        };

                        // Create File
                        file.create(type + "/" + companyID + "/revenue/" + month, today, _data, (err) => {
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
                folder.create(type + "/" + companyID + "/revenue/" + month, (err) => {
                    if (!err) {
                        // Create File
                        const a = [];
                        const b = [];
                        for (var i = 1; i < days + 1; i++) {
                            a.push(i);
                            b.push(0);
                        }

                        // Update values with New DAta
                        b[date] += amount;

                        const _data = {
                            days: a,
                            amount: b,
                        };

                        // Create File
                        file.create(type + "/" + companyID + "/revenue/" + month, today, _data, (err) => {
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
module.exports = update_revenue;
