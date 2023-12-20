const express = require('express');
const router = express.Router();
const friends = require('../controllers/friends');

router.use(express.urlencoded({ extended: true }));

router.get("/*", (req, res) => res.send("Error 404. Page Not Found."));

// Get the listing of the sent requests.
router.post("/sent-requests", friends.sentRequests );

// Send the request to other user.
router.post("/send-request", friends.sendRequest );

// Get the listing of the received requests.
router.post("/received-requests", friends.receivedRequests );

// Update the received requests.
router.post("/update-request", friends.updateRequest );


module.exports = router;