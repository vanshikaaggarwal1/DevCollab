const express = require("express");
const router = express.Router();
const {
    sendRequest,
    acceptRequest,
    rejectRequest,
    getConnections,
    getPendingRequests
} = require("../controllers/connectionController")

router.post("/request/:id", sendRequest);
router.put("/accept/:id", acceptRequest);
router.put("/reject/:id", rejectRequest);
router.get("/connections/:id", getConnections);
router.get("/pending/:id", getPendingRequests);

module.exports = router;
