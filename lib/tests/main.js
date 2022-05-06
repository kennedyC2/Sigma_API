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
tests_Directory["create_test_directory"] = create_tests;

// fetch tests
tests_Directory["fetch_tests"] = fetch_tests;

// book tests
tests_Directory["book_test"] = book_tests;

// tests result
tests_Directory["enter_test_results"] = test_result;

// tests result
tests_Directory["complete_test_results"] = move_result;

// delete tests
tests_Directory["delete_test_directory"] = delete_tests;

// Export
module.exports = tests_Directory;
