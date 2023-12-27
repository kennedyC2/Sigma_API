// Handler for Tests
// =====================================================================

// Import Dependencies
// =================================================================================
const file = require("./file");
const { validate } = require("./token");
const { today, year, date, hour } = require("./helper");
const { client, database, ObjectId } = require("./mongo");

// Container
// =================================================================================
const test = {};

// Book A Test
// =================================================================================
test["Book_A_Test"] = async (data, callback) => {
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
            const date2 = typeof data.payload.date === "string" && data.payload.date.trim().length > 0 ? data.payload.date.trim() : false;
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
            const total = typeof data.payload.total === "number" && data.payload.total > 0 ? data.payload.total : false;
            const paid = typeof data.payload.paid === "string" && data.payload.paid.trim().length > 0 ? data.payload.paid.trim() : false;
            const id = typeof data.payload.id === "string" && data.payload.id.trim().length > 0 ? data.payload.id.trim() : false;
            const selectedTest = typeof data.payload.selectedTest === "object" ? data.payload.selectedTest : false;
            const result = typeof data.payload.result === "object" ? data.payload.result : false;
            const companyID = typeof data.payload.companyID === "string" && data.payload.companyID.trim().length > 10 ? data.payload.companyID.trim() : false;

            // console.log(firstname, lastname, total, paid, id, other, day, month, year, date, account, time, age, sex, religion, tribe, phone, email, dir, source, diagnosis, specimen, selectedTest, result, companyID)

            if (firstname && lastname && total && paid && id && other && day && month && year && date2 && account && time && age && sex && religion && tribe && phone && email && dir && source && diagnosis && specimen && selectedTest && result && companyID) {
                // Connect to database
                try {
                    const directory = client.db(database);
                    const tDir = directory.collection("Tests");
                    const cDir = directory.collection(dir);
                    const data_2 = await cDir.aggregate([
                        {
                            $match: { cid: companyID }
                        },
                        {
                            $lookup: {
                                from: "Tests",
                                localField: "unsettled",
                                foreignField: "_id",
                                as: "pending"
                            }
                        }
                    ]).toArray()

                    // Check if user exist
                    if (data_2[0] !== null || data_2[0] !== undefined) {
                        // Define Data
                        const data_1 = {
                            _id: new ObjectId(Date.now()),
                            firstname: firstname,
                            lastname: lastname,
                            other: other,
                            day: day,
                            month: month,
                            year: year,
                            date: date2,
                            time: time,
                            age: age,
                            sex: sex,
                            religion: religion,
                            tribe: tribe,
                            phone: phone,
                            email: email,
                            id: id,
                            paid: paid,
                            balance: total - parseInt(paid),
                            total: total,
                            diagnosis: diagnosis,
                            specimen: specimen,
                            selectedTest: selectedTest,
                            result: result,
                        };

                        const _data = {
                            firstname: firstname,
                            lastname: lastname,
                            other: other,
                            type: account,
                            date: date2,
                            time: time,
                        };

                        // Check Position
                        const position = account !== "administrator" && parseInt(data.payload.position) > -1 ? parseInt(data.payload.position) : false;

                        // Update Stats
                        data_2[0].stats.test += 1;
                        console.log(paid)
                        data_2[0].stats.revenue += parseInt(paid);
                        data_2[0].stats.total += parseInt(total);

                        // Update Activity 
                        if (data_2[0].lab_activities.length >= 5) {
                            data_2[0].lab_activities.pop();
                            data_2[0].lab_activities.unshift(_data);
                        } else {
                            data_2[0].lab_activities.unshift(_data);
                        }

                        // Update User
                        if (position) {
                            if (data_2[0].users[position]["recent"].length >= 5) {
                                data_2[0].users[position]["recent"].pop();
                                data_2[0].users[position]["recent"].unshift(_data);
                            } else {
                                data_2[0].users[position]["recent"].unshift(_data);
                            }
                        }

                        // Update hourly
                        const newArr = selectedTest.map((cost) => parseInt(cost.split(":").pop()))

                        // Sort
                        if (parseInt(hour.split(":")[0]) <= 8 && hour.split(":")[1] === "am") {
                            data_2[0].hourly["amount"][0] += newArr.reduce((total, num) => total + num);
                        }

                        if (parseInt(hour.split(":")[0]) > 8 && parseInt(hour.split(":")[0]) <= 10 && hour.split(":")[1] === "am") {
                            data_2[0].hourly["amount"][1] += newArr.reduce((total, num) => total + num);
                        }

                        if (parseInt(hour.split(":")[0]) > 10 && parseInt(hour.split(":")[0]) <= 12 && hour.split(":")[1] === "pm") {
                            data_2[0].hourly["amount"][2] += newArr.reduce((total, num) => total + num);
                        }

                        if (parseInt(hour.split(":")[0]) > 0 && parseInt(hour.split(":")[0]) <= 2 && hour.split(":")[1] === "pm") {
                            data_2[0].hourly["amount"][3] += newArr.reduce((total, num) => total + num);
                        }

                        if (parseInt(hour.split(":")[0]) > 2 && parseInt(hour.split(":")[0]) <= 4 && hour.split(":")[1] === "pm") {
                            data_2[0].hourly["amount"][4] += newArr.reduce((total, num) => total + num);
                        }

                        if (parseInt(hour.split(":")[0]) > 4 && parseInt(hour.split(":")[0]) <= 6 && hour.split(":")[1] === "pm") {
                            data_2[0].hourly["amount"][5] += newArr.reduce((total, num) => total + num);
                        }

                        if (parseInt(hour.split(":")[0]) > 6 && parseInt(hour.split(":")[0]) <= 8 && hour.split(":")[1] === "pm") {
                            data_2[0].hourly["amount"][6] += newArr.reduce((total, num) => total + num);
                        }

                        if (parseInt(hour.split(":")[0]) > 8 && parseInt(hour.split(":")[0]) <= 10 && hour.split(":")[1] === "pm") {
                            data_2[0].hourly["amount"][7] += newArr.reduce((total, num) => total + num);
                        }

                        data_2[0].hourly["total"] += newArr.reduce((total, num) => total + num);

                        // Update monthly revenue
                        data_2[0].revenue.amount[date - 1] = parseInt(data_2[0].stats.revenue);
                        data_2[0].revenue.total = parseInt(data_2[0].stats.revenue);

                        // Update top_5
                        for (const item of selectedTest) {
                            data_2[0].top_5["tests"][item.split(":")[2].trim().replaceAll(" ", "_").toLowerCase()] += 1;
                        }

                        // Update Storage
                        data_2[0].storage["pending"] += 1;

                        // Update unsettled
                        data_2[0].unsettled = [data_1._id, ...data_2[0].unsettled];

                        // Update Tests
                        await tDir.insertOne(data_1);

                        // Copy Pending
                        const cPending = data_2[0].pending

                        // Overwrite Pending
                        data_2[0].pending = []

                        // Update PID
                        data_2[0].pid += 1

                        // Update Company data_2[0].hourly
                        await cDir.replaceOne({ cid: companyID }, { ...data_2[0] }, { upsert: true });

                        // Delete Password
                        delete data_2[0]._id;

                        // Add new test
                        data_2[0].pending = [data_1, ...cPending]

                        console.log(data_2[0])

                        // Return
                        callback(
                            200, data_2[0],
                            "json"
                        );
                    } else {
                        // Return
                        callback(400, { message: "Specified Company Does Not Exist" }, "json");
                    }
                } catch (error) {
                    console.log(error);
                    // Return
                    callback(502, { message: "Oops, Something Went Wrong, Try Again Later" }, "json");
                } finally {
                    client.close;
                }
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
            const amount = typeof data.payload.amount === "string" ? data.payload.amount : false;
            const tokenID = typeof data.payload.tokenID === "string" && data.payload.tokenID.trim().length > 0 ? data.payload.tokenID.trim() : false;
            const companyID = typeof data.payload.companyID === "string" && data.payload.companyID.trim().length > 10 ? data.payload.companyID.trim() : false;
            const dir = typeof data.payload.type === "string" && data.payload.type.trim().length > 0 ? data.payload.type.trim() : false;

            if (date && index && amount && tokenID && companyID && dir) {
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
                                        delete testDetails[date][index];

                                        // Add target to results
                                        if (resultDetails[date] !== undefined) {
                                            resultDetails[date] = { [index]: old, ...resultDetails[date] };
                                        } else {
                                            resultDetails[date] = { [index]: old };
                                        }

                                        if (Object.keys(testDetails[date]).length < 1) {
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
                                                                        file.read(dir + "/" + companyID + "/stats", today, (err, details) => {
                                                                            if (!err && details) {
                                                                                // Update Stats
                                                                                details.revenue += parseInt(amount);

                                                                                // Save
                                                                                file.update(dir + "/" + companyID + "/stats", today, details, (err) => {
                                                                                    if (!err) {
                                                                                        // Payload
                                                                                        const _data = {
                                                                                            tests: {
                                                                                                settled: resultDetails,
                                                                                                unsettled: testDetails,
                                                                                            },
                                                                                            storage: storage,
                                                                                            stats: details,
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


// Export Module
module.exports = test;
