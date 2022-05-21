// handler for Company
// =======================================================

// Import Dependencies
// =======================================================
const file = require("./file");
const directory = require("./directory");
const { validate } = require("./token");
const { createID } = require("./helper");
const { create_hourly_directory, delete_hourly_directory } = require("./hourly");
const { create_lab_activity_directory, delete_lab_activities_directory } = require("./lab_activities");
const { create_revenue_directory, delete_revenue_directory } = require("./revenue");
const { create_services_directory, delete_services_directory } = require("./services");
const { create_testKits_directory, delete_testKits_directory } = require("./testKit");
const { create_test_directory, delete_test_directory } = require("./test");
const { create_top_5_directory, delete_top_5_directory } = require("./top_5");
const { create_user_directory, delete_all_users } = require("./user");
const { create_admin_directory } = require("./admin");
const { create_stat_directory, delete_stat_directory } = require("./stats");
const { create_storage_directory, delete_storage_directory } = require("./storage");

// Container
// =======================================================
const company = {};

// Create Company
// =======================================================
company["create_company"] = (data, callback) => {
    // Confirm Methods
    switch (data.method) {
        case "options":
            callback(200, {}, "json");
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
                validate(tokenID, (err, tokenDetails) => {
                    if (!err && tokenDetails) {
                        // Create Company ID
                        const companyID = createID(name);

                        if (companyID) {
                            // Create Company directory
                            directory.create(dir + "/" + companyID, (err) => {
                                if (!err) {
                                    // Create Profile directory
                                    directory.create(dir + "/" + companyID + "/profile", (err) => {
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
                                                                                    create_testKits_directory(dir, companyID, (err) => {
                                                                                        if (!err) {
                                                                                            // Create Test Directory
                                                                                            create_test_directory(dir, companyID, (err) => {
                                                                                                if (!err) {
                                                                                                    // CReate Top_5 Directory
                                                                                                    create_top_5_directory(dir, companyID, (err) => {
                                                                                                        if (!err) {
                                                                                                            // Create Stat Directory
                                                                                                            create_stat_directory(dir, companyID, (err) => {
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
                                                                                                                                                            callback(
                                                                                                                                                                200,
                                                                                                                                                                {
                                                                                                                                                                    details: userDetails,
                                                                                                                                                                    message: "Success",
                                                                                                                                                                },
                                                                                                                                                                "json"
                                                                                                                                                            );
                                                                                                                                                        } else {
                                                                                                                                                            callback(500, { error: "Something Went Wrong, Please Try Again Later" }, "json");
                                                                                                                                                        }
                                                                                                                                                    });
                                                                                                                                                } else {
                                                                                                                                                    callback(500, { error: "Something Went Wrong, Please Try Again Later" }, "json");
                                                                                                                                                }
                                                                                                                                            });
                                                                                                                                        } else {
                                                                                                                                            callback(500, { error: "Something Went Wrong, Please Try Again Later" }, "json");
                                                                                                                                        }
                                                                                                                                    });
                                                                                                                                } else {
                                                                                                                                    callback(500, { error: "Something Went Wrong, Please Try Again Later" }, "json");
                                                                                                                                }
                                                                                                                            });
                                                                                                                        } else {
                                                                                                                            callback(500, { error: "Something Went Wrong, Please Try Again Later" }, "json");
                                                                                                                        }
                                                                                                                    });
                                                                                                                } else {
                                                                                                                    callback(500, { error: "Something Went Wrong, Please Try Again Later" }, "json");
                                                                                                                }
                                                                                                            });
                                                                                                        } else {
                                                                                                            callback(500, { error: "Something Went Wrong, Please Try Again Later" }, "json");
                                                                                                        }
                                                                                                    });
                                                                                                } else {
                                                                                                    callback(500, { error: "Something Went Wrong, Please Try Again Later" }, "json");
                                                                                                }
                                                                                            });
                                                                                        } else {
                                                                                            callback(500, { error: "Something Went Wrong, Please Try Again Later" }, "json");
                                                                                        }
                                                                                    });
                                                                                } else {
                                                                                    callback(500, { error: "Something Went Wrong, Please Try Again Later" }, "json");
                                                                                }
                                                                            });
                                                                        } else {
                                                                            callback(500, { error: "Something Went Wrong, Please Try Again Later" }, "json");
                                                                        }
                                                                    });
                                                                } else {
                                                                    callback(500, { error: "Something Went Wrong, Please Try Again Later" }, "json");
                                                                }
                                                            });
                                                        } else {
                                                            callback(500, { error: "Something Went Wrong, Please Try Again Later" }, "json");
                                                        }
                                                    });
                                                } else {
                                                    callback(500, { error: "Something Went Wrong, Please Try Again Later" }, "json");
                                                }
                                            });
                                        } else {
                                            callback(500, { error: "Something Went Wrong, Please Try Again Later" }, "json");
                                        }
                                    });
                                } else {
                                    callback(500, { error: "Something Went Wrong, Please Try Again Later" }, "json");
                                }
                            });
                        } else {
                            callback(500, { error: "Something Went Wrong, Please Try Again Later" }, "json");
                        }
                    } else {
                        callback(400, { error: "Invalid Token" }, "json");
                    }
                });
            } else {
                callback(400, { error: "Missing Required Fields" }, "json");
            }
            break;

        default:
            callback(405, {}, "json");
            break;
    }
};

