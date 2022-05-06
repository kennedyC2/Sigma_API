// Initiate TestKit Directory For NEw Account
// =======================================================

// Dependencies
const folder = require("../dir");
const token = require("../token/main");

// Component
const create_testKits = (type, companyId, callback) => {
    // Validate variables
    const companyID = typeof companyId === "string" && companyId.trim().length > 10 ? companyId.trim() : false;
    const dir = typeof type === "string" && type.trim().length > 5 ? type.trim().toLowerCase() : false;

    if (dir && companyID) {
        // Create testKits Directory
        folder.create(dir + "/" + companyID + "/testKits", (err) => {
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
module.exports = create_testKits;
