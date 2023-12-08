if (process.env.NODE_ENV === "development") {
  const dotenv = require("dotenv");
  dotenv.config();
}

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
const indexRouter = require("./routes/index");

const { CONFIG } = require("./constants/config");

const app = express();

const mongoose = require("mongoose");

const connectToDatabase = async () => {
  try {
    await mongoose.connect(CONFIG.MONGODB_URI);

    console.log("connected");
  } catch (error) {
    console.log("failed");
  }
};

connectToDatabase();

app.use(
  cors({
    origin: CONFIG.CLIENT,
    credentials: true,
  }),
);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/users", usersRouter);
app.use("/login", loginRouter);
app.use("/sketches", sketchesRouter);
app.use("/units", unitsRouter);
app.use("/", indexRouter);

app.use(notFoundErrorHandler);
app.use(errorHandler);

module.exports = app;
