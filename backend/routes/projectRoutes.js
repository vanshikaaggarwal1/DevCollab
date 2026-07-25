const express = require("express");
const router = express.Router();

const {createProject , getProjects , joinProject , getAllProjects} = require("../controllers/projectController");

router.post("/", createProject);
router.get("/:id", getProjects);
router.get("/", getAllProjects);
router.put("/join/:id", joinProject);
module.exports = router;