const createError = require("http-errors");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const { TEXT } = require("../constants/text");

exports.getUnits = async (req, res, next) => {
  try {
    res.json({
      status: TEXT.OK,
    });
  } catch (error) {
    next(
      createError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        ReasonPhrases.INTERNAL_SERVER_ERROR,
      ),
    );
  }
};
