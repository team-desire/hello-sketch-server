const express = require("express");
const router = express.Router();
const loginController = require("../controllers/login.controller");
const { isAuthenticated } = require("../middlewares/authenticate");

router.post("/", isAuthenticated, loginController.post);

module.exports = router;
