// Import Dependencies
const fs = require("fs");
const path = require("path");

// Container
const misc = {};

// Base Directory
misc["image_base_directory"] = path.join(__dirname, "./../.data/images/");

// Not Found
misc.notFound = (data, callback) => {
    callback(404, {}, "json");
};

// Not Found
misc.ping = (data, callback) => {
    callback(200, { message: "Hello World" }, "json");
};

// Fetch Images
misc["getImages"] = (data, callback) => {
    // Check Method
    switch (data.method) {
        case "options":
            callback(200, {}, "json");
            break;

        case "get":
            // Get file name
            const filename = data.path.replace("image", "").trim();

            if (filename && filename.length > 0) {
                //  Read File
                fs.readFile(misc.image_base_directory + filename, (err, image) => {
                    if (!err && image) {
                        // JPG
                        if (filename.indexOf(".jpg") > -1) {
                            // Return
                            callback(200, image, "jpg");
                        }

                        // PNG
                        if (filename.indexOf(".png") > -1) {
                            // Return
                            callback(200, image, "png");
                        }
                    } else {
                        callback(404, {}, "json");
                    }
                });
            } else {
                callback(400, {}, "json");
            }
            break;

        default:
            callback(405, {}, "json");
            break;
    }
};

// Export Module
module.exports = misc;
