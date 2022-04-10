// Initiate Users Directory For NEw Account
// =======================================================

// Dependencies
const folder = require("./../dir");
const token = require("./../token/main");

// Component
const create_user_directory = (tokenId, companyId, callback) => {
    // Validate variables
    const tokenID = typeof tokenId === "string" && tokenId.trim().length > 20 ? tokenId.trim() : false;
    const companyID = typeof companyId === "string" && companyId.trim().length > 10 ? companyId.trim() : false;

    if (tokenID && companyID) {
        // Validate Token
        token.validate(tokenID, (err) => {
            if (!err) {
                // Create user Directory
                folder.create("laboratory/" + companyID + "/user", (err) => {
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
module.exports = create_user_directory;
