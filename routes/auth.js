const { response } = require("express");
var express = require("express");
var User = require("../model/user");
var { sessionizeUser } = require("../utils/session");
var { SESS_NAME } = require("../config.json");

const authRouter = express.Router();
authRouter.post("/register", async function (req, res) {
    try {
        const { username, password } = req.body;

        const newUser = new User({ username, password });
        const sessionUser = sessionizeUser(newUser);
        await newUser.save();

        req.session.user = sessionUser;
        res.send(sessionUser);
    } catch (err) {
        res.status(400).send(err);
        console.log(err);
    }
});

authRouter.post("/login", async function (req, res) {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (user && user.comparePasswords(password)) {
            const sessionUser = sessionizeUser(user);

            req.session.user = sessionUser;
            res.send(sessionUser);
        } else {
            throw new Error("Invalid login credentials");
        }
    } catch (err) {
        res.status(401).send(err);
    }
});

authRouter.delete("/logout", function ({ session }, res) {
    try {
        const user = session.user;
        if (user) {
            session.destroy(function (err) {
                if (err) throw err;
                res.clearCookie(SESS_NAME);
                res.send({ userId: null, username: null });
            });
        } else {
            throw new Error("Something went wrong");
        }
    } catch (err) {
        res.status(422).send(err);
        console.log(err);
    }
});

authRouter.get("/", ({ session: { user } }, res) => {
    if (user) {
        res.send({ user });
    } else {
        res.send({ userId: null, username: null });
    }
});

module.exports = authRouter;
