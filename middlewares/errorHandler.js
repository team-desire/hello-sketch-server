const { StatusCodes, ReasonPhrases } = require("http-status-codes");

const errorHandler = async (err, req, res, next) => {
  const message = err.message || ReasonPhrases.INTERNAL_SERVER_ERROR;

  res.status(err.status || StatusCodes.INTERNAL_SERVER_ERROR);
  res.json({
    status: "error",
    message,
  });
};

module.exports = errorHandler;
