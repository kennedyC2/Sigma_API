// Initiate Tests Directory For NEw Account
// =======================================================

// Dependencies
const folder = require("./../dir");
const token = require("./../token/main");

// Component
const create_test = (tokenId, companyId, callback) => {
    // Validate variables
    const tokenID = typeof tokenId === "string" && tokenId.trim().length > 20 ? tokenId.trim() : false;
    const companyID = typeof companyId === "string" && companyId.trim().length > 10 ? companyId.trim() : false;

    if (tokenID && companyID) {
        // Validate Token
        token.validate(tokenID, (err) => {
            if (!err) {
                // Create Test Directory
                folder.create("laboratory/" + companyID + "/tests", (err) => {
                    if (!err) {
                        // Create Directory For Unsettled Tests
                        folder.create("laboratory/" + companyID + "/tests/unsettled", (err) => {
                            if (!err) {
                                // Create Directory For Settled Tests
                                folder.create("laboratory/" + companyID + "/tests/settled", (err) => {
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
module.exports = create_test;
