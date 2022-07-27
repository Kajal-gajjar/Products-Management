const express = require("express");
const {
  registerUser,
  loginUser,
  getUserProfile,
  UpdateUser,
} = require("../controllers/userController");
const {} = require("../controllers/productController");
const { userAuthentication, authorization } = require("../middleware/auth");
const router = express.Router();

/*-------------------------------------User API --------------------------*/
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/user/:userId/profile", userAuthentication, getUserProfile);
router.put(
  "/user/:userId/profile",
  userAuthentication,
  authorization,
  UpdateUser
);

/*-------------------------------------Product API --------------------------*/

router.post("products");

// validating the route
router.all("/*", function (req, res) {
  res.status(400).send({ status: false, message: "invalid http request" });
});

module.exports = router;
