// Handler for Tests
// =====================================================================

// Import Dependencies
// =================================================================================
const file = require("./file");
const directory = require("./directory");
const { update_lab_activity } = require("./lab_activities");
const { update_user_activity } = require("./user");
const { update_hourly } = require("./hourly");
const { update_stats } = require("./stats");
const { update_test_stat } = require("./top_5");
const { update_revenue } = require("./revenue");
const { validate } = require("./token");
const { today, year } = require("./helper");

// Container
// =================================================================================
const test = {};

// Create Test Directory
// =================================================================================
test["create_test_directory"] = (type, companyId, callback) => {
    // Validate variables
    const companyID = typeof companyId === "string" && companyId.trim().length > 10 ? companyId.trim() : false;
    const dir = typeof type === "string" && type.trim().length > 5 ? type.trim().toLowerCase() : false;

    if (dir && companyID) {
        // Create test Directory
        directory.create(dir + "/" + companyID + "/tests", (err) => {
            if (!err) {
                callback(false);
            } else {
                callback(true);
            }
        });
    } else {
        callback(true);
    }
};

// Book A Test
// =================================================================================
test["Book_A_Test"] = (data, callback) => {
    // Check Method
    switch (data.method) {
        case "options":
            callback(200, {}, "json");
            break;

        case "post":
            // Check that all fields are present
            const firstname = typeof data.payload.firstname === "string" && data.payload.firstname.trim().length > 0 ? data.payload.firstname.trim() : false;
            const lastname = typeof data.payload.lastname === "string" && data.payload.lastname.trim().length > 0 ? data.payload.lastname.trim() : false;
            const other = typeof data.payload.other === "string" && data.payload.other.trim().length > 0 ? data.payload.other.trim() : false;
            const day = typeof data.payload.day === "string" && data.payload.day.trim().length > 0 ? data.payload.day.trim() : false;
            const month = typeof data.payload.month === "string" && data.payload.month.trim().length > 0 ? data.payload.month.trim() : false;
            const year = typeof data.payload.year === "string" && data.payload.year.trim().length > 0 ? data.payload.year.trim() : false;
            const date = typeof data.payload.date === "string" && data.payload.date.trim().length > 0 ? data.payload.date.trim() : false;
            const time = typeof data.payload.time === "string" && data.payload.time.trim().length > 0 ? data.payload.time.trim() : false;
            const age = typeof data.payload.age === "string" && data.payload.age.trim().length > 0 ? data.payload.age.trim() : false;
            const sex = typeof data.payload.sex === "string" && data.payload.sex.trim().length > 0 ? data.payload.sex.trim() : false;
            const religion = typeof data.payload.religion === "string" && data.payload.religion.trim().length > 0 ? data.payload.religion.trim() : false;
            const tribe = typeof data.payload.tribe === "string" && data.payload.tribe.trim().length > 0 ? data.payload.tribe.trim() : false;
            const source = typeof data.payload.source === "string" && data.payload.source.trim().length > 0 ? data.payload.source.trim() : false;
            const account = typeof data.payload.account === "string" && data.payload.account.trim().length > 0 ? data.payload.account.trim() : false;
            const phone = typeof data.payload.phone === "string" && data.payload.phone.trim().length > 0 ? data.payload.phone.trim() : false;
            const email = typeof data.payload.email === "string" && data.payload.email.trim().length > 0 ? data.payload.email.trim().toLowerCase() : false;
            const dir = typeof data.payload.type === "string" && data.payload.type.trim().length > 0 ? data.payload.type.trim() : false;
            const diagnosis = typeof data.payload.diagnosis === "string" && data.payload.diagnosis.trim().length > 0 ? data.payload.diagnosis.trim().toLowerCase() : false;
            const specimen = typeof data.payload.specimen === "object" ? data.payload.specimen : false;
            const tokenID = typeof data.payload.tokenID === "string" && data.payload.tokenID.trim().length > 0 ? data.payload.tokenID.trim() : false;
            const selectedTest = typeof data.payload.selectedTest === "object" ? data.payload.selectedTest : false;
            const result = typeof data.payload.result === "object" ? data.payload.result : false;
            const companyID = typeof data.payload.companyID === "string" && data.payload.companyID.trim().length > 10 ? data.payload.companyID.trim() : false;

            if (firstname && lastname && other && day && month && year && date && account && time && age && sex && religion && tribe && phone && email && dir && source && diagnosis && specimen && tokenID && selectedTest && result && companyID) {
                // Validate token
                validate(tokenID, (err, tokenDetails) => {
                    if (!err && tokenDetails) {
                        // Check Directory
                        file.read(dir + "/" + companyID + "/tests", "unsettled", (err, unsettled) => {
                            console.log(today);
                            if (!err && unsettled) {
                                // Define Data
                                const data = {
                                    firstname: firstname,
                                    lastname: lastname,
                                    other: other,
                                    day: day,
                                    month: month,
                                    year: year,
                                    date: date,
                                    time: time,
                                    age: age,
                                    sex: sex,
                                    religion: religion,
                                    tribe: tribe,
                                    phone: phone,
                                    email: email,
                                    diagnosis: diagnosis,
                                    specimen: specimen,
                                    selectedTest: selectedTest,
                                    result: result,
                                };

                                if (unsettled[today] !== undefined) {
                                    unsettled[today] = [...unsettled[today], data];
                                } else {
                                    unsettled[today] = [];
                                    unsettled[today] = [...unsettled[today], data];
                                }

                                // Update
                                file.update(dir + "/" + companyID + "/tests", "unsettled", unsettled, (err) => {
                                    if (!err) {
                                        // Update Stats
                                        update_stats(dir, companyID, data.selectedTest, (err, stats) => {
                                            if (!err && stats) {
                                                // Update Activity
                                                update_lab_activity(dir, companyID, data, source, (err, lab_activities) => {
                                                    if (!err && lab_activities) {
                                                        // Update User
                                                        update_user_activity(data, dir, companyID, account, source, tokenDetails.email, (err, user_activities, user) => {
                                                            if (!err && user_activities && user) {
                                                                // Update hourly
                                                                update_hourly(dir, companyID, data, (err, hourly) => {
                                                                    if (!err && hourly) {
                                                                        // Update monthly revenue
                                                                        update_revenue(dir, companyID, stats.revenue, (err, revenue) => {
                                                                            if (!err && revenue) {
                                                                                // Update top_5
                                                                                update_test_stat(data, dir, companyID, (err, top_5) => {
                                                                                    if (!err && top_5) {
                                                                                        // Get Storage
                                                                                        file.read(dir + "/" + companyID + "/storage", "storage", (err, storage) => {
                                                                                            if (!err && storage) {
                                                                                                // Update Storage
                                                                                                storage["pending"] += 1;

                                                                                                // Save
                                                                                                file.update(dir + "/" + companyID + "/storage", "storage", storage, (err) => {
                                                                                                    if (!err) {
                                                                                                        // Define Payload
                                                                                                        const _data = {
                                                                                                            message: "success",
                                                                                                            stats: stats,
                                                                                                            top_5: top_5,
                                                                                                            hourly: hourly,
                                                                                                            storage: storage,
                                                                                                            lab_activities: lab_activities,
                                                                                                            revenue: revenue,
                                                                                                            unsettled: unsettled,
                                                                                                        };

                                                                                                        (_data[user] = user_activities),
                                                                                                            // Return
                                                                                                            callback(200, _data, "json");
                                                                                                    } else {
                                                                                                        callback(500, { error: "Something Went Wrong, Please Try Again Later10" }, "json");
                                                                                                    }
                                                                                                });
                                                                                            } else {
                                                                                                callback(500, { error: "Something Went Wrong, Please Try Again Later9" }, "json");
                                                                                            }
                                                                                        });
                                                                                    } else {
                                                                                        callback(500, { error: "Something Went Wrong, Please Try Again Later8" }, "json");
                                                                                    }
                                                                                });
                                                                            } else {
                                                                                callback(500, { error: "Something Went Wrong, Please Try Again Later7" }, "json");
                                                                            }
                                                                        });
                                                                    } else {
                                                                        callback(500, { error: "Something Went Wrong, Please Try Again Later6" }, "json");
                                                                    }
                                                                });
                                                            } else {
                                                                callback(500, { error: "Something Went Wrong, Please Try Again Later5" }, "json");
                                                            }
                                                        });
                                                    } else {
                                                        callback(500, { error: "Something Went Wrong, Please Try Again Later4" }, "json");
                                                    }
                                                });
                                            } else {
                                                callback(500, { error: "Something Went Wrong, Please Try Again Later3" }, "json");
                                            }
                                        });
                                    } else {
                                        callback(500, { error: "Something Went Wrong, Please Try Again Later2" }, "json");
                                    }
                                });
                            } else {
                                callback(500, { error: "Something Went Wrong, Please Try Again Later1" }, "json");
                            }
                        });
                    } else {
                        callback(400, { error: "Invalid Token ID" }, "json");
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

// Fetch Tests
// =================================================================================
test["fetch_tests"] = (data, callback) => {
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
                        // Try Unsettled Reading File
                        file.read(dir + "/" + companyID + "/tests", "unsettled", (err, details_1) => {
                            if (!err && details_1) {
                                // Try settled Reading File
                                file.read(dir + "/" + companyID + "/tests/settled", year, (err, details_2) => {
                                    if (!err && details_2) {
                                        // Return
                                        callback(
                                            200,
                                            {
                                                unsettled: details_1,
                                                settled: details_2,
                                            },
                                            "json"
                                        );
                                    } else {
                                        // Create File
                                        const _data = {};

                                        // Create settled File
                                        file.create(dir + "/" + companyID + "/tests/settled", year, _data, (err) => {
                                            if (!err) {
                                                // Return
                                                callback(
                                                    200,
                                                    {
                                                        unsettled: details_1,
                                                        settled: _data,
                                                    },
                                                    "json"
                                                );
                                            } else {
                                                callback(500, { error: "Something Went Wrong, Please Try Again Later" }, "json");
                                            }
                                        });
                                    }
                                });
                            } else {
                                // Create File
                                const _data = {};

                                // Create unsettled File
                                file.create(dir + "/" + companyID + "/tests", "unsettled", _data, (err) => {
                                    if (!err) {
                                        // Create settled directory
                                        directory.create(dir + "/" + companyID + "/tests/settled", (err) => {
                                            if (!err) {
                                                // Create settled File
                                                file.create(dir + "/" + companyID + "/tests/settled", year, _data, (err) => {
                                                    if (!err) {
                                                        // Return
                                                        callback(
                                                            200,
                                                            {
                                                                unsettled: _data,
                                                                settled: _data,
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

// Result Entry
// =================================================================================
test["enter_result"] = (data, callback) => {
    // Check Method
    switch (data.method) {
        case "options":
            callback(200, {}, "json");
            break;

        case "put":
            // Check that all fields are present
            const date = typeof data.payload.date === "string" ? data.payload.date : false;
            const index = typeof data.payload.position === "string" ? data.payload.position : false;
            const testData = typeof data.payload.testData === "object" ? data.payload.testData : false;
            const tokenID = typeof data.payload.tokenID === "string" && data.payload.tokenID.trim().length > 0 ? data.payload.tokenID.trim() : false;
            const companyID = typeof data.payload.companyID === "string" && data.payload.companyID.trim().length > 10 ? data.payload.companyID.trim() : false;
            const dir = typeof data.payload.type === "string" && data.payload.type.trim().length > 0 ? data.payload.type.trim() : false;

            if (date && testData && tokenID && companyID && dir) {
                // Validate token
                validate(tokenID, (err, tokenDetails) => {
                    if (!err && tokenDetails) {
                        // Check Directory
                        file.read(dir + "/" + companyID + "/tests", "unsettled", (err, testDetails) => {
                            if (!err && testDetails) {
                                // Process
                                for (const category in testData) {
                                    if (testDetails[date][index]["result"][category] !== undefined) {
                                        for (const item in testData[category]) {
                                            testDetails[date][index]["result"][category][item] = testData[category][item];
                                        }
                                    } else {
                                        testDetails[date][index]["result"][category] = testData[category];
                                    }
                                }

                                // Save
                                file.update(dir + "/" + companyID + "/tests", "unsettled", testDetails, (err) => {
                                    if (!err) {
                                        // return
                                        callback(200, testDetails, "json");
                                    } else {
                                        callback(500, { error: "Something Went Wrong, Please Try Again Later" }, "json");
                                    }
                                });
                            } else {
                                callback(500, { error: "Something Went Wrong, Please Try Again Later" }, "json");
                            }
                        });
                    } else {
                        callback(400, { error: "Invalid Token ID" }, "json");
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

// Completed Result Entry
// =================================================================================
test["completed_result"] = (data, callback) => {
    // Check Method
    switch (data.method) {
        case "options":
            callback(200, {}, "json");
            break;

        case "put":
            // Check that all fields are present
            const date = typeof data.payload.date === "string" ? data.payload.date : false;
            const index = typeof data.payload.position === "string" ? data.payload.position : false;
            const tokenID = typeof data.payload.tokenID === "string" && data.payload.tokenID.trim().length > 0 ? data.payload.tokenID.trim() : false;
            const companyID = typeof data.payload.companyID === "string" && data.payload.companyID.trim().length > 10 ? data.payload.companyID.trim() : false;
            const dir = typeof data.payload.type === "string" && data.payload.type.trim().length > 0 ? data.payload.type.trim() : false;

            if (date && index && tokenID && companyID && dir) {
                // Validate token
                validate(tokenID, (err, tokenDetails) => {
                    if (!err && tokenDetails) {
                        // Get TestList
                        file.read(dir + "/" + companyID + "/tests", "unsettled", (err, testDetails) => {
                            if (!err && testDetails) {
                                // Get REsults
                                file.read(dir + "/" + companyID + "/tests/settled", year, (err, resultDetails) => {
                                    if (!err && resultDetails) {
                                        // Get target from unsettled
                                        const old = testDetails[date][index];

                                        // Remove target from unsettled
                                        testDetails[date] = testDetails[date].filter((item) => item !== testDetails[date][index]);

                                        // Add target to results
                                        if (resultDetails[date] !== undefined) {
                                            resultDetails[date] = [old, ...resultDetails[date]];
                                        } else {
                                            resultDetails[date] = [old];
                                        }

                                        if (testDetails[date].length < 1) {
                                            delete testDetails[date];
                                        }

                                        // Save Test
                                        file.update(dir + "/" + companyID + "/tests", "unsettled", testDetails, (err) => {
                                            if (!err) {
                                                // Save Completed
                                                file.update(dir + "/" + companyID + "/tests/settled", year, resultDetails, (err) => {
                                                    if (!err) {
                                                        // Get Storage
                                                        file.read(dir + "/" + companyID + "/storage", "storage", (err, storage) => {
                                                            if (!err && storage) {
                                                                // Update Storage
                                                                storage["pending"] -= 1;
                                                                storage["completed"] += 1;

                                                                // Save
                                                                file.update(dir + "/" + companyID + "/storage", "storage", storage, (err) => {
                                                                    if (!err) {
                                                                        // Payload
                                                                        const _data = {
                                                                            tests: {
                                                                                settled: resultDetails,
                                                                                unsettled: testDetails,
                                                                            },
                                                                            storage: storage,
                                                                        };
                                                                        // Return
                                                                        callback(200, _data, "json");
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
                        callback(400, { error: "Invalid Token ID" }, "json");
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

// Delete Test Directory
// =================================================================================
test["delete_test_directory"] = (dir, ID, callback) => {
    // Validate
    const type = typeof dir === "string" && dir.length > 5 ? dir : false;
    const companyID = typeof ID === "string" && ID.length > 5 ? ID : false;

    if (type && companyID) {
        directory.delete(type + "/" + companyID + "/tests", (err) => {
            if (!err) {
                // Return
                callback(false);
            } else {
                callback(true);
            }
        });
    } else {
        callback(true);
    }
};

// Export Module
module.exports = test;
