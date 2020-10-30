/*
routes/post.js: Route to process post
objective:
    * to upload text-only markdown post
    * to retrieve all posts
    * to modify a post
    * to delete a post
    * forward error message to frontend
*/

const { response } = require("express");
var express = require("express");
var Post = require("../model/post");

const postRouter = express.Router();

// To upload a post
postRouter.post("/upload", async function (req, res) {
    try {
        const { title, content, catalog } = req.body;

        const user = req.session.user;
        if (user && user.userId) {
            const newPost = new Post({
                title,
                author: user.username,
                catalog,
                content,
                timestamp: Date.now(),
            });
            await newPost.save();
            res.send({ _id: newPost.id });
        } else {
            throw new Error("Not logged in");
        }
    } catch (err) {
        res.status(401).send(err.message);
        console.log(err.message);
    }
});

// Currently only support retrieval for all posts
// Will add page range support
postRouter.get("/", async function (req, res) {
    try {
        const allposts = await Post.find({});
        res.send(allposts);
    } catch (err) {
        res.status(400).send(err.message);
        console.log(err.message);
    }
});

// To get a specific post by postId
postRouter.get("/:postid", async function (req, res) {
    try {
        const { postid } = req.params;
        const apost = await Post.findById(postid);
        res.send(apost);
    } catch (err) {
        res.status(400).send(err.message);
        console.log(err.message);
    }
});

// To modify a specific post by postId
postRouter.post("/:postid", async function (req, res) {
    try {
        /* Get reference in database */
        const { postid } = req.params;
        const apost = await Post.findById(postid);

        const { title, content, catalog } = req.body;

        const user = req.session.user;

        if (user && user.username === apost.author) {
            await Post.findByIdAndUpdate(postid, { title, content, catalog });
            res.send({status: "uploaded"});
        } else {
            throw new Error("Unauthorized");
        }
    } catch (err) {
        res.status(401).send(err.message);
        console.log(err.message);
    }
});

// To remove a specific post by postId
postRouter.delete("/remove/:postid", async function (req, res) {
    try {
        const { postid } = req.params;
        const apost = await Post.findById(postid);
        const user = req.session.user;

        if (user && apost && user.username === apost.author){
            await Post.findByIdAndRemove(postid);
            res.send({status: "removed"});
        } else {
            throw new Error("Unauthorized");
        }

    } catch (err) {
        res.status(401).send(err.message);
        console.log(err.message);
    }
});

module.exports = postRouter;
