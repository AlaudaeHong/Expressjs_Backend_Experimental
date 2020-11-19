const db = require("../utils/database");
var mongoose = require("mongoose");

const CustomSchema = new mongoose.Schema({
    banner: {
        type: String,
    },
});

const Custom = mongoose.model("Custom", CustomSchema);
module.exports = Custom;