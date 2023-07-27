const createError = require("http-errors");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const { TEXT } = require("../constants/text");

const User = require("../models/User");

exports.post = async (req, res, next) => {
  const userEmail = req.body.email;

  if (!userEmail) {
    next(createError(StatusCodes.BAD_REQUEST, ReasonPhrases.BAD_REQUEST));

    return;
  }

  try {
    const existingUser = await User.findOne({ email: userEmail });

    if (!existingUser) {
      const newUser = new User({
        email: userEmail,
      });

      await newUser.save();
    }

    res.json({
      status: TEXT.STATUS.OK,
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
