const express = require("express");

const router = express.Router();

const {

    getUser,
    updateProfile,
    getAllUsers

} = require("../controllers/userController");


const upload = require("../middleware/multer");

router.get("/all", getAllUsers);
router.get("/:id", getUser);

router.put(
    "/update/:id",
    upload.fields([
        { name: "profileImage", maxCount: 1 },
        { name: "coverImage", maxCount: 1 }
    ]),
    updateProfile
);

module.exports = router;