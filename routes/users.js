const express = require("express");
const router = express.Router();

const {
  getSketch,
  createSketch,
  getUserSketches,
} = require("../controllers/sketches.controller");

router.get(`/:userId/sketches/:sketchId`, getSketch);
router.post(`/:userId/sketches`, createSketch);
router.get(`/:userId/sketches`, getUserSketches);

module.exports = router;
