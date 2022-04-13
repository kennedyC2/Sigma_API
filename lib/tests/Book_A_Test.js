// Book A Test
// ==============================================================================================

// Dependencies
const file = require("../file");
const folder = require("../dir");
const lab_activities = require("../lab_activities/main");
const user = require("../users/main");
const hourly = require("../hourly/main");
const top_5 = require("../top_5/main");
const token = require("../token/main");
const helper = require("../helper");

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
            const phone = typeof data.payload.phone === "string" && data.payload.phone.trim().length > 0 ? data.payload.phone.trim() : false;
            const email = typeof data.payload.email === "string" && data.payload.email.trim().length > 0 ? data.payload.email.trim().toLowerCase() : false;
            const dir = typeof data.payload.type === "string" && data.payload.type.trim().length > 0 ? data.payload.type.trim() : false;
            const diagnosis = typeof data.payload.diagnosis === "string" && data.payload.diagnosis.trim().length > 0 ? data.payload.diagnosis.trim().toLowerCase() : false;
            const specimen = typeof data.payload.specimen === "object" ? data.payload.specimen.trim().toLowerCase() : false;
            const tokenID = typeof data.payload.tokenID === "string" && data.payload.tokenID.trim().length > 0 ? data.payload.tokenID.trim() : false;
            const selectedTest = typeof data.payload.selectedTest === "object" ? data.payload.selectedTest.trim().toLowerCase() : false;
            const result = typeof data.payload.result === "object" ? data.payload.result : false;
            const companyID = typeof data.query.companyID === "string" && data.query.companyID.trim().length > 10 ? data.query.companyID.trim() : false;

            if (firstname && lastname && other && day && month && year && date && time && age && sex && religion && tribe && phone && email && dir && diagnosis && specimen && tokenID && selectedTest && result && companyID) {
                // Validate token
                token.validate(tokenID, (err, tokenDetails) => {
                    if (!err && tokenDetails) {
                        // ============================================
                        const month = helper.month();
                        const today = helper.today();

                        // Check Directory
                        folder.read(dir + "/" + companyID + "/tests/" + month, (err) => {
                            if (!err) {
                                //
                            } else {
                                folder.create(dir + "/" + companyID + "/tests/" + month, (err) => {
                                    if (!err) {
                                        const unsettled = {};

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

                                        unsettled[today] = [];
                                        unsettled[today] = [...unsettled[today], data];

                                        // Save
                                        file.create(dir + "/" + companyID + "/tests", "unsettled", unsettled, (err) => {
                                            if (!err) {
                                                // Get Stats
                                                file.read(dir + "/" + companyID + "/stats/", today, (err, stats) => {
                                                    if (!err && stats) {
                                                        // Update Stats
                                                        stats.test += 1;
                                                        stats.revenue += parseInt(data.selectedTest.map((cost) => cost.split(":").pop()));

                                                        // Save
                                                        file.update(dir + "/" + companyID + "/stats/", today, stats, (err) => {
                                                            if (!err) {
                                                                // Update Activity
                                                                lab_activities.update(dir, companyID, data, tokenDetails.email, (err) => {
                                                                    if (!err) {
                                                                        // Update User
                                                                        user.update_activity(data, dir, companyID, tokenDetails.email, (err) => {
                                                                            if (!err) {
                                                                                // Update hourly
                                                                                hourly.update(dir, companyID, data, (err) => {
                                                                                    if (!err) {
                                                                                        // Update top_5
                                                                                        top_5.stat(data, dir, companyID, (err) => {
                                                                                            if (!err) {
                                                                                                // Get Storage
                                                                                                file.read(dir + "/" + companyID + "/storage", "storage", (err, storage) => {
                                                                                                    if (!err && storage) {
                                                                                                        // Update Storage
                                                                                                        storage["pending"] += 1;

                                                                                                        // Save
                                                                                                        file.update(dir + "/" + companyID + "/storage", "storage", storage, (err) => {
                                                                                                            if (!err) {
                                                                                                                // Return
                                                                                                                callback(200, {});
                                                                                                            } else {
                                                                                                                callback(500, { Error: "Something Happened, Please Try Again Later" });
                                                                                                            }
                                                                                                        });
                                                                                                    } else {
                                                                                                        callback(500, { Error: "Something Happened, Please Try Again Later" });
                                                                                                    }
                                                                                                });
                                                                                            } else {
                                                                                                callback(500, { Error: "Something Happened, Please Try Again Later" });
                                                                                            }
                                                                                        });
                                                                                    } else {
                                                                                        callback(500, { Error: "Something Happened, Please Try Again Later" });
                                                                                    }
                                                                                });
                                                                            } else {
                                                                                callback(500, { Error: "Something Happened, Please Try Again Later" });
                                                                            }
                                                                        });
                                                                    } else {
                                                                        callback(500, { Error: "Something Happened, Please Try Again Later" });
                                                                    }
                                                                });
                                                            } else {
                                                                callback(500, { Error: "Something Happened, Please Try Again Later" });
                                                            }
                                                        });
                                                    } else {
                                                        callback(500, { Error: "Something Happened, Please Try Again Later" });
                                                    }
                                                });
                                            } else {
                                                callback(500, { Error: "Something Happened, Please Try Again Later" });
                                            }
                                        });
                                    } else {
                                        callback(500, { Error: "Something Happened, Please Try Again Later" });
                                    }
                                });
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
