// Create Company Account
// ====================================================================

// Import Dependencies
// ====================================================================
const file = require("./../file");
const folder = require("./../dir");
const token = require("./../token/main");
const helper = require("./../helper");
const hourly = require("./../hourly/main");
const lab_activities = require("./../lab_activities/main");
const revenue = require("./../revenue/main");
const services = require("./../services/main");
const testKit = require("./../testKit/main");
const test = require("./../tests/main");
const top_5 = require("./../top_5/main");
const user = require("./../users/main");
const stats = require("./../stats/main");
const storage = require("./../storage/main");

// Component
// ====================================================================
const create_company = (data, callback) => {
    // Confirm Methods
    switch (data.method) {
        case "options":
            callback(200, {});
            break;

        case "post":
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
                token.validate(tokenID, (err, tokenDetails) => {
                    if (!err && tokenDetails) {
                        // Create Company ID
                        const companyID = helper.createID(name);

                        if (companyID) {
                            // Create Company Folder
                            folder.create(dir + companyID, (err) => {
                                if (!err) {
                                    // Create Profile Folder
                                    folder.create(dir + companyID + "/profile", (err) => {
                                        if (!err) {
                                            // Create Object
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

                                            // Create Company File
                                            file.create(dir + companyID + "/profile", companyID, data, (err) => {
                                                if (!err) {
                                                    // Create Hourly Directory
                                                    hourly.create(dir, companyID, (err) => {
                                                        if (!err) {
                                                            // Create Lab Activity Directory
                                                            lab_activities.create(dir, companyID, (err) => {
                                                                if (!err) {
                                                                    // Create Revenue Directory
                                                                    revenue.create(dir, companyID, (err) => {
                                                                        if (!err) {
                                                                            // Create Services Directory
                                                                            services.create(dir, companyID, (err) => {
                                                                                if (!err) {
                                                                                    // Create TEstKit Directory
                                                                                    testKit.create(dir, companyID, (err) => {
                                                                                        if (!err) {
                                                                                            // Create Test Directory
                                                                                            test.create(dir, companyID, (err) => {
                                                                                                if (!err) {
                                                                                                    // CReate Top_5 Directory
                                                                                                    top_5.create(dir, companyID, (err) => {
                                                                                                        if (!err) {
                                                                                                            // Create Stat Directory
                                                                                                            stats.create(companyID, (err) => {
                                                                                                                if (!err) {
                                                                                                                    // Create Storage Directory
                                                                                                                    storage.create(dir, companyID, (err) => {
                                                                                                                        if (!err) {
                                                                                                                            // CReate User Directory
                                                                                                                            user.create_account(dir, companyID, (err) => {
                                                                                                                                if (!err) {
                                                                                                                                    // Get Personal Details
                                                                                                                                    file.read("accounts/admin", tokenDetails.email.replace(".com", ""), (err, userDetails) => {
                                                                                                                                        if (!err && userDetails) {
                                                                                                                                            // Create Data
                                                                                                                                            const fff = {
                                                                                                                                                name: name,
                                                                                                                                                companyID: companyID,
                                                                                                                                                time: Date.now(),
                                                                                                                                            };

                                                                                                                                            // Update Company LIst
                                                                                                                                            userDetails.company = [...userDetails.company, fff];

                                                                                                                                            // Update USer Details
                                                                                                                                            file.update("accounts/admin", tokenDetails.email.replace(".com", ""), userDetails, (err) => {
                                                                                                                                                if (!err) {
                                                                                                                                                    // Return Data
                                                                                                                                                    callback(200, userDetails);
                                                                                                                                                } else {
                                                                                                                                                    callback(500, { Error: "Something happened, Please Try Again Later" });
                                                                                                                                                }
                                                                                                                                            });
                                                                                                                                        } else {
                                                                                                                                            callback(500, { Error: "Something happened, Please Try Again Later" });
                                                                                                                                        }
                                                                                                                                    });
                                                                                                                                } else {
                                                                                                                                    callback(500, { Error: "Something happened, Please Try Again Later" });
                                                                                                                                }
                                                                                                                            });
                                                                                                                        } else {
                                                                                                                            callback(500, { Error: "Something Happened, Please Try Again Later" });
                                                                                                                        }
                                                                                                                    });
                                                                                                                } else {
                                                                                                                    callback(500, { Error: "Something happened, Please Try Again Later" });
                                                                                                                }
                                                                                                            });
                                                                                                        } else {
                                                                                                            callback(500, { Error: "Something happened, Please Try Again Later" });
                                                                                                        }
                                                                                                    });
                                                                                                } else {
                                                                                                    callback(500, { Error: "Something happened, Please Try Again Later" });
                                                                                                }
                                                                                            });
                                                                                        } else {
                                                                                            callback(500, { Error: "Something happened, Please Try Again Later" });
                                                                                        }
                                                                                    });
                                                                                } else {
                                                                                    callback(500, { Error: "Something happened, Please Try Again Later" });
                                                                                }
                                                                            });
                                                                        } else {
                                                                            callback(500, { Error: "Something happened, Please Try Again Later" });
                                                                        }
                                                                    });
                                                                } else {
                                                                    callback(500, { Error: "Something happened, Please Try Again Later" });
                                                                }
                                                            });
                                                        } else {
                                                            callback(500, { Error: "Something happened, Please Try Again Later" });
                                                        }
                                                    });
                                                } else {
                                                    callback(500, { Error: "Something happened, Please Try Again Later" });
                                                }
                                            });
                                        } else {
                                            callback(500, { Error: "Something happened, Please Try Again Later" });
                                        }
                                    });
                                } else {
                                    callback(500, { Error: "Something happened, Please Try Again Later" });
                                }
                            });
                        } else {
                            callback(500, { Error: "Something happened, Please Try Again Later" });
                        }
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
module.exports = create_company;
