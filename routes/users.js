const express = require("express");
const router = express.Router();

const {
  getSketch,
  createSketch,
  getUserSketches,
} = require("../controllers/sketches.controller");

const verifyCookie = require("../middlewares/verifyCookie");

router.get(`/:userId/sketches/:sketchId`, getSketch);
router.post(`/:userId/sketches`, verifyCookie, createSketch);
router.get(`/:userId/sketches`, getUserSketches);

module.exports = router;
