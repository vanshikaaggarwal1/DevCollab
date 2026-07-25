const User = require("../models/User");

const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        res.send({
            statuscode: 1,
            user
        });
    } catch (err) {
        res.send({
            statuscode: 0
        });
    }
};

const updateProfile = async (req, res) => {
    try {

        const updateData = { ...req.body };

        // Skills comes as a JSON string from FormData
        if (updateData.Skills) {
            updateData.Skills = JSON.parse(updateData.Skills);
        }

        // Profile Image
        if (req.files && req.files.profileImage) {
            updateData.Image =
                "/uploads/" + req.files.profileImage[0].filename;
        }

        // Cover Image
        if (req.files && req.files.coverImage) {
            updateData.CoverImage =
                "/uploads/" + req.files.coverImage[0].filename;
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        res.send({
            statuscode: 1,
            message: "Profile Updated Successfully",
            user: updatedUser
        });

    } catch (err) {
        res.send({
            statuscode: 0,
            message: err.message
        });
    }
};
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();

        res.send({
            statuscode: 1,
            users
        });

    } catch (err) {
        console.error(err);

        res.status(500).send({
            statuscode: 0,
            message: err.message
        });
    }
};

module.exports = { getUser, updateProfile, getAllUsers };