const Project = require("../models/Project");
const Notification = require("../models/Notification");
const User = require("../models/User");

const createProject = async (req, res) => {
  try {

    const project = await Project.create({
      ...req.body,
      members: [req.body.owner]
    });

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      project,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// Get all projects
const getProjects = async (req, res) => {

  try {
    const projects = await Project.find({
      owner: req.params.id
    }).populate("owner", "name email");

    res.status(200).json({
      success: true,
      count: projects.length,
      projects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const joinProject = async (req, res) => {
  try {

    const projectId = req.params.id;
    const userId = req.body.userId;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.send({
        statuscode: 0,
        message: "Project not found."
      });
    }

    // Already a member
    if (project.members.includes(userId)) {
      return res.send({
        statuscode: 0,
        message: "You are already a member."
      });
    }

    // Request already sent
    if (project.pendingRequests.includes(userId)) {
      return res.send({
        statuscode: 0,
        message: "Request already sent."
      });
    }

    project.pendingRequests.push(userId);
    const applicant = await User.findById(userId);

    await Notification.create({
      receiver: project.owner, // Project owner
      sender: userId,
      project: project._id,
      type: "project_application",
      title: "Project Join Request",
      message: `${applicant.Name} wants to join "${project.title}".`,
      link: `/project/${project._id}`
    });

    await project.save();

    res.send({
      statuscode: 1,
      message: "Join request sent successfully."
    });

  } catch (err) {

    res.send({
      statuscode: 0,
      message: err.message
    });

  }
};
const getAllProjects = async (req, res) => {
  try {

    const projects = await Project.find()
      .populate("owner", "Name Email");

    res.send({
      statuscode: 1,
      projects
    });

  } catch (err) {

    res.send({
      statuscode: 0,
      message: err.message
    });

  }
};


module.exports = {
  createProject,
  getProjects,
  joinProject,
  getAllProjects
};