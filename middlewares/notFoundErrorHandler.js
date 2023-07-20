const createError = require("http-errors");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");

const notFoundErrorHandler = async (req, res, next) => {
  return next(createError(StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND));
};

module.exports = notFoundErrorHandler;
