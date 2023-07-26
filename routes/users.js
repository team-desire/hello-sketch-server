const express = require("express");
const router = express.Router();

const {
  getSketch,
  createSketch,
} = require("../controllers/sketches.controller");

router.get(`/:userId/sketches/:sketchId`, getSketch);
router.post(`/:userId/sketches`, createSketch);

module.exports = router;
