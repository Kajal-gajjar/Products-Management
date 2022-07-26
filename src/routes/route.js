const express = require("express");
const {
  registerUser,
  loginUser,
  getUserProfile,
  UpdateUser,
} = require("../controllers/userController");
const { userAuthentication, authorization } = require("../middleware/auth");
const router = express.Router();

// user API
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/user/:userId/profile", userAuthentication, getUserProfile);
router.put(
  "/user/:userId/profile",
  userAuthentication,
  authorization,
  UpdateUser
);

module.exports = router;
