const express = require("express");
const router = express.Router();
const { signup, login } = require("../controllers/authController");

router.post("/signup", signup);
router.post("/signupusers", signup);

router.post("/login", login);
router.post("/loginusers", login);

module.exports = router;