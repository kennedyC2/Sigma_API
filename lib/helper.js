// Import dependencies
const crypto = require("crypto");
const config = require("./config");
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const hours = ["12:am", "1:am", "2:am", "3:am", "4:am", "5:am", "6:am", "7:am", "8:am", "9:am", "10:am", "11:am", "12:pm", "1:pm", "2:pm", "3:pm", "4:pm", "5:pm", "6:pm", "7:pm", "8:pm", "9:pm", "10:pm", "11:pm"];
let timeStamp = new Date(Date.now());

// Container
const helpers = {};

// Parse JSON Object
helpers["parseJSONObject"] = (obj) => {
    try {
        return JSON.parse(obj);
    } catch (error) {
        return {};
    }
};

// Create a SHA256 hash
helpers["hash"] = (str) => {
    if (typeof str === "string" && str.length > 0) {
        return crypto.createHmac("sha256", config.secret).update(str).digest("hex");
    } else {
        return false;
    }
};

// Generate Random Strings
helpers["createRandomString"] = (strLen) => {
    strLen = typeof strLen == "number" && strLen >= 8 ? strLen : false;
    if (strLen) {
        // Define possible characters
        var possibleCharacters = "abcdefghijklmnopqrstuvwsyz1234567890";

        // Generation process
        var finale = "";
        for (i = 1; i < strLen + 1; i++) {
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

// Generate Verification Code
helpers["createCode"] = (strLen) => {
    strLen = typeof strLen == "number" && strLen === 6 ? strLen : false;
    if (strLen) {
        // Define possible characters
        var possibleCharacters = "1234567890";

        // Generation process
        var finale = "";
        for (i = 1; i < strLen + 1; i++) {
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
    return "PHDN-JR-" + Uname[0].toUpperCase() + Date.now();
};

// Get Today
helpers["today"] = `${months[timeStamp.getMonth()]} ${timeStamp.getDate()}`;

// Get Month
helpers["month"] = months[timeStamp.getMonth()];

// Get Number days In The Month
helpers["days_In_Month"] = (month) => {
    if (month === "September" || month === "April" || month === "June" || month === "November") {
        return 30;
    }

    if (month === "February") {
        // Get Year
        const year = timeStamp.getFullYear();

        // Check Leap Year
        if (year % 4 === 0 && year % 100 === 0 && year % 400 === 0) {
            return 29;
        }

        return 28;
    }

    return 31;
};

// Get hour Of the Day
helpers["hour"] = hours[timeStamp.getHours()];

// Get Day
helpers["date"] = timeStamp.getDate();

// Get Year
helpers["year"] = timeStamp.getFullYear();

// Export Modules
module.exports = helpers;
