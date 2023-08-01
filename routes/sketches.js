const express = require("express");
const router = express.Router();

const sketchesController = require("../controllers/sketches.controller");

router.get("/", sketchesController.getSketches);
router.get("/:sketch_id/download_url", sketchesController.getSketchDownloadUrl);

module.exports = router;
