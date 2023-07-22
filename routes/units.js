const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middlewares/authenticate");
const unitsController = require("../controllers/units.controller");

router.get("/", isAuthenticated, unitsController.getUnits);

module.exports = router;
