// Book A Test
// ==============================================================================================

// Dependencies
const file = require("../file");
const { update_lab_activity } = require("../lab_activities/main");
const { update_user_activity } = require("../users/main");
const { update_hourly } = require("../hourly/main");
const { update_top_5_stats } = require("../top_5/main");
const { validate } = require("../token/main");
const { today } = require("../helper");

// Component
const Book_A_Test = (data, callback) => {
    // Check Method
    switch (data.method) {
        case "options":
            callback(200, {});
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

                                if (unsettled[today()] !== undefined) {
                                    unsettled[today()] = [...unsettled[today()], data];
                                } else {
                                    unsettled[today()] = [];
                                    unsettled[today()] = [...unsettled[today()], data];
                                }

                                // Update
                                file.update(dir + "/" + companyID + "/tests", "unsettled", unsettled, (err) => {
                                    if (!err) {
                                        // Get Stats
                                        file.read(dir + "/" + companyID + "/stats/", today(), (err, stats) => {
                                            if (!err && stats) {
                                                // Update Stats
                                                stats.test += 1;
                                                stats.revenue += parseInt(data.selectedTest.map((cost) => cost.split(":").pop()));

                                                // Save
                                                file.update(dir + "/" + companyID + "/stats/", today(), stats, (err) => {
                                                    if (!err) {
                                                        // Update Activity
                                                        update_lab_activity(dir, companyID, data, source, (err, lab_activities) => {
                                                            if (!err && lab_activities) {
                                                                // Update User
                                                                update_user_activity(data, dir, companyID, account, source, tokenDetails.email, (err, user_activities, user) => {
                                                                    if (!err && user_activities && user) {
                                                                        // Update hourly
                                                                        update_hourly(dir, companyID, data, (err, hourly) => {
                                                                            if (!err && hourly) {
                                                                                // Update top_5
                                                                                update_top_5_stats(data, dir, companyID, (err, top_5) => {
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
                                                                                                            stats: stats,
                                                                                                            top_5: top_5,
                                                                                                            hourly: hourly,
                                                                                                            storage: storage,
                                                                                                            lab_activities: lab_activities,
                                                                                                            unsettled: unsettled,
                                                                                                        };

                                                                                                        (_data[user] = user_activities),
                                                                                                            // Return
                                                                                                            callback(200, _data);
                                                                                                    } else {
                                                                                                        callback(500, { Error: "Something Happened, Please Try Again Later 10" });
                                                                                                    }
                                                                                                });
                                                                                            } else {
                                                                                                callback(500, { Error: "Something Happened, Please Try Again Later 9" });
                                                                                            }
                                                                                        });
                                                                                    } else {
                                                                                        callback(500, { Error: "Something Happened, Please Try Again Later 8" });
                                                                                    }
                                                                                });
                                                                            } else {
                                                                                callback(500, { Error: "Something Happened, Please Try Again Later 7" });
                                                                            }
                                                                        });
                                                                    } else {
                                                                        callback(500, { Error: "Something Happened, Please Try Again Later 6" });
                                                                    }
                                                                });
                                                            } else {
                                                                callback(500, { Error: "Something Happened, Please Try Again Later 5" });
                                                            }
                                                        });
                                                    } else {
                                                        callback(500, { Error: "Something Happened, Please Try Again Later 4" });
                                                    }
                                                });
                                            } else {
                                                callback(500, { Error: "Something Happened, Please Try Again Later 3" });
                                            }
                                        });
                                    } else {
                                        callback(500, { Error: "Something Happened, Please Try Again Later 2" });
                                    }
                                });
                            } else {
                                callback(500, { Error: "Something Happened, Please Try Again Later 1" });
                            }
                        });
                    } else {
                        callback(400, { Error: "Invalid Token ID" });
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
module.exports = Book_A_Test;