// Fetch Company
// =======================================================
company["fetch_company"] = (data, callback) => {
    // Validate Method
    switch (data.method) {
        case "options":
            callback(200, {}, "json");
            break;

        case "get":
            // Validate data
            const tokenID = typeof data.query.tokenID === "string" && data.query.tokenID.trim().length > 20 ? data.query.tokenID.trim() : false;
            const dir = typeof data.query.type === "string" && data.query.type.trim().length > 5 ? data.query.type.trim().toLowerCase() : false;
            const companyID = typeof data.query.companyID === "string" && data.query.companyID.trim().length > 10 ? data.query.companyID.trim() : false;

            if (tokenID && companyID && dir) {
                // Validate Token
                validate(tokenID, (err) => {
                    if (!err) {
                        // Get Company Details
                        file.read(dir + "/" + companyID + "/profile", companyID, (err, details) => {
                            if (!err && details) {
                                // Return
                                callback(200, details, "json");
                            } else {
                                callback(400, { error: "Profile Does Not Exist" }, "json");
                            }
                        });
                    } else {
                        callback(400, { error: "Invalid Token" }, "json");
                    }
                });
            } else {
                callback(400, { error: "Missing Required Fields" }, "json");
            }
            break;

        default:
            callback(405, {}, "json");
            break;
    }
};

// Update Company
// =======================================================
company["update_company"] = (data, callback) => {
    // Confirm Methods
    switch (data.method) {
        case "options":
            callback(200, {}, "json");
            break;

        case "put":
            // Check that all fields are present
            const name = typeof data.payload.name === "string" && data.payload.name.trim().length > 0 ? data.payload.name.trim().toLowerCase() : false;
            const phone = typeof data.payload.phone === "string" && data.payload.phone.trim().length > 0 ? data.payload.phone.trim() : false;
            const email = typeof data.payload.email === "string" && data.payload.email.trim().length > 0 ? data.payload.email.trim().toLowerCase() : false;
            const account = typeof data.payload.type === "string" && data.payload.type.trim().length > 0 ? data.payload.type.trim() : false;
            const reg_no = typeof data.payload.reg_no === "string" && data.payload.reg_no.trim().length > 0 ? data.payload.reg_no.trim().toLowerCase() : false;
            const address = typeof data.payload.address === "string" && data.payload.address.trim().length > 0 ? data.payload.address.trim().toLowerCase() : false;
            const tokenID = typeof data.payload.tokenID === "string" && data.payload.tokenID.trim().length > 0 ? data.payload.tokenID.trim() : false;
            const state = typeof data.payload.state === "string" && data.payload.state.trim().length > 0 ? data.payload.state.trim().toLowerCase() : false;
            const country = typeof data.payload.country === "string" && data.payload.country.trim().length > 0 ? data.payload.country.trim().toLowerCase() : false;
            const dir = typeof data.payload.type === "string" && data.payload.type.trim().length > 5 ? data.payload.type.trim().toLowerCase() : false;
            const companyID = typeof data.payload.companyID === "string" && data.payload.companyID.trim().length > 10 ? data.payload.companyID.trim() : false;

            if (name && phone && email && account && reg_no && address && tokenID && state && country && dir) {
                // Validate Token
                validate(tokenID, (err) => {
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
                                callback(200, data, "json");
                            } else {
                                callback(500, { error: "Something Went Wrong, Please Try Again Later" }, "json");
                            }
                        });
                    } else {
                        callback(400, { error: "Invalid Token" }, "json");
                    }
                });
            } else {
                callback(400, { error: "Missing Required Fields" }, "json");
            }
            break;

        default:
            callback(405, {}, "json");
            break;
    }
};

