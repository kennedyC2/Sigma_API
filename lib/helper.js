// Import dependencies
const crypto = require("crypto");
const config = require("./../config");

// Container
const helpers = {};

// Parse JSON Object
helpers["parseJSONObject"] = (obj) => {
    try {
        const data = JSON.parse(obj);
        return data;
    } catch (error) {
        return {};
    }
};

// Create a SHA256 hash
helpers["hash"] = (str) => {
    if (typeof str === "string" && str.length > 0) {
        const hash = crypto.createHmac("sha256", config.secret).update(str).digest("hex");
        return hash;
    } else {
        return false;
    }
};

// Generate Random Strings
helpers["createRandomString"] = function (strLen) {
    strLen = typeof strLen == "number" && strLen >= 20 ? strLen : false;
    if (strLen) {
        // Define possible characters
        var possibleCharacters = "abcdefghijklmnopqrstuvwsyz1234567890";
        // Generation process
        var finale = "";
        for (i = 1; i < strLen; i += 1) {
            // Get a random character from possibleCharacters
            var randomCharacter = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
            // join this item to string
            finale += randomCharacter;
        }
        return finale;
    } else {
        return false;
    }
};

// Create ID
helpers["createID"] = function (Uname) {
    var companyName = Uname;
    var firstLetter = companyName[0].toUpperCase();
    var timeOfReg = Date.now();
    var userName = firstLetter + timeOfReg;
    return userName;
};

// Export Modules
module.exports = helpers;
