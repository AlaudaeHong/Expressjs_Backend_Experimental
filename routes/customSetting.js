var express = require("express");
var Custom = require("../model/customSetting");

var { uploadPath, rootPath } = require("../config.json");

const customSettingRouter = express.Router();

customSettingRouter.post("/", async function (req, res) {
    try {
        const user = req.session.user;

        if (user && user.userId) {
            const { banner } = req.body;

            const customSetting = await Custom.findOne({});
            if (customSetting) {
                await Custom.findOneAndUpdate({}, { banner });
            } else {
                const newCustomSetting = new Custom({ banner });
                await newCustomSetting.save();
            }

            res.send({ banner });
        } else {
            throw new error("Not logged in");
        }
    } catch (err) {
        res.status(401).send(err.message);
        console.log(err.message);
    }
});

customSettingRouter.get("/", async function (req, res) {
    try {
        const customSetting = await Custom.findOne({});
        if (customSetting) {
            res.send(customSetting);
        } else {
            res.send({ banner: null });
        }
    } catch (err) {
        res.status(401).send(err.message);
        console.log(err.message);
    }
});

customSettingRouter.get("/banner", async function (req, res) {
    try {
        const customSetting = await Custom.findOne({});
        if (customSetting) {
            const { banner } = customSetting;
            res.redirect("/api/public/" + banner);
        } else {
            res.redirect("/api/public/5fb5c89008292a6db8b539e4");
        }
    } catch (err) {}
});

module.exports = customSettingRouter;
