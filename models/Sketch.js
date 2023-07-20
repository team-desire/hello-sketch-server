const mongoose = require("mongoose");
const { Schema } = mongoose;

const sketchSchema = new Schema(
  {
    _id: { type: String },
    userId: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
    title: String,
    type: { type: String, enum: ["basic", "cartoon"] },
    isPublic: { type: Boolean, index: true },
    imageUrl: String,
    backgroundImageUrl: String,
    canvas: {
      person: [
        {
          type: {
            type: String,
            enum: ["head", "body", "bottom", "scene", "face"],
          },
          zIndex: Number,
          location: { top: String, left: String },
          url: String,
        },
      ],
    },
    items: [
      {
        type: { type: String, enum: ["item"] },
        zIndex: Number,
        location: { top: String, left: String },
        url: String,
      },
    ],
    comments: [{ type: String, ref: "Comment", required: true }],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Sketch", sketchSchema);
