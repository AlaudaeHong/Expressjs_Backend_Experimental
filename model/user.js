const db = require("../utils/database");
var mongoose = require("mongoose");
var { compareSync, hashSync } = require("bcryptjs");

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        requires: true,
    },
    password: {
        type: String,
        requires: true,
    },
});

UserSchema.pre("save", function () {
    if (this.isModified("password")) {
        this.password = hashSync(this.password, 10);
    }
});

UserSchema.statics.doesNotExist = async function (field) {
    return (await this.where(field).countDocuments()) === 0;
};

UserSchema.methods.comparePasswords = function (password) {
    return compareSync(password, this.password);
};

const User = mongoose.model("User", UserSchema);
module.exports =  User;