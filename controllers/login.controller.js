const User = require("../models/User");

exports.post = async (req, res, next) => {
  try {
    const user = req.userData;
    const existingUser = await User.findOne({ email: user.email });

    if (!existingUser) {
      const newUser = new User({
        email: user.email,
      });

      await newUser.save();
    }

    res.send();
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
