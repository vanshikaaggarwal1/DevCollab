const express = require("express");
const router = express.Router();

const {
  createProject,
  getProjects,
  joinProject,
  getAllProjects,
  getProjectDetail,
  getProjectActivity,
  updateProject,
  removeMember,
} = require("../controllers/projectController");

router.post("/", createProject);
router.get("/detail/:id", getProjectDetail);
router.get("/activity/:id", getProjectActivity);
router.put("/update/:id", updateProject);
router.put("/join/:id", joinProject);
router.put("/:id/remove-member", removeMember);
router.get("/", getAllProjects);
router.get("/:id", getProjects);

module.exports = router;
