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

const registerUser = async function (req, res) {
  try {
    if (!isValidRequest(req.body))
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
    if (!isValidMobile)
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
        message: "Profile Image is required in JPEG/PNG/JPG format",
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
