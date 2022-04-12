// Default Container
const create_tests = require("./create");
const fetch_tests = require("./fetch");
const book_tests = require("./booking");
const test_result = require("./result");
const delete_tests = require("./delete");

// ==============================
const tests_Directory = {};

// Create tests
tests_Directory["create"] = create_tests;

// fetch tests
tests_Directory["fetch"] = fetch_tests;

// book tests
tests_Directory["book"] = book_tests;

// tests result
tests_Directory["results"] = test_result;

// delete tests
tests_Directory["delete"] = delete_tests;

// Export
module.exports = tests_Directory;
