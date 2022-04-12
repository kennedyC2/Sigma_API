// Delete Single User Directory
// ==============================================================================

// Dependencies
const folder = require("./../dir");

// Component
const delete_user = (dir, ID, callback) => {
    // Validate
    const user = typeof email === "string" && email.trim().length > 5 ? email.trim().toLowerCase() : false;
    const type = typeof dir === "string" && dir.length > 5 ? dir : false;
    const companyID = typeof ID === "string" && ID.length > 5 ? ID : false;

    if (type && user && companyID) {
        folder.delete(type + "/" + companyID + "/users/" + user.replace(".com", ""), (err) => {
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
module.exports = delete_user;
