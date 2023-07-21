const createError = require("http-errors");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");

const User = require("../models/User");

exports.post = async (req, res, next) => {
  try {
    const userEmail = req.body.email
    const existingUser = await User.findOne({ email: userEmail });

    if (!existingUser) {
      const newUser = new User({
        email: userEmail,
      });

      await newUser.save();
    }

    res.json({
      status: "ok",
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
