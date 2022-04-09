// Import Dependencies
const url = require("url");
const https = require("https");
const http = require("http");
const fs = require("fs");
const stringDecoder = require("string_decoder").StringDecoder;
const configuration = require("./config");
const handlers = require("./lib/admin/main");
const helpers = require("./lib/helper");
const company = require("./lib/company/main");

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
    "": handlers.index,
    "account/signUp": handlers.signUp,
    "account/login": handlers.Login,
    "account/update": handlers.update,
    "account/deactivate": handlers.delete,
    "company/create": company.create,
};
