// Handler for Background Tasks
// =====================================================================

// Import Dependencies
// =================================================================================
const file = require("./file");
const directory = require("./directory");

// Container
// =================================================================================
const worker = {};

// Delete Expired Tokens
// ================================================================================
worker["delete_token"] = () => {
    // Get list of tokens
    directory.read("token", (err, list) => {
        if (!err && list) {
            if (list.length > 0) {
                for (const prop of list) {
                    file.read("token", prop, (err, details) => {
                        if (!err && details) {
                            // Check
                            if (Date.now() > details.session) {
                                // Delete
                                file.delete("token", prop, (err) => {
                                    if (!err) {
                                        console.log("Token Directory Updated");
                                    } else {
                                        console.log("Error Deleting Token " + prop);
                                    }
                                });
                            }
                        } else {
                            console.log("Error reading Token File: " + prop + " For Deletion");
                        }
                    });
                }
            }
        } else {
            console.log("Error reading Token Directory For Deletion");
        }
    });
};

// Export Module
module.exports = worker;
