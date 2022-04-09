// Validate Token
// =================================================================================

// Import Dependencies
const file = require("./../file");

// Component
const validate_token = (tokenID, callback) => {
    // Check that all fields are present
    const token = typeof tokenID === "string" && tokenID.trim().length >= 20 ? tokenID.trim() : false;

    if (token) {
        // Get Token File
        file.read("token", token, (err, tokenDetails) => {
            if (!err && tokenDetails) {
                // Confirm Details
                if (tokenDetails.session > Date.now()) {
                    // Validated
                    callback(false, tokenDetails);
                } else {
                    callback(false);
                }
            } else {
                callback(false);
            }
        });
    } else {
        callback(false);
    }
};

// Export
module.exports = validate_token;
