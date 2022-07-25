const userModel = require("../models/userModel");
const validator = require("../validator/validation")

const registerUser = async function (req, res) {
  try {
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

const loginUser = async function (req, res) {
  try {
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

const getUserProfile = async function (req, res) {
  try {
    let filters = req.params.userId;

    if (!validator.isValidObjectId(userId)) {
      return res.status(400).send({ status: false, message: 'Invalid userId' })
    }

    if (Object.keys(filters).length === 0) { // This block will work to fetch all books incase no filter is provided

      let user = await userModel.find({ isDeleted: false, isPublished: true })
      if (user.length === 0) res.status(404).send({ status: false, message: "User not found" })
      res.status(200).send({ status: true, data: user })

    } else {

      // filters.isDeleted = false
      // filters.isPublic = true

      let filteredUser = await userModel.find(filters)
      if (filteredUser.length === 0) return res.status(404).send({ status: false, msg: "No such data available" })
      else return res.status(200).send({ status: true, data: filteredUser })
    }
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

const UpdateUser = async function (req, res) {
  try {
    let userId = req.params.userId;

    if (!validator.isValidObjectId(userId)) {
      return res.status(400).send({ status: false, message: 'Invalid userId' })
    }

    let users = await findById(userId);

    if (Object.keys(users).length === 0) {
      return res.status(404).send({ status: false, message: 'No such data found' });
    }

    let userData = req.body;

    if (Object.keys(userData).length === 0) {
      return res.status(404).send({ status: false, message: 'No data to update' });
    }

    let updatedUser = await userModel.findOneAndUpdate({ _id: userId }, userData, { new: true });
    res.status(200).send({ status: updatedUser })



  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  UpdateUser,
};
