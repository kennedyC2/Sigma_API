// Update Hourly Data
// ==========================================================================================

// Dependencies
const file = require("../file");
const folder = require("../dir");
const { hour, today } = require("../helper");

// Component
const update_hourly = (dir, ID, data, callback) => {
    // Validate amount
    const payload = typeof data === "object" ? data : false;
    const type = typeof dir === "string" && dir.length > 5 ? dir : false;
    const companyID = typeof ID === "string" && ID.length > 5 ? ID : false;

    if (payload && type && companyID) {
        // Check Folder
        folder.read(type + "/" + companyID + "/hourly", (err) => {
            if (!err) {
                // Try Reading File
                file.read(type + "/" + companyID + "/hourly", today(), (err, details) => {
                    if (!err && details) {
                        // Update

                        if (parseInt(hour.split(":")[0]) <= 8 && hour.split(":")[1] === "am") {
                            details["amount"][0] += parseInt(payload.selectedTest.map((cost) => cost.split(":").pop()));
                        }

                        if (parseInt(hour.split(":")[0]) > 8 && parseInt(hour.split(":")[0]) <= 10 && hour.split(":")[1] === "am") {
                            details["amount"][1] += parseInt(payload.selectedTest.map((cost) => cost.split(":").pop()));
                        }

                        if (parseInt(hour.split(":")[0]) > 10 && parseInt(hour.split(":")[0]) <= 12 && hour.split(":")[1] === "pm") {
                            details["amount"][2] += parseInt(payload.selectedTest.map((cost) => cost.split(":").pop()));
                        }

                        if (parseInt(hour.split(":")[0]) > 0 && parseInt(hour.split(":")[0]) <= 2 && hour.split(":")[1] === "pm") {
                            details["amount"][3] += parseInt(payload.selectedTest.map((cost) => cost.split(":").pop()));
                        }

                        if (parseInt(hour.split(":")[0]) > 2 && parseInt(hour.split(":")[0]) <= 4 && hour.split(":")[1] === "pm") {
                            details["amount"][4] += parseInt(payload.selectedTest.map((cost) => cost.split(":").pop()));
                        }

                        if (parseInt(hour.split(":")[0]) > 4 && parseInt(hour.split(":")[0]) <= 6 && hour.split(":")[1] === "pm") {
                            details["amount"][5] += parseInt(payload.selectedTest.map((cost) => cost.split(":").pop()));
                        }

                        if (parseInt(hour.split(":")[0]) > 6 && parseInt(hour.split(":")[0]) <= 8 && hour.split(":")[1] === "pm") {
                            details["amount"][6] += parseInt(payload.selectedTest.map((cost) => cost.split(":").pop()));
                        }

                        if (parseInt(hour.split(":")[0]) > 8 && parseInt(hour.split(":")[0]) <= 10 && hour.split(":")[1] === "pm") {
                            details["amount"][7] += parseInt(payload.selectedTest.map((cost) => cost.split(":").pop()));
                        }

                        details["total"] += parseInt(payload.selectedTest.map((cost) => cost.split(":").pop()));

                        file.update(type + "/" + companyID + "/hourly", today(), details, (err) => {
                            if (!err) {
                                callback(false, details);
                            } else {
                                callback(true);
                            }
                        });
                    } else {
                        // Create File
                        const _data = {
                            amount: [0, 0, 0, 0, 0, 0, 0, 0],
                            total: 0,
                        };

                        if (parseInt(hour.split(":")[0]) <= 8 && hour.split(":")[1] === "am") {
                            _data["amount"][0] += parseInt(payload.selectedTest.map((cost) => cost.split(":").pop()));
                        }

                        if (parseInt(hour.split(":")[0]) > 8 && parseInt(hour.split(":")[0]) <= 10 && hour.split(":")[1] === "am") {
                            _data["amount"][1] += parseInt(payload.selectedTest.map((cost) => cost.split(":").pop()));
                        }

                        if (parseInt(hour.split(":")[0]) > 10 && parseInt(hour.split(":")[0]) <= 12 && hour.split(":")[1] === "pm") {
                            _data["amount"][2] += parseInt(payload.selectedTest.map((cost) => cost.split(":").pop()));
                        }

                        if (parseInt(hour.split(":")[0]) > 0 && parseInt(hour.split(":")[0]) <= 2 && hour.split(":")[1] === "pm") {
                            _data["amount"][3] += parseInt(payload.selectedTest.map((cost) => cost.split(":").pop()));
                        }

                        if (parseInt(hour.split(":")[0]) > 2 && parseInt(hour.split(":")[0]) <= 4 && hour.split(":")[1] === "pm") {
                            _data["amount"][4] += parseInt(payload.selectedTest.map((cost) => cost.split(":").pop()));
                        }

                        if (parseInt(hour.split(":")[0]) > 4 && parseInt(hour.split(":")[0]) <= 6 && hour.split(":")[1] === "pm") {
                            _data["amount"][5] += parseInt(payload.selectedTest.map((cost) => cost.split(":").pop()));
                        }

                        if (parseInt(hour.split(":")[0]) > 6 && parseInt(hour.split(":")[0]) <= 8 && hour.split(":")[1] === "pm") {
                            _data["amount"][6] += parseInt(payload.selectedTest.map((cost) => cost.split(":").pop()));
                        }

                        if (parseInt(hour.split(":")[0]) > 8 && parseInt(hour.split(":")[0]) <= 10 && hour.split(":")[1] === "pm") {
                            _data["amount"][7] += parseInt(payload.selectedTest.map((cost) => cost.split(":").pop()));
                        }

                        _data["total"] += parseInt(payload.selectedTest.map((cost) => cost.split(":").pop()));

                        // Create File
                        file.create(type + "/" + companyID + "/hourly", today(), _data, (err) => {
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
                folder.create(type + "/" + companyID + "/hourly", (err) => {
                    if (!err) {
                        //  Define Data
                        const _data = {
                            amount: [0, 0, 0, 0, 0, 0, 0, 0],
                            total: 0,
                        };

                        if (parseInt(hour.split(":")[0]) <= 8 && hour.split(":")[1] === "am") {
                            _data["amount"][0] += parseInt(payload.selectedTest.map((cost) => cost.split(":").pop()));
                        }

                        if (parseInt(hour.split(":")[0]) > 8 && parseInt(hour.split(":")[0]) <= 10 && hour.split(":")[1] === "am") {
                            _data["amount"][1] += parseInt(payload.selectedTest.map((cost) => cost.split(":").pop()));
                        }

                        if (parseInt(hour.split(":")[0]) > 10 && parseInt(hour.split(":")[0]) <= 12 && hour.split(":")[1] === "pm") {
                            _data["amount"][2] += parseInt(payload.selectedTest.map((cost) => cost.split(":").pop()));
                        }

                        if (parseInt(hour.split(":")[0]) > 0 && parseInt(hour.split(":")[0]) <= 2 && hour.split(":")[1] === "pm") {
                            _data["amount"][3] += parseInt(payload.selectedTest.map((cost) => cost.split(":").pop()));
                        }

                        if (parseInt(hour.split(":")[0]) > 2 && parseInt(hour.split(":")[0]) <= 4 && hour.split(":")[1] === "pm") {
                            _data["amount"][4] += parseInt(payload.selectedTest.map((cost) => cost.split(":").pop()));
                        }

                        if (parseInt(hour.split(":")[0]) > 4 && parseInt(hour.split(":")[0]) <= 6 && hour.split(":")[1] === "pm") {
                            _data["amount"][5] += parseInt(payload.selectedTest.map((cost) => cost.split(":").pop()));
                        }

                        if (parseInt(hour.split(":")[0]) > 6 && parseInt(hour.split(":")[0]) <= 8 && hour.split(":")[1] === "pm") {
                            _data["amount"][6] += parseInt(payload.selectedTest.map((cost) => cost.split(":").pop()));
                        }

                        if (parseInt(hour.split(":")[0]) > 8 && parseInt(hour.split(":")[0]) <= 10 && hour.split(":")[1] === "pm") {
                            _data["amount"][7] += parseInt(payload.selectedTest.map((cost) => cost.split(":").pop()));
                        }

                        _data["total"] += parseInt(payload.selectedTest.map((cost) => cost.split(":").pop()));

                        // Create File
                        file.create(type + "/" + companyID + "/hourly", today(), _data, (err) => {
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
module.exports = update_hourly;
