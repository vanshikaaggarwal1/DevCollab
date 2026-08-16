const mongoose = require("mongoose");
const Project = require("../models/Project");
const Notification = require("../models/Notification");
const User = require("../models/User");

const populateProjectDetail = (query) =>
  query
    .populate("owner", "Name Email Role Image Location")
    .populate("members", "Name Email Role Image Location Skills")
    .populate("pendingRequests", "Name Email Role Image");

const ALLOWED_UPDATE_FIELDS = [
  "title",
  "description",
  "category",
  "status",
  "priority",
  "progress",
  "github",
  "techStack",
  "members",
  "pendingRequests",
];

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
const getProjects = async (req, res) => {

  try {
    const projects = await Project.find({
      owner: req.params.id
    })
      .populate("owner", "Name Email Role Image Location")
      .populate("members", "Name Email Role Image Location Skills");

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
      message: `${applicant?.Name || "A developer"} wants to join "${project.title}".`,
      link: `/workspace/${project._id}`
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

const getProjectDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.query;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).send({
        statuscode: 0,
        message: "Project not found.",
      });
    }

    const project = await populateProjectDetail(Project.findById(id));

    if (!project) {
      return res.status(404).send({
        statuscode: 0,
        message: "Project not found.",
      });
    }

    const projectData = project.toObject();
    projectData.membersCount = project.members?.length || 0;

    if (!userId) {
      return res.send({
        statuscode: 1,
        accessDenied: true,
        isPending: false,
        role: "none",
        project: projectData,
      });
    }

    const ownerId = (project.owner?._id || project.owner).toString();
    const requestUserId = userId.toString();
    const isOwner = ownerId === requestUserId;
    const isMember = project.members.some(
      (member) => (member._id || member).toString() === requestUserId
    );
    const isPending = project.pendingRequests.some(
      (applicant) => (applicant._id || applicant).toString() === requestUserId
    );

    if (isOwner) {
      return res.send({
        statuscode: 1,
        accessDenied: false,
        role: "owner",
        project: projectData,
      });
    }

    if (isMember) {
      return res.send({
        statuscode: 1,
        accessDenied: false,
        role: "member",
        project: projectData,
      });
    }

    return res.send({
      statuscode: 1,
      accessDenied: true,
      isPending,
      role: "none",
      project: projectData,
    });
  } catch (err) {
    return res.status(500).send({
      statuscode: 0,
      message: err.message,
    });
  }
};

const getProjectActivity = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).send({
        statuscode: 0,
        message: "Project not found.",
      });
    }

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).send({
        statuscode: 0,
        message: "Project not found.",
      });
    }

    const activities = await Notification.find({ project: id })
      .sort({ createdAt: -1 })
      .select("title message createdAt type");

    return res.send({
      statuscode: 1,
      activities,
    });
  } catch (err) {
    return res.status(500).send({
      statuscode: 0,
      message: err.message,
    });
  }
};

const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, ...updates } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).send({
        statuscode: 0,
        message: "Project not found.",
      });
    }

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).send({
        statuscode: 0,
        message: "Project not found.",
      });
    }

    if (!userId || project.owner.toString() !== userId.toString()) {
      return res.status(403).send({
        statuscode: 0,
        message: "Only the project owner can update this project.",
      });
    }

    ALLOWED_UPDATE_FIELDS.forEach((field) => {
      if (updates[field] !== undefined) {
        project[field] = updates[field];
      }
    });

    await project.save();

    const updatedProject = await populateProjectDetail(Project.findById(id));

    return res.send({
      statuscode: 1,
      project: updatedProject,
    });
  } catch (err) {
    return res.status(500).send({
      statuscode: 0,
      message: err.message,
    });
  }
};

const removeMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, memberIdToRemove } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).send({
        statuscode: 0,
        message: "Project not found.",
      });
    }

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).send({
        statuscode: 0,
        message: "Project not found.",
      });
    }

    if (!userId || project.owner.toString() !== userId.toString()) {
      return res.status(403).send({
        statuscode: 0,
        message: "Only the project owner can remove members.",
      });
    }

    if (!memberIdToRemove) {
      return res.send({
        statuscode: 0,
        message: "Member to remove is required.",
      });
    }

    if (project.owner.toString() === memberIdToRemove.toString()) {
      return res.send({
        statuscode: 0,
        message: "Cannot remove the project owner.",
      });
    }

    project.members = project.members.filter(
      (member) => member.toString() !== memberIdToRemove.toString()
    );

    await project.save();

    return res.send({
      statuscode: 1,
      message: "Member removed successfully.",
    });
  } catch (err) {
    return res.status(500).send({
      statuscode: 0,
      message: err.message,
    });
  }
};


module.exports = {
  createProject,
  getProjects,
  joinProject,
  getAllProjects,
  getProjectDetail,
  getProjectActivity,
  updateProject,
  removeMember,
};