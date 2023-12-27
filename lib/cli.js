// Dependencies
// ==========================================================================
var readline = require("readline");
var os = require("os");
var v8 = require("v8");
var events = require("events");
class _events extends events { }
var e = new _events();
var file = require("./file");

// Container for Cli
// =================================================================================
var cli = {};

// Initiate script
// =================================================================================
cli["CLI_init"] = () => {
    // prompt start up
    console.log("CLI has started running");

    // Create interface
    var interface = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: "",
    });

    // create an initial prompt
    interface.prompt();

    // Handle each line input separately
    interface.on("line", (str) => {
        // send input to processor
        cli.processInput(str);

        // bring back prompt after processing
        interface.prompt();
    });

    // kill cli if user issues a stop
    interface.on("close", () => {
        process.exit(0);
    });
};

// Input processor
// =======================================================================================
cli["processInput"] = (str) => {
    str = typeof str == "string" && str.trim().length > 0 ? str.trim() : false;
    if (str) {
        // streamline user input
        var userInput = ["stats", "list users", "user info", "help", "exit"];

        // loop thru userInput to find match
        var matchFound = false;
        userInput.forEach((input) => {
            if (str.toLowerCase().indexOf(input) > -1) {
                matchFound = true;
                e.emit(input, str);
                return true;
            }
        });

        if (!matchFound) {
            console.log("Not found");
        }
    }
};

// input Handlers
// ==============================================================================================
e.on("stats", () => {
    cli.responder.stats();
});

e.on("list users", () => {
    cli.responder.listUsers();
});

e.on("user info", (str) => {
    cli.responder.UserInfo(str);
});

e.on("help", () => {
    cli.responder.help();
});

e.on("exit", () => {
    cli.responder.exit();
});
// cli responders
// ====================================================================================
cli["responder"] = {};

// help responder
cli["responder"]["help"] = () => {
    var commands = {
        stats: "Get statistics on underlying operating system and resource utilization",
        "list users": "Show list of all registered users in the system",
        "user info --{userId}": "Show details of a specified user",
    };

    cli.horizontalLine();
    cli.centered("CLI MANUAL");
    cli.horizontalLine();
    cli.verticalSpace(2);

    // loop thru each command
    for (const d in commands) {
        var line = "           ";
        line += d + ":";
        var padding = 65 - line.length;
        for (var i = 0; i < padding; i++) {
            line += " ";
        }

        line += commands[d];
        console.log(line);
        cli.verticalSpace(2);
    }

    cli.verticalSpace(1);

    // End with horizontal line
    cli.horizontalLine();
};

// exit responder
cli["responder"]["exit"] = () => {
    process.exit(0);
};

// stats responder
cli["responder"]["stats"] = () => {
    var stats = {
        "load Average": os.loadavg().join(" "),
        "CPU Count": os.cpus().length,
        "Free memory": os.freemem(),
        "Current Malloced Memory": v8.getHeapStatistics().malloced_memory,
        "Peak Malloced Memory": v8.getHeapStatistics().peak_malloced_memory,
        "Allocated Heap Used (%)": Math.round((v8.getHeapStatistics().used_heap_size / v8.getHeapStatistics().total_heap_size) * 100),
        "Available Heap Allocated (%)": Math.round((v8.getHeapStatistics().total_heap_size / v8.getHeapStatistics().heap_size_limit) * 100),
        Uptime: os.uptime() + " Seconds",
    };

    cli.horizontalLine();
    cli.centered("SYSTEM STATISTICS");
    cli.horizontalLine();
    cli.verticalSpace(2);

    // loop thru each command
    for (const d in stats) {
        var line = "           ";
        line += d + ":";
        var padding = 65 - line.length;
        for (var i = 0; i < padding; i++) {
            line += " ";
        }

        line += stats[d];
        console.log(line);
        cli.verticalSpace(2);
    }

    cli.verticalSpace(1);

    // End with horizontal line
    cli.horizontalLine();
};

// more user info responder
cli["responder"]["UserInfo"] = (str) => {
    var arr = str.split("--");
    var userId = typeof arr[1] == "string" && arr[1].trim().length > 0 ? arr[1].trim() : false;
    if (userId) {
        file.read("accounts/admin", userId, (err, userData) => {
            if (!err && userData) {
                cli.verticalSpace();
                delete userData.password;
                console.log(userData, { colors: true });
            } else {
                console.log(err);
            }
        });
    }
};

// Space/Line handlers
// ========================================================================================

// Vertical Space
cli["verticalSpace"] = (lines) => {
    line = typeof lines == "number" && lines > 0 ? lines : 1;
    for (var i = 0; i < line; i++) {
        console.log(" ");
    }
};

// Horizontal line
cli["horizontalLine"] = () => {
    // Get the available screen size
    var width = process.stdout.columns;

    // put in enough dashes to go across the screen
    var line = "";
    for (var i = 0; i < width; i++) {
        line += "-";
    }

    console.log(line);
};

// Center text
cli["centered"] = (str) => {
    str = typeof str == "string" && str.trim().length > 0 ? str.trim() : " ";

    // Get available screen width
    var width = process.stdout.columns;

    //calculate padding needed
    var leftPadding = Math.floor((width - str.length) / 2);

    // put left padding before str
    var line = "";
    for (var i = 0; i < leftPadding; i++) {
        line += " ";
    }

    line += str;
    console.log(line);
};

//  Export module
// ======================================================================================
module.exports = cli;
