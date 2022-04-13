// Update test-list in Top-5
// ========================================================================

// Dependencies
const file = require("../file");
const folder = require("../dir");
const helper = require("../helper");

// Component
const update_test_list = (test, type, ID, callback) => {
    // Validate
    const testName = typeof test === "string" && test.trim().length > 0 ? test.trim() : false;
    const dir = typeof type === "string" && type.trim().length > 0 ? type.trim() : false;
    const companyID = typeof ID === "string" && ID.trim().length > 0 ? ID.trim() : false;

    if (testName && dir && companyID) {
        // =========================================
        const month = helper.month();

        // Fetch File
        file.read(dir + "/" + companyID + "/top_5", month, (err, top_5) => {
            if (!err && top_5) {
                // Update
                top_5.tests[testName] = 0;

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
module.exports = update_test_list;
