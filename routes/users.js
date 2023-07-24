const express = require("express");
const router = express.Router();

const { getSketch } = require("../controllers/sketches.controller");

router.get(`/:userId/sketches/:sketchId`, getSketch);

module.exports = router;
