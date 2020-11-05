const db = require("../utils/database");
var mongoose = require("mongoose");

const FileSchema = new mongoose.Schema({
    filename: {
        type: String,
        required: true,
    },
    filepath: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    }
});

const File = mongoose.model("File", FileSchema);
module.exports = File;
