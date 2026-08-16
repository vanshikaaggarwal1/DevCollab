const User = require("../models/User");

const ALLOWED_PROFILE_FIELDS = [
  "Name",
  "Role",
  "Bio",
  "Location",
  "Skills",
  "Github",
  "Linkedin",
  "Portfolio",
  "Experience",
  "Education",
  "Company",
  "Image",
  "CoverImage",
];

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-Password");

    if (!user) {
      return res.status(404).send({
        statuscode: 0,
        message: "User not found",
      });
    }

    res.send({
      statuscode: 1,
      user,
    });
  } catch (err) {
    res.status(500).send({
      statuscode: 0,
      message: err.message,
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const rawBody = { ...req.body };

    // Block any attempt to update Password or Email via profile update
    delete rawBody.Password;
    delete rawBody.password;
    delete rawBody.Email;
    delete rawBody.email;

    const filteredData = {};
    ALLOWED_PROFILE_FIELDS.forEach((field) => {
      if (rawBody[field] !== undefined) {
        filteredData[field] = rawBody[field];
      }
    });

    // Skills handling when sent as JSON string in FormData
    if (typeof filteredData.Skills === "string") {
      try {
        filteredData.Skills = JSON.parse(filteredData.Skills);
      } catch {
        filteredData.Skills = filteredData.Skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      }
    }

    // Profile Image upload
    if (req.files && req.files.profileImage) {
      filteredData.Image = "/uploads/" + req.files.profileImage[0].filename;
    }

    // Cover Image upload
    if (req.files && req.files.coverImage) {
      filteredData.CoverImage = "/uploads/" + req.files.coverImage[0].filename;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      filteredData,
      { new: true }
    ).select("-Password");

    res.send({
      statuscode: 1,
      message: "Profile Updated Successfully",
      user: updatedUser,
    });
  } catch (err) {
    res.status(500).send({
      statuscode: 0,
      message: err.message,
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-Password");

    res.send({
      statuscode: 1,
      users,
    });
  } catch (err) {
    console.error(err);

    res.status(500).send({
      statuscode: 0,
      message: err.message,
    });
  }
};

module.exports = { getUser, updateProfile, getAllUsers };