require("dotenv").config();
const express = require("express");
const path = require("path");
const logger = require("morgan");
const cors = require("cors");

const notFoundErrorHandler = require("./middlewares/notFoundErrorHandler");
const errorHandler = require("./middlewares/errorHandler");

const usersRouter = require("./routes/users");
const loginRouter = require("./routes/login");
const sketchesRouter = require("./routes/sketches");
const unitsRouter = require("./routes/units");

const app = express();

const mongoose = require("mongoose");

const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("connected");
  } catch (error) {
    console.log("failed");
  }
};

connectToDatabase();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/users", usersRouter);
app.use("/login", loginRouter);
app.use("/sketches", sketchesRouter);
app.use("/units", unitsRouter);

app.use(notFoundErrorHandler);
app.use(errorHandler);

module.exports = app;
