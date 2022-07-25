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
    let filters = req.query

    Object.keys(filters).forEach(x => filters[x] = filters[x].trim())

    if(Object.keys(filters).length === 0) { // This block will work to fetch all books incase no filter is provided

      let user = await userModel.find({isDeleted: false, isPublic: true})
      if(user.length === 0)res.status(404).send({ status: false, message: "User not found" })
      res.status(200).send({ status: true, data: user })

    } else {

      filters.isDeleted = false
      filters.isPublic = true

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
