const express = require("express");
const router = express.Router();
const user = require("../controllers/user");
const multer = require("multer");
const path = require("path");
const authenticateToken = require("../middleware/authMiddleware");

router.use(express.urlencoded({ extended: true }));

const storage = multer.diskStorage({
    destination: function(req,file, cb){
        console.log("YAHA TAK POHCHA?: "+req.body.userId);
        cb(null, './uploads')
    } ,
    filename: function (req,file,cb){
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null,file.originalname +'-'+uniqueSuffix + path.extname(file.originalname));
        req.body.P8ProfilePicture = file.originalname +'-'+uniqueSuffix + path.extname(file.originalname);
        console.log("FILE NAME: "+req.body.P8ProfilePicture);
    },
})

const upload = multer({storage});

router.get("/*", (req, res) => res.send("Error 404. Page Not Found."));

// === USERS ===
router.post("/create", user.createUser);
router.post("/update", upload.single('P8ProfilePicture'), authenticateToken, user.updateUser);
router.post("/login", user.loginUser);

// === FAVOURITES ===
router.post("/set-favourite", user.setFavourites);
router.post("/favourites", user.favourites);

// === MATCH-FEED ===
router.post("/match-feed", user.findMatch);

module.exports = router;
