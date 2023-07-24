const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middlewares/authenticate");
const sketchesController = require("../controllers/sketches.controller");

router.get("/", sketchesController.getSketches);
router.get(
  "/:sketch_id/download_url",
  isAuthenticated,
  sketchesController.getSketchDownloadUrl,
);

module.exports = router;
