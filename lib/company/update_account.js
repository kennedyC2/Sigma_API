// Create Company Account
// ====================================================================

// Import Dependencies
// ====================================================================
const file = require("./../file");
const token = require("./../token/main");

// Component
// ====================================================================
const update_company = (data, callback) => {
    // Confirm Methods
    switch (data.methods) {
        case "options":
            callback(200, {});
            break;

        case "put":
            // Check that all fields are present
            const name = typeof data.payload.name === "string" && data.payload.name.trim().length > 0 ? data.payload.name.trim().toLowerCase() : false;
            const phone = typeof data.payload.phone === "string" && data.payload.phone.trim().length > 0 ? data.payload.phone.trim() : false;
            const email = typeof data.payload.email === "string" && data.payload.email.trim().length > 0 ? data.payload.email.trim().toLowerCase() : false;
            const account = typeof data.payload.account === "string" && data.payload.account.trim().length > 0 ? data.payload.account.trim() : false;
            const reg_no = typeof data.payload.reg_no === "string" && data.payload.reg_no.trim().length > 0 ? data.payload.reg_no.trim().toLowerCase() : false;
            const address = typeof data.payload.address === "string" && data.payload.address.trim().length > 0 ? data.payload.address.trim().toLowerCase() : false;
            const tokenID = typeof data.payload.tokenID === "string" && data.payload.tokenID.trim().length > 0 ? data.payload.tokenID.trim() : false;
            const state = typeof data.payload.state === "string" && data.payload.state.trim().length > 0 ? data.payload.state.trim().toLowerCase() : false;
            const country = typeof data.payload.country === "string" && data.payload.country.trim().length > 0 ? data.payload.country.trim().toLowerCase() : false;
            const dir = typeof data.payload.type === "string" && data.payload.type.trim().length > 5 ? data.payload.type.trim().toLowerCase() : false;

            if (name && phone && email && account && reg_no && address && tokenID && state && country && dir) {
                // Validate Token
                token.validate(tokenID, (err) => {
                    if (!err) {
                        // Define Data
                        const data = {
                            name: name,
                            account: account,
                            phone: phone,
                            email: email,
                            reg_no: reg_no,
                            address: address,
                            state: state,
                            country: country,
                        };

                        // Update
                        file.update(dir + "/" + companyID + "/profile", companyID, data, (err) => {
                            if (!err) {
                                // Return
                                callback(200, {});
                            } else {
                                callback(500, { Error: "Something Happened, Please Try Again Later" });
                            }
                        });
                    } else {
                        callback(400, { Error: "Invalid Token" });
                    }
                });
            }
            break;

        default:
            callback(405, {});
            break;
    }
};

// Export
module.exports = update_company;
