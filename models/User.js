const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = Schema(
  {
    email: {
      type: String,
      unique: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
