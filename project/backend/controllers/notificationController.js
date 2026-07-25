const Notification = require("../models/Notification");
const Project = require("../models/Project");

// Get all notifications of a user
const getNotifications = async (req, res) => {
    try {
        const userId = req.params.id;

        const notifications = await Notification.find({
            receiver: userId
        })
            .populate("sender", "Name profileImage")
            .sort({ createdAt: -1 });

        res.send({
            statuscode: 1,
            notifications
        });

    } catch (err) {
        res.send({
            statuscode: 0,
            message: err.message
        });
    }
};

// Mark a notification as read
const markAsRead = async (req, res) => {
    try {

        const notification = await Notification.findByIdAndUpdate(
            req.params.id,
            {
                isRead: true
            },
            {
                new: true
            }
        );

        if (!notification) {
            return res.send({
                statuscode: 0,
                message: "Notification not found."
            });
        }

        res.send({
            statuscode: 1,
            message: "Notification marked as read."
        });

    } catch (err) {
        res.send({
            statuscode: 0,
            message: err.message
        });
    }
};

// Mark all notifications as read
const markAllAsRead = async (req, res) => {
    try {

        await Notification.updateMany(
            {
                receiver: req.params.id
            },
            {
                isRead: true
            }
        );

        res.send({
            statuscode: 1,
            message: "All notifications marked as read."
        });

    } catch (err) {
        res.send({
            statuscode: 0,
            message: err.message
        });
    }
};

// Delete notification
const deleteNotification = async (req, res) => {
    try {

        const notification = await Notification.findByIdAndDelete(req.params.id);

        if (!notification) {
            return res.send({
                statuscode: 0,
                message: "Notification not found."
            });
        }

        res.send({
            statuscode: 1,
            message: "Notification deleted."
        });

    } catch (err) {
        res.send({
            statuscode: 0,
            message: err.message
        });
    }
};
const acceptApplication = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.notificationId);
        if (!notification) {
            return res.send({
                statuscode: 0,
                message: "Notification not found."
            });
        }
        const project = await Project.findById(notification.project);

        if (!project) {
            return res.send({
                statuscode: 0,
                message: "Project not found."
            });
        }

        project.pendingRequests = project.pendingRequests.filter(
            id => id.toString() !== notification.sender.toString()
        );

        if (!project.members.includes(notification.sender.toString())) {
            project.members.push(notification.sender.toString());
        }
        await project.save();

        await Notification.create({
            receiver: notification.sender,
            sender: notification.receiver,
            project: project._id,
            type: "application_accepted",
            title: "Application Accepted",
            message: `Your request to join ${project.title} was accepted.`
        });

        await Notification.findByIdAndDelete(notification._id);

        res.send({
            statuscode: 1
        });

    } catch (err) {
        res.send({
            statuscode: 0,
            message: err.message
        });
    }
};





const rejectApplication = async (req, res) => {
    try {

        const notification = await Notification.findById(req.params.notificationId);

        if (!notification) {
            return res.send({
                statuscode: 0,
                message: "Notification not found."
            });
        }

        const project = await Project.findById(notification.project);

        if (project) {

            project.pendingRequests = project.pendingRequests.filter(
                id => id.toString() !== notification.sender.toString()
            );

            await project.save();
        }

        await Notification.create({
            receiver: notification.sender,
            sender: notification.receiver,
            project: notification.project,
            type: "application_rejected",
            title: "Application Rejected",
            message: `Your request to join "${project.title}" was rejected.`,
            link: `/project/${project._id}`
        });

        await Notification.findByIdAndDelete(notification._id);

        res.send({
            statuscode: 1,
            message: "Application rejected."
        });

    } catch (err) {

        res.send({
            statuscode: 0,
            message: err.message
        });

    }
};

module.exports = {
    getNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    acceptApplication,
    rejectApplication
};
