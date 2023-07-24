const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middlewares/authenticate");
const sketchesController = require("../controllers/sketches.controller");

router.get("/", isAuthenticated, sketchesController.getSketches);

router.get("/:sketch_id/download_url", sketchesController.getSketchDownloadUrl);

module.exports = router;
