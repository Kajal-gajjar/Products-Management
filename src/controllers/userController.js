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
} = require("../validator/validation");

const registerUser = async function (req, res) {
  try {
    if (!isValidRequest(req.body))
      return res
        .status(400)
        .send({ status: false, message: "Please enter valid Input" });

    let { fname, lname, email, phone, password, address } = req.body;
    let files = req.files;

    console.log(req.body);
    console.log(typeof fname);
    console.log(req.files);

    let user = {};

    // validation of fname
    if (!fname)
      return res
        .status(400)
        .send({ status: false, message: "First name of user is required" });
    if (!isValid(fname))
      return res
        .status(400)
        .send({ status: false, message: "First name is invalid" });
    user.fname = fname;

    // validation of lname
    if (!lname)
      return res
        .status(400)
        .send({ status: false, message: "Last name of user is required" });
    if (!isValid(lname))
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
    // if (!files.length == 0)
    //   return res
    //     .status(400)
    //     .send({ status: false, message: "Profile Image is required" });
    // if (files && files.length > 0) {
    //   user.profileImage = await uploadFile(files[0]);
    // }

    // validation of password
    if (!password)
      return res
        .status(400)
        .send({ status: false, message: "Password is required" });
    if (!isValidPassword)
      return res.status(400).send({
        status: false,
        message:
          "Password should contain 8 to 15 characters, one special character, a number and should not contain space",
      });
    // hash the password
    user.password = generateHash(password);

    // if (!isValidRequest(address))
    //   return res
    //     .status(400)
    //     .send({ status: false, message: "Address is required" });
    // else {
    //   if (!isValidRequest(address.shipping))
    //     return res
    //       .status(400)
    //       .send({ status: false, message: "Shipping address is required" });

    //   // shiiping address validation
    //   let { street, city, pincode } = address.shipping;
    //   if (!isValid(street))
    //     return res.status(400).send({
    //       status: false,
    //       message: "Shipping address/street is required",
    //     });

    //   if (!isValid(city))
    //     return res.status(400).send({
    //       status: false,
    //       message: "Shipping address/city is required",
    //     });

    //   if (!isValidPincode(pincode))
    //     return res.status(400).send({
    //       status: false,
    //       message: "Shipping address/pincode is required",
    //     });
    //   user.address.shipping = address.shipping;

    //   //  billing address validation
    //   street = address.billing.street;
    //   city = address.billing.city;
    //   pincode = address.billing.pincode;
    //   if (!isValid(street))
    //     return res.status(400).send({
    //       status: false,
    //       message: "Billing address/street is required",
    //     });

    //   if (!isValid(city))
    //     return res.status(400).send({
    //       status: false,
    //       message: "Billing address/city is required",
    //     });

    //   if (!isValidPincode(pincode))
    //     return res.status(400).send({
    //       status: false,
    //       message: "Billing address/pincode is required",
    //     });
    //   user.address.billing = address.billing;
    // }
    user.address = address;

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












const loginUser = async function (req, res) {
  try {

    let requestBody = req.body;
    if (Object.keys(requestBody).length === 0) {
      return res
        .status(400)
        .json({
          status: false,
          msg: `Invalid input. Please enter email and password!`,
        });
    }
    const { email, password } = requestBody;
   
    if (!requestBody.email) {
      return res
        .status(400)
        .json({ status: false, msg: `email is mandatory field!` });
    }
    if (!isValid(email)) {
      return res
        .status(400)
        .json({ status: false, msg: `email is mandatory field!` });
    }
    if (!isValidMail(email)) {
      return res
        .status(400)
        .json({ status: false, msg: `Invalid eMail Address!` });
    }
    if (!requestBody.password) {
      return res
        .status(400)
        .json({ status: false, msg: `password is mandatory field!` });
    }

    if (!isValidPassword(password)) {
      return res
        .status(400)
        .json({ status: false, msg: `password is mandatory field!` });
    }

    const findUser = await userModel.findOne({
      email: email,
      
    });
  
    const isValidPassword = await bcrypt.compare(req.body.password, findUser.password)


    if (!isValidPassword) {
      return res
        .status(401)
        .json({ status: false, msg: `Invalid email or password!` });
    }

    const token = await jwt.sign(
      {
        userId: findUser._id,
      },
      jwtSecretKey, {expiresIn: '150mins'}
    );

    res.status(200).json({status:true, msg:`Login Successful`, data:{token, userId:findUser._id}});




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
