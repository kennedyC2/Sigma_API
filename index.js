// APP
// =======================================================

// Import Dependencies
// =======================================================
const { SERVER_init } = require("./lib/server");
const { CLI_init } = require("./lib/cli");

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
    }, 1000);
};

// Kick
app.init();
