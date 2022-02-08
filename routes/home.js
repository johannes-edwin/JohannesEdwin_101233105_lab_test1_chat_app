const express = require("express");

const authMiddleware = require("../middlewares/auth");
const homeController = require("../controllers/home");

const router = express.Router();

router.get("/", authMiddleware.SessionChecker, homeController.Index);
router.get("/room/:id", authMiddleware.SessionChecker, homeController.JoinRoom);

module.exports = router;