// Delete Company
// =======================================================
company["delete_company"] = (data, callback) => {
    // Validate Method
    switch (data.method) {
        case "options":
            callback(200, {}, "json");
            break;

        case "get":
            // Validate data
            const tokenID = typeof data.query.tokenID === "string" && data.query.tokenID.trim().length > 20 ? data.query.tokenID.trim() : false;
            const dir = typeof data.query.type === "string" && data.query.type.trim().length > 5 ? data.query.type.trim().toLowerCase() : false;
            const companyID = typeof data.query.companyID === "string" && data.query.companyID.trim().length > 10 ? data.query.companyID.trim() : false;

            if (tokenID && companyID && dir) {
                // Validate Token
                validate(tokenID, (err) => {
                    if (!err) {
                        // Delete hourly
                        delete_hourly_directory(dir, companyID, (err) => {
                            if (!err) {
                                // Delete lab_activities
                                delete_lab_activities_directory(dir, companyID, (err) => {
                                    if (!err) {
                                        // Delete revenue
                                        delete_revenue_directory(dir, companyID, (err) => {
                                            if (!err) {
                                                // Delete services
                                                delete_services_directory(dir, companyID, (err) => {
                                                    if (!err) {
                                                        // Delete tetsKit
                                                        delete_testKits_directory(dir, companyID, (err) => {
                                                            if (!err) {
                                                                // DElete Test
                                                                delete_test_directory(dir, companyID, (err) => {
                                                                    if (!err) {
                                                                        // Delete Top_5
                                                                        delete_top_5_directory(dir, companyID, (err) => {
                                                                            if (!err) {
                                                                                // Delete Users
                                                                                directory.read(dir + "/" + companyID + "/users", (err, list) => {
                                                                                    if (!err && list) {
                                                                                        if (list.length > 0) {
                                                                                            for (const prop of list) {
                                                                                                file.delete("accounts/users", prop);
                                                                                            }
                                                                                        }

                                                                                        delete_all_users(dir, companyID, (err) => {
                                                                                            if (!err) {
                                                                                                // Delete Stats
                                                                                                delete_stat_directory(dir, companyID, (err) => {
                                                                                                    if (!err) {
                                                                                                        // Delete storage
                                                                                                        delete_storage_directory(dir, companyID, (err) => {
                                                                                                            if (!err) {
                                                                                                                // Return
                                                                                                                callback(200, {}, "json");
                                                                                                            } else {
                                                                                                                callback(500, { error: "Something Went Wrong, Please Try Again Later" }, "json");
                                                                                                            }
                                                                                                        });
                                                                                                    } else {
                                                                                                        callback(500, { error: "Something Went Wrong, Please Try Again Later" }, "json");
                                                                                                    }
                                                                                                });
                                                                                            } else {
                                                                                                callback(500, { error: "Something Went Wrong, Please Try Again Later" }, "json");
                                                                                            }
                                                                                        });
                                                                                    } else {
                                                                                        callback(500, { error: "Something Went Wrong, Please Try Again Later" }, "json");
                                                                                    }
                                                                                });
                                                                            } else {
                                                                                callback(500, { error: "Something Went Wrong, Please Try Again Later" }, "json");
                                                                            }
                                                                        });
                                                                    } else {
                                                                        callback(500, { error: "Something Went Wrong, Please Try Again Later" }, "json");
                                                                    }
                                                                });
                                                            } else {
                                                                callback(500, { error: "Something Went Wrong, Please Try Again Later" }, "json");
                                                            }
                                                        });
                                                    } else {
                                                        callback(500, { error: "Something Went Wrong, Please Try Again Later" }, "json");
                                                    }
                                                });
                                            } else {
                                                callback(500, { error: "Something Went Wrong, Please Try Again Later" }, "json");
                                            }
                                        });
                                    } else {
                                        callback(500, { error: "Something Went Wrong, Please Try Again Later" }, "json");
                                    }
                                });
                            } else {
                                callback(500, { error: "Something Went Wrong, Please Try Again Later" }, "json");
                            }
                        });
                    } else {
                        callback(400, { error: "Invalid Token" }, "json");
                    }
                });
            } else {
                callback(400, { error: "Missing Required Fields" }, "json");
            }
            break;

        default:
            callback(405, {}, "json");
            break;
    }
};

// Export Module
module.exports = company;
