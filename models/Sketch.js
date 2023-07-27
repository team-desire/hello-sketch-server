const mongoose = require("mongoose");
const { Schema } = mongoose;

const sketchSchema = new Schema(
  {
    userId: { type: mongoose.Types.ObjectId, ref: "User" },
    title: String,
    type: { type: String, enum: ["illustration", "cartoon"] },
    isPublic: { type: Boolean, index: true },
    imageUrl: String,
    comments: [{ type: mongoose.Types.ObjectId, ref: "Comment" }],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Sketch", sketchSchema);
