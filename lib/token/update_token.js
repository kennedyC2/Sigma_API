// Update Token
// =================================================================================

// Import Dependencies
const file = require("./../file");

// Component
const update_token = (method, emailAdr, tokenID, ID, callback) => {
    // Check Method
    switch (method) {
        case "put":
            // Check that all fields are present
            const email = typeof emailAdr === "string" && emailAdr.trim().length > 0 ? emailAdr.trim().toLowerCase() : false;
            const token = typeof tokenID === "string" && tokenID.trim().length >= 20 ? tokenID.trim() : false;
            const companyID = typeof ID === "string" && ID.trim().length >= 10 ? ID.trim() : false;

            if (email && token && companyID) {
                // Get Token File
                file.read("token", token, (err, tokenDetails) => {
                    if (!err && tokenDetails) {
                        // Confirm Details
                        if (email === tokenDetails.email) {
                            // Update Time
                            tokenDetails.session = Date.now + 1000 * 60 * 30;

                            // Save
                            file.update("token", token, tokenDetails, (err) => {
                                if (!err) {
                                    // Return
                                    callback(false, tokenDetails);
                                } else {
                                    callback(true, { Error: "Something happened, Please Try Again Later" });
                                }
                            });
                        } else {
                            callback(true, { Error: "Token Not Found" });
                        }
                    } else {
                        callback(true, { Error: "Token Not Found" });
                    }
                });
            } else {
                callback(true, { Error: "Something happened, Please Try Again Later" });
            }
            break;

        default:
            callback(true, { Error: "Something happened, Please Try Again Later" });
            break;
    }
};

// Export
module.exports = update_token;
