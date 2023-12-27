// Import Dependencies
// =======================================================
const url = require("url");
const https = require("https");
const http = require("http");
const fs = require("fs");
const stringDecoder = require("string_decoder").StringDecoder;
const configuration = require("./config");
const { getImages, ping, notFound } = require("./misc");
const { user, code } = require("./verifyUser");
const authentication = require("./auth");
const upload_images = require("./picture");
const { create_account, fetch_account, update_account, delete_account } = require("./admin");
const { parseJSONObject } = require("./helper");
const { create_company, fetch_company, update_company } = require("./company");
const { delete_services, update_services } = require("./services");
const { fetch_tests, Book_A_Test, enter_result, completed_result } = require("./test");
const { delete_user, create_user } = require("./user");
const { update_token } = require("./token");

// Container
// =======================================================
const server = {};

// Server Options
// =======================================================
server["serverOptions"] = {
    key: fs.readFileSync("./https/key.pem"),
    cert: fs.readFileSync("./https/cert.pem"),
};

// https Server
// =======================================================
server["HTTPSserver"] = https.createServer(server.serverOptions, (req, res) => {
    server.unifiedServer(req, res);
});

// https Server
// =======================================================
server["HTTPserver"] = http.createServer((req, res) => {
    server.unifiedServer(req, res);
});

// Server
// =======================================================
server["unifiedServer"] = (req, res) => {
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
        let chosenHandler = server.router[trimmedPath] !== undefined ? server.router[trimmedPath] : notFound;

        // if request is image, route to image handler
        chosenHandler = trimmedPath.indexOf("image/") > -1 ? getImages : chosenHandler;

        // Define Data
        const data = {
            path: trimmedPath,
            header: headers,
            method: method,
            query: queryStringObject,
            payload: parseJSONObject(buffer),
        };

        // Route Request to Chosen Handler
        chosenHandler(data, (Code, Message, Type) => {
            // Handle Error
            try {
                server.handler(res, Code, Message, Type);
            } catch (error) {
                console.warn();
                server.handler(
                    res,
                    500,
                    {
                        error: "Something Went Wrong, Please Try Again Later",
                    },
                    "json"
                );
            }
        });
    });
};

// Server Handler
// =======================================================
server["handler"] = (res, Code, Message, Type) => {
    // Define Status Code to be sent
    const statusCode = typeof Code === "number" ? Code : 200;

    // Specify Content-Type
    const ContentType = typeof Type === "string" ? Type : "json";

    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
    // res.setHeader("Access-Control-Allow-Origin", "https://medsoph.com");
    res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,POST,PUT,DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (ContentType === "json") {
        // Define Message to be sent
        const message = typeof Message === "object" ? JSON.stringify(Message) : {};

        // Return Response
        res.setHeader("Content-Type", "application/json");
        res.writeHead(statusCode);
        res.end(message);
    }

    if (ContentType === "jpg") {
        // Define Message to be sent
        const message = typeof Message !== "undefined" ? Message : {};

        // Return Response
        res.setHeader("Content-Type", "image/jpeg");
        res.writeHead(statusCode);
        res.end(message);
    }

    if (ContentType === "png") {
        // Define Message to be sent
        const message = typeof Message !== "undefined" ? Message : {};

        // Return Response
        res.setHeader("Content-Type", "image/png");
        res.writeHead(statusCode);
        res.end(message);
    }
};

// Define Routers
// =======================================================
server["router"] = {
    ping: ping,
    "account/signUp": create_account,
    "account/login": authentication,
    "account/profile": fetch_account,
    "account/picture": upload_images,
    "account/update": update_account,
    "account/deactivate": delete_account,
    "laboratory/create": create_company,
    "laboratory/update": update_company,
    "laboratory/profile": fetch_company,
    "laboratory/tests": fetch_tests,
    "laboratory/update/services": update_services,
    "laboratory/delete/services": delete_services,
    "laboratory/tests/booking": Book_A_Test,
    "laboratory/tests/pending": enter_result,
    "laboratory/tests/completed": completed_result,
    "laboratory/users/create": create_user,
    "laboratory/users/delete": delete_user,
    "account/verification": user,
    "session/update": update_token,
};

// Server Init
// =======================================================
server["SERVER_init"] = () => {
    // Listen
    server.HTTPserver.listen(configuration.HTTP_port, () => {
        console.log("HTTP Server is Listening On Port " + configuration.HTTP_port + " in " + configuration.mode + " mode");
    });

    server.HTTPSserver.listen(configuration.HTTPS_port, () => {
        console.log("HTTPS Server is Listening On Port " + configuration.HTTPS_port + " in " + configuration.mode + " mode");
    });
};

// Export Module
module.exports = server;
