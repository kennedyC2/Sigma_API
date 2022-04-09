// Delete Token
// =================================================================================

// Import Dependencies
const file = require("./../file");

// Component
const delete_token = (method, emailAdr, tokenID, ID, callback) => {
    // Check Method
    switch (method) {
        case "delete":
            // Check that all fields are present
            const email = typeof emailAdr === "string" && emailAdr.trim().length > 0 ? emailAdr.trim().toLowerCase() : false;
            const token = typeof tokenID === "string" && tokenID.trim().length >= 20 ? tokenID.trim() : false;
            const companyID = typeof ID === "string" && ID.trim().length >= 10 ? ID.trim() : false;

            if (email && token && companyID) {
                // Get Token File
                file.read("token", token, (err, tokenDetails) => {
                    if (!err && tokenDetails) {
                        // Confirm Details
                        if (email === tokenDetails.email && tokenDetails.company.indexOf(companyID) > -1) {
                            // Delete file
                            file.delete("token", token, (err) => {
                                if (!err) {
                                    callback(false, {});
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
module.exports = delete_token;
