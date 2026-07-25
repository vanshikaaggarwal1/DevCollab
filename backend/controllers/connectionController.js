const User = require("../models/User");
const Notification = require("../models/Notification");

const sendRequest = async (req, res) => {
    try {
        const senderId = req.body.senderId;
        const receiverId = req.params.id;

        if (senderId === receiverId) {
            return res.send({
                statuscode: 0,
                message: "You can't connect with yourself."
            });
        }

        const sender = await User.findById(senderId);
        const receiver = await User.findById(receiverId);

        if (!sender || !receiver) {
            return res.send({
                statuscode: 0,
                message: "User not found."
            });
        }

        // Already connected
        if (sender.Connections.includes(receiverId)) {
            return res.send({
                statuscode: 0,
                message: "Already connected."
            });
        }

        // Request already sent
        if (sender.SentRequests.includes(receiverId)) {
            return res.send({
                statuscode: 0,
                message: "Request already sent."
            });
        }

        sender.SentRequests.push(receiverId);
        receiver.ReceivedRequests.push(senderId);

        await Notification.create({
            receiver: receiverId,
            sender: senderId,
            type: "connection_request",
            title: "New Connection Request",
            message: `${sender.Name} sent you a connection request.`,
            link: "/requests"
        });

        await sender.save();
        await receiver.save();

        res.send({
            statuscode: 1,
            message: "Connection request sent."
        });

    } catch (err) {
        res.send({
            statuscode: 0,
            message: err.message
        });
    }
};

const acceptRequest = async (req, res) => {
    try {
        const receiverId = req.body.receiverId; // Logged-in user
        const senderId = req.params.id;         // User who sent the request

        const sender = await User.findById(senderId);
        const receiver = await User.findById(receiverId);

        if (!sender || !receiver) {
            return res.send({
                statuscode: 0,
                message: "User not found."
            });
        }

        // Check if request exists
        if (!receiver.ReceivedRequests.includes(senderId)) {
            return res.send({
                statuscode: 0,
                message: "No pending request found."
            });
        }

        // Remove request from receiver's ReceivedRequests
        receiver.ReceivedRequests = receiver.ReceivedRequests.filter(
            id => id.toString() !== senderId
        );

        // Remove request from sender's SentRequests
        sender.SentRequests = sender.SentRequests.filter(
            id => id.toString() !== receiverId
        );

        // Add each other to Connections (if not already connected)
        if (!receiver.Connections.includes(senderId)) {
            receiver.Connections.push(senderId);
        }

        if (!sender.Connections.includes(receiverId)) {
            sender.Connections.push(receiverId);
        }
        await Notification.create({
            receiver: senderId,
            sender: receiverId,
            type: "connection_accepted",
            title: "Connection Accepted",
            message: `${receiver.Name} accepted your request.`,
            link: "/connections"
        });
        await sender.save();
        await receiver.save();

        res.send({
            statuscode: 1,
            message: "Connection request accepted."
        });

    } catch (err) {
        res.send({
            statuscode: 0,
            message: err.message
        });
    }
};

const rejectRequest = async (req, res) => {
    try {
        const receiverId = req.body.receiverId; // logged-in user
        const senderId = req.params.id;         // user who sent request

        const sender = await User.findById(senderId);
        const receiver = await User.findById(receiverId);

        if (!sender || !receiver) {
            return res.send({
                statuscode: 0,
                message: "User not found."
            });
        }

        // Check if request exists
        if (!receiver.ReceivedRequests.includes(senderId)) {
            return res.send({
                statuscode: 0,
                message: "No pending request found."
            });
        }

        // Remove from receiver's ReceivedRequests
        receiver.ReceivedRequests = receiver.ReceivedRequests.filter(
            id => id.toString() !== senderId
        );

        // Remove from sender's SentRequests
        sender.SentRequests = sender.SentRequests.filter(
            id => id.toString() !== receiverId
        );

        await sender.save();
        await receiver.save();

        return res.send({
            statuscode: 1,
            message: "Connection request rejected."
        });

    } catch (err) {
        return res.send({
            statuscode: 0,
            message: err.message
        });
    }
};
const getConnections = async (req, res) => {
    try {
        const userId = req.params.id;

        const user = await User.findById(userId)
            .populate("Connections", "Name Email profileImage Role Company Skills");

        if (!user) {
            return res.send({
                statuscode: 0,
                message: "User not found."
            });
        }

        res.send({
            statuscode: 1,
            connections: user.Connections
        });

    } catch (err) {
        res.send({
            statuscode: 0,
            message: err.message
        });
    }
};
const getPendingRequests = async (req, res) => {
    try {
        const userId = req.params.id;

        const user = await User.findById(userId)
            .populate("ReceivedRequests", "Name Email profileImage")
            .populate("SentRequests", "Name Email profileImage");

        if (!user) {
            return res.send({
                statuscode: 0,
                message: "User not found."
            });
        }

        res.send({
            statuscode: 1,
            receivedRequests: user.ReceivedRequests,
            sentRequests: user.SentRequests
        });

    } catch (err) {
        res.send({
            statuscode: 0,
            message: err.message
        });
    }
};
module.exports = { sendRequest, acceptRequest, rejectRequest, getConnections, getPendingRequests };