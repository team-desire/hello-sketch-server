const express = require("express");
const router = express.Router();

const unitsController = require("../controllers/units.controller");

router.get("/", unitsController.getUnits);

module.exports = router;
