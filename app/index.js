// Template Import
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('../routes/index');
var usersRouter = require('../routes/users');

// Config Import
const bodyParser = require("body-parser");
const { swaggerUi, specs } = require('./config/swagger');
const connectDB = require("./config/database");

// Routes Import
const memberRoutes = require('./domains/member/memberRoutes');
const bookRoutes = require('./domains/book/bookRoutes');

// Express app
const app = express();

// Connect to MongoDB
connectDB();

// Parse requests data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// view engine setup
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "../public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

// Serve Swagger API documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// API Routes
app.use('/api/members', memberRoutes);
app.use('/api/books', bookRoutes);

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

// Export the app
module.exports = app;
