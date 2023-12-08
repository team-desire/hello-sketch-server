const express = require("express");
const router = express.Router();

const sketchesController = require("../controllers/sketches.controller");

router.get("/", sketchesController.getSketches);

module.exports = router;
