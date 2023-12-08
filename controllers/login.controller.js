const createError = require("http-errors");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");

const jwt = require("jsonwebtoken");

const { CONFIG } = require("../constants/config");

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
      const token = jwt.sign({ email: userEmail }, CONFIG.SECRETKEY);

      const newUser = new User({
        email: userEmail,
        token,
      });

      await newUser.save();

      res.cookie("accessToken", token, {
        httpOnly: true,
        sameSite: "Lax",
        maxAge: 3600000,
      });

      res.json({
        status: 201,
        mesaage: "Created",
        data: {
          result: "OK",
        },
      });

      return;
    }

    res.cookie("accessToken", existingUser.token, {
      httpOnly: true,
      sameSite: "Lax",
      maxAge: 3600000,
    });

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

exports.logout = async (req, res, next) => {
  res.clearCookie("accessToken");

  res.send({
    status: 200,
    message: "Logged out successfully",
    data: {
      result: "ok",
    },
  });
};
