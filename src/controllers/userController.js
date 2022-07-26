const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { isValidObjectId } = require("mongoose");
const userModel = require("../models/userModel");
const {
  isValidRequest,
  isValidMail,
  uploadFile,
  isValidMobile,
  isValidPassword,
  isValidPincode,
  isValid,
  generateHash,
  isValidName,
} = require("../validator/validation");

// ------------------------------------------Register User API------------------------------------------
const registerUser = async function (req, res) {
  try {
    if (!isValidRequest(req.body) || req.files.length == 0)
      return res
        .status(400)
        .send({ status: false, message: "Please enter valid Input" });

    let { fname, lname, email, phone, password, address } = req.body;
    let profileImage = req.files;

    let user = {};

    // validation of fname
    if (!fname)
      return res
        .status(400)
        .send({ status: false, message: "First name of user is required" });
    if (!isValidName(fname))
      return res
        .status(400)
        .send({ status: false, message: "First name is invalid" });
    user.fname = fname;

    // validation of lname
    if (!lname)
      return res
        .status(400)
        .send({ status: false, message: "Last name of user is required" });
    if (!isValidName(lname))
      return res
        .status(400)
        .send({ status: false, message: "Last name is invalid" });
    user.lname = lname;

    // validation of email
    if (!email)
      return res
        .status(400)
        .send({ status: false, message: "Last name of user is required" });
    if (!isValidMail(email))
      return res
        .status(400)
        .send({ status: false, message: "Email is invalid" });

    // validation of phone number
    if (!phone)
      return res
        .status(400)
        .send({ status: false, message: "Phone number is required" });
    if (!isValidMobile(phone))
      return res
        .status(400)
        .send({ status: false, message: "Phone number is invalid" });

    // checking for duplicate mail and mobile
    let validate = await userModel.findOne({
      $or: [{ email: email }, { phone: phone }],
    });
    if (validate)
      return res.status(409).send({
        status: false,
        message: "Email ID or Mobile number is already in use",
      });
    else {
      user.email = email;
      user.phone = phone;
    }

    // validation of profile Image
    if (profileImage && profileImage.length == 0)
      return res
        .status(400)
        .send({ status: false, message: "Profile Image is required" });
    else if (
      !/\.(gif|jpe?g|tiff?|png|webp|bmp)$/i.test(profileImage[0].originalname)
    )
      return res.status(400).send({
        status: false,
        message: "Profile Image is required as an Image format",
      });
    else user.profileImage = await uploadFile(profileImage[0]);

    // validation of password
    if (!password)
      return res
        .status(400)
        .send({ status: false, message: "Password is required" });
    if (!isValidPassword(password))
      return res.status(400).send({
        status: false,
        message:
          "Password should contain 8 to 15 characters, one special character, a number and should not contain space",
      });
    // hash the password
    user.password = generateHash(password);

    // Validation of address
    if (!isValidRequest(address))
      return res
        .status(400)
        .send({ status: false, message: "Address is required" });
    else {
      address = JSON.parse(address);
      let { shipping, billing } = address;

      if (!isValidRequest(shipping))
        return res
          .status(400)
          .send({ status: false, message: "Shipping address is required" });

      // shiiping address validation

      if (!isValid(shipping.street))
        return res.status(400).send({
          status: false,
          message: "Shipping street is required or invalid",
        });

      if (!isValidName(shipping.city))
        return res.status(400).send({
          status: false,
          message: "Shipping address/city is required or invalid",
        });

      if (!isValidPincode(shipping.pincode))
        return res.status(400).send({
          status: false,
          message: "Shipping address/pincode is required or invalid",
        });

      //  billing address validation
      if (!isValid(billing.street))
        return res.status(400).send({
          status: false,
          message: "Billing address/street is required or invalid",
        });

      if (!isValidName(billing.city))
        return res.status(400).send({
          status: false,
          message: "Billing address/city is required or invalid",
        });

      if (!isValidPincode(billing.pincode))
        return res.status(400).send({
          status: false,
          message: "Billing address/pincode is required or invalid",
        });

      user.address = address;
    }

    const savedData = await userModel.create(user);
    return res.status(201).send({
      status: true,
      message: "User created successfully",
      data: savedData,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ status: false, message: err.message });
  }
};

// ------------------------------------------Login User API------------------------------------------
const loginUser = async function (req, res) {
  try {
    if (!isValidRequest(req.body)) {
      return res.status(400).json({
        status: false,
        msg: `Invalid input. Please enter email and password!`,
      });
    }
    const { email, password } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ status: false, msg: `email is mandatory field!` });
    }
    if (!password) {
      return res
        .status(400)
        .json({ status: false, msg: `password is mandatory field!` });
    }
    if (!isValidMail(email)) {
      return res
        .status(400)
        .json({ status: false, msg: `Invalid eMail Address!` });
    }
    if (!isValidPassword(password)) {
      return res
        .status(400)
        .json({ status: false, msg: `password is mandatory field!` });
    }

    const findUser = await userModel.findOne({
      email: email,
    });

    if (!findUser)
      return res
        .status(404)
        .send({ status: false, message: "User is not found" });

    if (!findUser.validPassword(req.body.password)) {
      return res
        .status(401)
        .json({ status: false, msg: "Password is incorrect" });
    }

    const token = jwt.sign(
      {
        userId: findUser._id,
      },
      "project5-group47",
      { expiresIn: "150mins" }
    );

    res.status(200).json({
      status: true,
      message: `Login Successful`,
      data: { token: token, userId: findUser._id },
    });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

// ------------------------------------------Get User Profile API------------------------------------------
const getUserProfile = async function (req, res) {
  try {
    let filters = req.params.userId;
    if (!filters)
      return res
        .status(400)
        .send({ status: false, message: "Please enter user ID in params" });

    if (!isValidObjectId(filters))
      return res.status(400).send({ status: false, message: "Invalid userId" });

    let filteredUser = await userModel.findById(filters);
    if (!filteredUser)
      return res
        .status(404)
        .send({ status: false, msg: "No such data available" });

    if (filters !== req.token.userId)
      return res.status(401).send({
        status: false,
        message:
          "You are not authorized to fetch the profile from mentioned userID",
      });

    return res.status(200).send({
      status: true,
      message: "User profile details",
      data: filteredUser,
    });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

// ------------------------------------------Update User Profile API------------------------------------------
const UpdateUser = async function (req, res) {
  try {
    let userId = req.user._id;

    if (Object.keys(req.body).length === 0) {
      return res
        .status(404)
        .send({ status: false, message: "No such data found" });
    }

    let { fname, lname, email, phone, password, address } = req.body;
    let profileImage = req.files;

    if (fname) {
      if (!isValidName(fname))
        return res
          .status(400)
          .send({ status: false, message: "Invalid first Name" });
    }

    let updatedUser = await userModel.findOneAndUpdate(
      { _id: userId },
      userData,
      { new: true }
    );
    res.status(200).send({ status: updatedUser });
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
