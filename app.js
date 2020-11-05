var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var connectStore = require("connect-mongo");
var session = require("express-session");
var db = require("./utils/database");
var {SESS_NAME, SESS_SECRET, SESS_LIFETIME, NODE_ENV} = require("./config.json");

var cors = require("cors");

var authRouter = require("./routes/auth");
var postRouter = require("./routes/post");
var fileRouter = require("./routes/file");

var app = express();
const MongoStore = connectStore(session);

app.use(
    session({
        name: SESS_NAME,
        secret: SESS_SECRET,
        saveUninitialized: false,
        resave: false,
        store: new MongoStore({
            mongooseConnection: db,
            collection: "session",
            ttl: parseInt(SESS_LIFETIME) / 1000,
        }),
        cookie: {
            sameSite: true,
            secure: NODE_ENV === "production",
            maxAge: parseInt(SESS_LIFETIME),
        },
    })
);

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/auth", authRouter);
app.use("/api/post", postRouter);
app.use("/api/public", fileRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

module.exports = app;
