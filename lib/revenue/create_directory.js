// Initiate Revenue Directory For NEw Account
// =======================================================

// Dependencies
const folder = require("../dir");

// Component
const create_revenue = (type, companyId, callback) => {
    // Validate variables
    const companyID = typeof companyId === "string" && companyId.trim().length > 10 ? companyId.trim() : false;
    const dir = typeof type === "string" && type.trim().length > 5 ? type.trim().toLowerCase() : false;

    if (dir && companyID) {
        // Create revenue Directory
        folder.create(dir + "/" + companyID + "/revenue", (err) => {
            if (!err) {
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
module.exports = create_revenue;
