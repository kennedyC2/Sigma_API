// Initiate Hourly Directory For NEw Account
// =======================================================

// Dependencies
const folder = require("../dir");

// Component
const create_admin_directory = (type, companyId, email, callback) => {
    // Validate variables
    const path = typeof email === "string" && email.trim().length > 10 ? email.trim() : false;
    const companyID = typeof companyId === "string" && companyId.trim().length > 10 ? companyId.trim() : false;
    const dir = typeof type === "string" && type.trim().length > 5 ? type.trim().toLowerCase() : false;

    if (dir && companyID && path) {
        // Create admin Directory
        folder.create(dir + "/" + companyID + "/admin", (err) => {
            if (!err) {
                // create activities
                folder.create(dir + "/" + companyID + "/admin/activities", (err) => {
                    if (!err) {
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
module.exports = create_admin_directory;
