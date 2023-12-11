const express = require("express");
const router = express.Router();
const user = require("../controllers/user");
const authenticateToken = require("../middleware/authMiddleware");

router.use(express.urlencoded({ extended: true }));

router.get("/*", (req, res) => res.send("Error 404. Page Not Found."));

router.post("/create", user.createUser);
router.post("/update", user.updateUser);

module.exports = router;
