var express = require("express");
var User = require("../model/user");
var { sessionizeUser } = require("../utils/session");

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
        res.status(400).send(parseError(err));
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
        res.status(401).send(parseError(err));
    }
});

authRouter.delete("/logout", function ({ session }, res) {
    try {
        const user = session.user;
        if (user) {
            session.destroy((err) => {
                if (err) throw err;
                res.clearCookie(SESS_NAME);
                res.send(user);
            });
        } else {
            throw new Error("Something went wrong");
        }
    } catch (err) {
        res.status(422).send(parseError(err));
    }
});

authRouter.get("/", ({ session: { user } }, res) => {
    res.send({ user });
});

module.exports = authRouter;
