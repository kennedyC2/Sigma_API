// Initiate Top_5 Directory For NEw Account
// =======================================================

// Dependencies
const folder = require("./../dir");
const token = require("./../token/main");

// Component
const create_top_5 = (tokenId, companyId, callback) => {
    // Validate variables
    const tokenID = typeof tokenId === "string" && tokenId.trim().length > 20 ? tokenId.trim() : false;
    const companyID = typeof companyId === "string" && companyId.trim().length > 10 ? companyId.trim() : false;

    if (tokenID && companyID) {
        // Validate Token
        token.validate(tokenID, (err) => {
            if (!err) {
                // Create Top_5 Directory
                folder.create("laboratory/" + companyID + "/top_5", (err) => {
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
module.exports = create_top_5;
