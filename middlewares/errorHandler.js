const { StatusCodes, ReasonPhrases } = require("http-status-codes");

const errorHandler = async (err, req, res, next) => {
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.locals.message = err.message || ReasonPhrases.INTERNAL_SERVER_ERROR;

  res.status(err.status || StatusCodes.INTERNAL_SERVER_ERROR);
  res.json({
    status: "error",
    message: res.locals.message,
  });
};

module.exports = errorHandler;
