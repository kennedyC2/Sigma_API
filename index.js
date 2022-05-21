// APP
// =======================================================

// Import Dependencies
// =======================================================
const { SERVER_init } = require("./lib/server");
const { CLI_init } = require("./lib/cli");
const { delete_token } = require("./lib/worker");
const { hour } = require("./lib/helper");

// Declare APP
// =======================================================
const app = {};

// initialize App
app["init"] = () => {
    // Initialize Server
    SERVER_init();

    setTimeout(() => {
        // Initialize CLI
        CLI_init();

        // Token
        delete_token();
    }, 1000);

    setInterval(() => {
        // Token
        if (parseInt(hour) === 22) {
            delete_token();
        }
    }, 1000 * 60 * 60);
};

// Kick
app.init();
