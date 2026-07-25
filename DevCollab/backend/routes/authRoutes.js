const express = require("express");

const router = express.Router();

const {

    signup,
    login

} = require("../controllers/authController");

router.post("/signupusers", signup);

router.post("/loginusers", login);

module.exports = router;