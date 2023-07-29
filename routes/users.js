const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middlewares/authenticate");

const {
  getSketch,
  createSketch,
  getUserSketches,
} = require("../controllers/sketches.controller");

router.get(`/:userId/sketches/:sketchId`, isAuthenticated, getSketch);
router.post(`/:userId/sketches`, isAuthenticated, createSketch);
router.get(`/:userId/sketches`, isAuthenticated, getUserSketches);

module.exports = router;
