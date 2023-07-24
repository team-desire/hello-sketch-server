const mongoose = require("mongoose");
const { Schema } = mongoose;

const commentSchema = new Schema(
  {
    sketchId: { type: mongoose.Types.ObjectId, ref: "Sketch" },
    userId: { type: mongoose.Types.ObjectId, ref: "User" },
    text: { type: String },
    location: {
      top: { type: String, required: true },
      left: { type: String, required: true },
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Comment", commentSchema);
