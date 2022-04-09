// Handler For index
const index = (data, callback) => {
    // Validate Method
    if (data.method === "get") {
        callback(200, { message: "Hello World" });
    } else {
        callback(405);
    }
};

// Export Module
module.exports = index;
