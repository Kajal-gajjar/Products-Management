const userModel = require("../models/userModel");

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
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

const UpdateUser = async function (req, res) {
  try {
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
