// Default Container
const create_tests = require("./create_directory");
const fetch_tests = require("./fetch_tests");
const book_tests = require("./Book_A_Test");
const test_result = require("./enter_results");
const move_result = require("./completed_result_entry");
const delete_tests = require("./delete_directory");

// ==============================
const tests_Directory = {};

// Create tests
tests_Directory["create"] = create_tests;

// fetch tests
tests_Directory["fetch"] = fetch_tests;

// book tests
tests_Directory["book"] = book_tests;

// tests result
tests_Directory["enter_results"] = test_result;

// tests result
tests_Directory["complete_results"] = move_result;

// delete tests
tests_Directory["delete"] = delete_tests;

// Export
module.exports = tests_Directory;
