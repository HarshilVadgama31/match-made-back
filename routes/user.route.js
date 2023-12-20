const express = require("express");
const router = express.Router();
const user = require("../controllers/user");
const authenticateToken = require("../middleware/authMiddleware");

router.use(express.urlencoded({ extended: true }));

router.get("/*", (req, res) => res.send("Error 404. Page Not Found."));

router.post("/create", user.createUser);
router.post("/update", user.updateUser);

// router.post("/set-favourite", user.setFavourites);
// router.post("/favourites", user.favourites);

module.exports = router;
