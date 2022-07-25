<<<<<<< HEAD
const isValid = function(value){
    if(typeof value === "undefined" || value === null) return false
    if(typeof value === "string" && value.trim().length === 0 ) return false
    if(typeof value === Number && value.trim().length===0) return false
    return true;
}

const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
      }

      const isValidMobile = function (num) {
        return /^[6789]\d{9}$/.test(num);
      };

      
const passwordValidate = function(value){
    let regex =    /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])([a-zA-Z0-9!@#$%^&*]{8,15})$/
    return regex.test(value)
   };

   const isValidObjectId = function (objectId) {
    return mongoose.Types.ObjectId.isValid(objectId);
  };
      
=======
const aws = require("aws-sdk");
const bcrypt = require("bcrypt");

// function for validating input request
const isValidRequest = function (data) {
  if (!data) return false;
  if (Object.keys(data).length == 0) return false;
  return true;
};

// function for mobile verification
const isValidMobile = function (num) {
  return /^[6789]\d{9}$/.test(num);
};

// function for pincode verification
const isValidPincode = function (num) {
  return /^[1-9][0-9]{5}$/.test(num);
};

// function for mail verification
const isValidMail = function (v) {
  v = v.toLowerCase();
  return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    v
  );
};

// function for password verification
const isValidPassword = function (pass) {
  return /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])([a-zA-Z0-9!@#$%^&*]{8,15})$/.test(
    pass
  );
};

// function for string verification
const isValid = function (value) {
  if (!value) return false;
  if (typeof value === "undefined" || value === null) return false;
  if (value.length === 0) return false;
  if (typeof value === "string" && value.trim().length === 0) return false;
  else if (typeof value === "string") return true;
};

let uploadFile = async (file) => {
  return new Promise(function (resolve, reject) {
    // this function will upload file to aws and return the link
    let s3 = new aws.S3({ apiVersion: "2006-03-01" }); // we will be using the s3 service of aws

    var uploadParams = {
      ACL: "public-read",
      Bucket: "classroom-training-bucket", //HERE
      Key: "ProductManagementGroup47/" + file.originalname, //HERE
      Body: file.buffer,
    };

    s3.upload(uploadParams, function (err, data) {
      if (err) {
        return reject({ error: err });
      }
      console.log(data);
      console.log("file uploaded succesfully");
      return resolve(data.Location);
    });
  });
};

const generateHash = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

module.exports = {
  isValidRequest,
  isValidMobile,
  isValidMail,
  isValidPassword,
  isValidPincode,
  isValid,
  uploadFile,
  generateHash,
};
>>>>>>> 19730c85b5bba15404efd2bf16a43c179edd6560
