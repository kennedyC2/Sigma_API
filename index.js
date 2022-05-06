// Import Dependencies
const url = require("url");
const https = require("https");
const http = require("http");
const fs = require("fs");
const stringDecoder = require("string_decoder").StringDecoder;
const configuration = require("./config");
const { signUp, Login, fetch, update, _delete } = require("./lib/admin/main");
const helpers = require("./lib/helper");
const { create_company, fetch_company } = require("./lib/company/main");
const { fetch_hourly } = require("./lib/hourly/main");
const { fetch_lab_activity, fetch_admin_activity } = require("./lib/lab_activities/main");
const { fetch_revenue } = require("./lib/revenue/main");
const { fetch_services, update_services } = require("./lib/services/main");
const { fetch_testKits, add_testKit } = require("./lib/testKit/main");
const { fetch_tests, book_test, enter_test_results, complete_test_results } = require("./lib/tests/main");
const { fetch_top_5 } = require("./lib/top_5/main");
const { fetch_user_account, create_user_account } = require("./lib/users/main");
const { fetch_stats } = require("./lib/stats/main");
const { fetch_storage } = require("./lib/storage/main");

// Server Options
const serverOptions = {
    key: fs.readFileSync("./https/key.pem"),
    cert: fs.readFileSync("./https/cert.pem"),
};

// https Server
const HTTPSserver = https.createServer(serverOptions, (req, res) => {
    server(req, res);
});

// https Server
const HTTPserver = http.createServer((req, res) => {
    server(req, res);
});

// Server
const server = (req, res) => {
    // Get URL
    const parsedUrl = url.parse(req.url, true);

    // Get Url Path
    const path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, "");

    // Get Header
    const headers = req.headers;

    // Get Method
    const method = req.method.toLowerCase();

    // Get Query Strings
    const queryStringObject = parsedUrl.query;

    // Get Payload
    const decoder = new stringDecoder("utf8");
    let buffer = "";
    req.on("data", (data) => {
        buffer += decoder.write(data);
    });

    req.on("end", () => {
        // End Buffer
        buffer += decoder.end();

        // Check Request Handler
        const chosenHandler = router[trimmedPath] !== undefined ? router[trimmedPath] : handlers.notFound;

        // Define Data
        const data = {
            path: trimmedPath,
            header: headers,
            method: method,
            query: queryStringObject,
            payload: helpers.parseJSONObject(buffer),
        };

        // Route Request to Chosen Handler
        chosenHandler(data, (Code, Message) => {
            // Define Status Code to be sent
            const statusCode = typeof Code === "number" ? Code : 200;

            // Define Message to be sent
            const message = typeof Message === "object" ? JSON.stringify(Message) : {};

            // Return Response
            res.setHeader("Content-Type", "application/json");
            res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
            res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,POST,PUT,DELETE");
            res.setHeader("Access-Control-Allow-Headers", "Content-Type");
            res.writeHead(statusCode);
            res.end(message);
        });
    });
};

// Listen
HTTPserver.listen(configuration.HTTP_port, () => {
    console.log("HTTP Server is Listening On Port " + configuration.HTTP_port + " in " + configuration.mode + " mode");
});

HTTPSserver.listen(configuration.HTTPS_port, () => {
    console.log("HTTPS Server is Listening On Port " + configuration.HTTPS_port + " in " + configuration.mode + " mode");
});

// Define Routers
const router = {
    "account/signUp": signUp,
    "account/login": Login,
    "account/profile": fetch,
    "account/update": update,
    "account/deactivate": _delete,
    "laboratory/create": create_company,
    "laboratory/profile": fetch_company,
    "laboratory/hourly": fetch_hourly,
    "laboratory/lab_activities": fetch_lab_activity,
    "laboratory/admin_activities": fetch_admin_activity,
    "laboratory/revenue": fetch_revenue,
    "laboratory/services": fetch_services,
    "laboratory/stats": fetch_stats,
    "laboratory/storage": fetch_storage,
    "laboratory/testKits": fetch_testKits,
    "laboratory/tests": fetch_tests,
    "laboratory/top_5": fetch_top_5,
    "laboratory/users": fetch_user_account,
    "laboratory/update/services": update_services,
    "laboratory/tests/booking": book_test,
    "laboratory/tests/pending": enter_test_results,
    "laboratory/tests/completed": complete_test_results,
    "laboratory/testKits/add": add_testKit,
    "laboratory/users/create": create_user_account,
};
