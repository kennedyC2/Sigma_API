// APP
// =======================================================

// Import Dependencies
// =======================================================
const os = require("os");
const cluster = require("cluster");
const { SERVER_init } = require("./lib/server");
const { CLI_init } = require("./lib/cli");
const { delete_token } = require("./lib/worker");

// Declare APP
// =======================================================
const app = {};

// initialize App
app["init"] = () => {
    // Get Number Of CPU
    const numCPU = os.cpus().length;
    console.log("Setting Up " + numCPU + " Workers");

    if (cluster.isPrimary) {
        // Check for already running workers
        if (Object.keys(cluster.workers).length > 0) {
            // Store Previous Worker ID
            const workersID = [];

            // Timeout
            let timeout;

            // loop
            for (const prop of Object.keys(cluster.workers)) {
                workersID.push(prop);
            }

            // Shutdown workers
            workersID.forEach((id) => {
                cluster.workers[id].send("shutdown");
                cluster.workers[id].disconnect();

                // Check After 2sec
                timeout = setTimeout(() => {
                    if (cluster.workers[id]) {
                        cluster.workers[id].kill();
                    }
                }, 2000);
            });

            // Clear Timeout
            cluster.workers[id].on("disconnect", () => {
                clearTimeout(timeout);
            });
        }

        // FORK
        for (var i = 0; i < numCPU; i++) {
            cluster.fork();
        }

        // Notify
        cluster.on("online", (worker) => {
            console.log("Worker " + worker.process.pid + " is online");
        });

        // Restart Dead Worker
        cluster.on("exit", (worker, code, signal) => {
            if (code !== 0) {
                console.log("Worker " + worker.process.pid + " exited with code error: " + code + ", and signal: " + signal);
                cluster.fork();
            }
        });

        // Initialize CLI
        CLI_init();

        setInterval(() => {
            // Token
            delete_token();
        }, 1000 * 60 * 60);
    }

    if (cluster.isWorker) {
        // Initialize Server
        SERVER_init();
    }
};

// Kick
app.init();
