const mongoose = require("mongoose");
const { MONGO_URI } = require("../config.json");

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
});

let db = mongoose.connection;
db.on("error", console.error.bind(console, "ERROR when connecting to MongoDB"));
db.once("open", function () {
    console.log("Connected to MongoDB");
});

module.exports = db;
