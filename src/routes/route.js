const express = require("express");
const {
  registerUser,
  loginUser,
  getUserProfile,
  UpdateUser,
} = require("../controllers/userController");
const router = express.Router();

// user API
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/user/:userId/profile", getUserProfile);
router.put("/user/:userId/profile", UpdateUser);

module.exports = router;
