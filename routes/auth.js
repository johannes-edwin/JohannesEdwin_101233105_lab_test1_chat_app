const express = require("express");

const authMiddleware = require("../middlewares/auth");
const authController = require("../controllers/auth");

const router = express.Router();

router.get("/", authMiddleware.RedirectIfAuthenticated, authController.Login);
router.post("/", authController.Login);
router.get(
  "/register",
  authMiddleware.RedirectIfAuthenticated,
  authController.Register
);
router.post("/register", authController.Register);
router.get("/logout", authController.Logout);

module.exports = router;
