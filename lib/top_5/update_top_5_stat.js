// Update test-stat in Top-5
// ========================================================================

// Dependencies
const file = require("../file");
const helper = require("../helper");

// Component
const update_test_stat = (data, type, ID, callback) => {
    // Validate
    const payload = typeof data === "object" ? test.trim() : false;
    const dir = typeof type === "string" && type.trim().length > 0 ? type.trim() : false;
    const companyID = typeof ID === "string" && ID.trim().length > 0 ? ID.trim() : false;

    if (payload && dir && companyID) {
        // =========================================
        const month = helper.month();

        // Fetch File
        file.read(dir + "/" + companyID + "/top_5", month, (err, top_5) => {
            if (!err && top_5) {
                // Update
                for (const item of payload.selectedTest) {
                    top_5["tests"][item.split(":")[2].trim().replaceAll(" ", "_")] += 1;
                }

                // Save
                file.update(dir + "/" + companyID + "/top_5", month, top_5, (err) => {
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
};

// Export
module.exports = update_test_stat;
