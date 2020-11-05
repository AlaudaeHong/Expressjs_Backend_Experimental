const { response } = require("express");
var express = require("express");
var multer = require("multer");
var fs = require("fs-extra");
const path = require("path");
var File = require("../model/file");

var { uploadPath, rootPath } = require("../config.json");
const { fdatasync } = require("fs");

// https://stackoverflow.com/questions/25698176/how-to-set-different-destinations-in-nodejs-using-multer
let upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, callback) => {
            let type = file.mimetype;
            let Path = path.posix.join(rootPath, uploadPath, `${type}`);
            fs.mkdirsSync(Path);
            callback(null, Path);
        },
        filename: (req, file, callback) => {
            //originalname is the uploaded file's name with extn
            const prefix = Date.now() + "-" + Math.round(Math.random() * 1e9);
            callback(null, prefix + file.originalname);
        },
    }),
});

const fileRouter = express.Router();

fileRouter.post("/upload", upload.single("image"), async function (req, res) {
    try {
        const { file } = req;

        const newFile = new File({
            filename: file.filename,
            filepath: path.posix.join(uploadPath, `${file.mimetype}`, file.filename),
            type: file.mimetype,
        });

        await newFile.save();
        res.send({ _id: newFile.id });
    } catch (err) {
        res.status(400).send(err.message);
        console.log(err.message);
    }
});

fileRouter.get("/:fid", async function (req, res) {
    try {
        const { fid } = req.params;
        const afile = await File.findById(fid);

        if (afile) {
            var options = {
                root: rootPath,
                headers: {
                    "content-type": afile.type,
                },
            };

            res.sendFile(afile.filepath, options, function (err) {
                if (err) {
                    res.status(401).send(err.message);
                    console.log(err.message);
                } else {
                    console.log("Sent:", afile.filepath);
                }
            });
        }
    } catch (err) {
        res.status(401).send(err.message);
        console.log(err.message);
    }
});

fileRouter.delete("/:fid", async function (req, res) {
    try {
        const { fid } = req.params;
        const afile = await File.findById(fid);

        if (afile) {
            let filepath = path.posix.join(rootPath, afile.filepath);
            fs.unlinkSync(filepath);
            await File.findByIdAndRemove(fid);

            res.send({status: "removed"});
            console.log("remove file: " + fid);
        }
    } catch (err) {
        res.status(401).send(err.message);
        console.log(err.message);
    }
});

module.exports = fileRouter;
