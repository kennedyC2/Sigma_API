// Update TestKit Data
// ==========================================================================================

// Dependencies
const file = require("../file");
const token = require("../token/main");

// Component
const update_testKits_quantity = (data, callback) => {
    // Validate Method
    switch (data.method) {
        case "options":
            callback(200, {});
            break;

        case "put":
            // Validate amount
            const title = typeof data.payload.title === "string" && data.payload.title.trim().length > 0 ? data.payload.title.trim().toLowerCase() : false;
            const quantity = typeof data.payload.quantity === "string" && data.payload.quantity.trim().length > 0 ? data.payload.quantity.trim() : false;
            const tokenID = typeof data.payload.tokenID === "string" && data.payload.tokenID.trim().length > 0 ? data.payload.tokenID.trim() : false;
            const dir = typeof data.query.type === "string" && data.query.type.trim().length > 5 ? data.query.type.trim().toLowerCase() : false;
            const companyID = typeof data.payload.companyID === "string" && data.payload.companyID.trim().length > 0 ? data.payload.companyID.trim() : false;

            if (quantity && companyID && title && dir && tokenID) {
                //  Validate token
                token.validate(tokenID, (err) => {
                    if (!err) {
                        // fetch file
                        file.read(dir + "/" + companyID + "/testKits", title, (err, details) => {
                            if (!err && details) {
                                // Update
                                details.quantity += quantity;

                                // Save
                                file.update(dir + "/" + companyID + "/testKits", title, details, (err) => {
                                    if (!err) {
                                        callback(200, {});
                                    } else {
                                        callback(500, { Error: "Something Happened, Please Try aAgain Later" });
                                    }
                                });
                            } else {
                                callback(500, { Error: "Something Happened, Please Try aAgain Later" });
                            }
                        });
                    } else {
                        callback(400, { Error: "Invalid Token" });
                    }
                });
            } else {
                callback(400, { Error: "Missing Required Fields" });
            }
            break;

        default:
            callback(405, {});
            break;
    }
};

// Export
module.exports = update_testKits_quantity;
