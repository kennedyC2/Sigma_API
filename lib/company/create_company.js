// Create Company Account
// ====================================================================

// Import Dependencies
// ====================================================================
const file = require("../file");
const folder = require("../dir");
const token = require("../token/main");
const helper = require("../helper");
const { create_hourly_directory } = require("../hourly/main");
const { create_lab_activity_directory } = require("../lab_activities/main");
const { create_revenue_directory } = require("../revenue/main");
const { create_services_directory } = require("../services/main");
const { create_testKit_directory } = require("../testKit/main");
const { create_test_directory } = require("../tests/main");
const { create_top_5_directory } = require("../top_5/main");
const { create_user_directory } = require("../users/main");
const { create_admin_directory } = require("../admin/main");
const { create_stats_directory } = require("../stats/main");
const { create_storage_directory } = require("../storage/main");

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
            const time = typeof data.payload.time === "string" && data.payload.time.trim().length > 0 ? data.payload.time.trim() : false;
            const date = typeof data.payload.date === "string" && data.payload.date.trim().length > 0 ? data.payload.date.trim() : false;
            const reg_no = typeof data.payload.reg_no === "string" && data.payload.reg_no.trim().length > 0 ? data.payload.reg_no.trim().toLowerCase() : false;
            const address = typeof data.payload.address === "string" && data.payload.address.trim().length > 0 ? data.payload.address.trim().toLowerCase() : false;
            const tokenID = typeof data.payload.tokenID === "string" && data.payload.tokenID.trim().length > 0 ? data.payload.tokenID.trim() : false;
            const state = typeof data.payload.state === "string" && data.payload.state.trim().length > 0 ? data.payload.state.trim().toLowerCase() : false;
            const country = typeof data.payload.country === "string" && data.payload.country.trim().length > 0 ? data.payload.country.trim().toLowerCase() : false;
            const dir = typeof data.payload.type === "string" && data.payload.type.trim().length > 5 ? data.payload.type.trim().toLowerCase() : false;

            if (name && phone && email && account && time && date && reg_no && address && tokenID && state && country && dir) {
                // Validate Token
                token.validate(tokenID, (err, tokenDetails) => {
                    if (!err && tokenDetails) {
                        // Create Company ID
                        const companyID = helper.createID(name);

                        if (companyID) {
                            // Create Company Folder
                            folder.create(dir + "/" + companyID, (err) => {
                                if (!err) {
                                    // Create Profile Folder
                                    folder.create(dir + "/" + companyID + "/profile", (err) => {
                                        if (!err) {
                                            // Create Object
                                            const data = {
                                                name: name,
                                                account: account,
                                                phone: phone,
                                                email: email,
                                                time: time,
                                                date: date,
                                                reg_no: reg_no,
                                                address: address,
                                                state: state,
                                                country: country,
                                            };

                                            // Create Company File
                                            file.create(dir + "/" + companyID + "/profile", companyID, data, (err) => {
                                                if (!err) {
                                                    // Create Hourly Directory
                                                    create_hourly_directory(dir, companyID, (err) => {
                                                        if (!err) {
                                                            // Create Lab Activity Directory
                                                            create_lab_activity_directory(dir, companyID, (err) => {
                                                                if (!err) {
                                                                    // Create Revenue Directory
                                                                    create_revenue_directory(dir, companyID, (err) => {
                                                                        if (!err) {
                                                                            // Create Services Directory
                                                                            create_services_directory(dir, companyID, (err) => {
                                                                                if (!err) {
                                                                                    // Create TEstKit Directory
                                                                                    create_testKit_directory(dir, companyID, (err) => {
                                                                                        if (!err) {
                                                                                            // Create Test Directory
                                                                                            create_test_directory(dir, companyID, (err) => {
                                                                                                if (!err) {
                                                                                                    // CReate Top_5 Directory
                                                                                                    create_top_5_directory(dir, companyID, (err) => {
                                                                                                        if (!err) {
                                                                                                            // Create Stat Directory
                                                                                                            create_stats_directory(dir, companyID, (err) => {
                                                                                                                if (!err) {
                                                                                                                    // Create Storage Directory
                                                                                                                    create_storage_directory(dir, companyID, (err) => {
                                                                                                                        if (!err) {
                                                                                                                            // CReate User Directory
                                                                                                                            create_user_directory(dir, companyID, (err) => {
                                                                                                                                if (!err) {
                                                                                                                                    // Create Admin directory
                                                                                                                                    create_admin_directory(dir, companyID, tokenDetails.email.replace(".com", ""), (err) => {
                                                                                                                                        if (!err) {
                                                                                                                                            // Get Personal Details
                                                                                                                                            file.read("accounts/admin", tokenDetails.email.replace(".com", ""), (err, userDetails) => {
                                                                                                                                                if (!err && userDetails) {
                                                                                                                                                    // Create Data
                                                                                                                                                    const fff = {
                                                                                                                                                        name: name,
                                                                                                                                                        companyID: companyID,
                                                                                                                                                        type: dir,
                                                                                                                                                        time: time,
                                                                                                                                                        date: date,
                                                                                                                                                    };

                                                                                                                                                    // Update Company LIst
                                                                                                                                                    userDetails.company = [...userDetails.company, fff];

                                                                                                                                                    // Update USer Details
                                                                                                                                                    file.update("accounts/admin", tokenDetails.email.replace(".com", ""), userDetails, (err) => {
                                                                                                                                                        if (!err) {
                                                                                                                                                            // Remove Password
                                                                                                                                                            delete userDetails.password;

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
