const db = require("../utils/database");
var mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    catalog: {
        type: String,
    },
    content: {
        type: String,
    },
    timestamp :{
        type: Date,
    }
});

const Post = mongoose.model("Post", PostSchema);
module.exports = Post;
