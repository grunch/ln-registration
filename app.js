require("dotenv").config();
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const { homedir } = require("os");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

const indexRouter = require("./routes/index");
const apiRouter = require("./routes/api");
const { setDir } = require("./util");

const subscribeInvoices = require("./ln/subscribe_invoices");

subscribeInvoices();

const app = express();

// Create app directory if it doesn't exist
setDir(path.join(homedir(), process.env.APP_DIR));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(morgan("[:date[iso]] :method :url :status"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/api", apiRouter);

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
