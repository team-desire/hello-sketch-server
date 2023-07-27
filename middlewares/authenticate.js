const admin = require("../config/firebase-config");
const createError = require("http-errors");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const { TEXT } = require("../constants/text");

const isAuthenticated = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    next(createError(StatusCodes.UNAUTHORIZED, ReasonPhrases.UNAUTHORIZED));

    return;
  }

  try {
    const decodeValue = await admin.auth().verifyIdToken(token);

    if (decodeValue) {
      return next();
    }
  } catch (error) {
    if (error instanceof admin.auth.InvalidIdTokenError) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: TEXT.STATUS.ERROR,
        message: "Invalid token",
      });
    }

    if (error instanceof admin.auth.ExpiredIdTokenError) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: TEXT.STATUS.ERROR,
        message: "Expired token",
      });
    }

    next(
      createError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        ReasonPhrases.INTERNAL_SERVER_ERROR,
      ),
    );
  }
};

exports.isAuthenticated = isAuthenticated;
