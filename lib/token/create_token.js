// Create Token
// =================================================================================

// Import Dependencies
const file = require("./../file");
const helper = require("./../helper");

// Component
const create_token = (method, emailAdr, callback) => {
    // Check Method
    switch (method) {
        case "post":
            // Check that all fields are present
            const email = typeof emailAdr === "string" && emailAdr.trim().length > 0 ? emailAdr.trim().toLowerCase() : false;
            if (email) {
                // Create TOken Data
                const data = {
                    email: email,
                    tokenID: helper.createRandomString(30).toUpperCase(),
                    session: Date.now() + 1000 * 60 * 60 * 8,
                };

                // create Token file
                file.create("token", data.tokenID, data, (err) => {
                    if (!err) {
                        callback(false, data);
                    } else {
                        callback(true, { Error: "Something happened, Please Try Again Later" });
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
module.exports = create_token;
