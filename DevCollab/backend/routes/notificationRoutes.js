const express = require("express");

const router = express.Router();

const {

    getNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    acceptApplication,
    rejectApplication

} = require("../controllers/notificationController");

router.get("/:id", getNotifications);
router.put("/read/:id", markAsRead);
router.put("/read-all/:id", markAllAsRead);
router.put("/application/accept/:notificationId", acceptApplication);
router.put("/application/reject/:notificationId", rejectApplication);
router.delete("/:id", deleteNotification);

module.exports = router;