// Fetch Token
// =================================================================================

// Import Dependencies
const file = require("./../file");

// Component
const fetch_token = (method, tokenID, ID, callback) => {
    // Check Method
    switch (method) {
        case "get":
            // Check that all fields are present
            const token = typeof tokenID === "string" && tokenID.trim().length >= 20 ? tokenID.trim() : false;
            const companyID = typeof ID === "string" && ID.trim().length >= 10 ? ID.trim() : false;

            if (token && companyID) {
                // Get Token File
                file.read("token", token, (err, tokenDetails) => {
                    if (!err && tokenDetails) {
                        // Confirm Details
                        if (email === tokenDetails.email && tokenDetails.company.indexOf(companyID) > -1) {
                            // Return token
                            callback(false, tokenDetails);
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
module.exports = fetch_token;
