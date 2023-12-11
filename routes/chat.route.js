const express = require("express");
const router = express.Router();
const chat = require("../controllers/chat");

router.use(express.urlencoded({ extended: true }));

router.get("/*", (req, res) => res.send("Error 404. Page Not Found."));

router.post("/create", chat.createChat );

module.exports = router;