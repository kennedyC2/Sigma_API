// Delete top_5 Directory
// ==============================================================================

// Dependencies
const folder = require("../dir");

// Component
const delete_top_5 = (dir, ID, callback) => {
    // Validate
    const type = typeof dir === "string" && dir.length > 5 ? dir : false;
    const companyID = typeof ID === "string" && ID.length > 5 ? ID : false;

    if (type && companyID) {
        folder.delete(type + "/" + companyID + "/top_5", (err) => {
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
};

// Export
module.exports = delete_top_5;
