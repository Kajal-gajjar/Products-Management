<<<<<<< HEAD
const productModel = require('../models/productModel');
const aws = require('aws-sdk');
=======
const productModel = require("../models/productModel");
>>>>>>> d46c6103c635fb1e3eab9b8bc4b9292e495fd92b
const {
  uploadFile,
  isValid,
  isValidNumber,
  isValidRequest,
} = require("../validator/validation");

const createProduct = async function (req, res) {
  try {
    if (!isValidRequest(req.body) || req.files.length == 0)
      return res
        .status(400)
        .send({ status: false, message: "Please enter valid input" });

<<<<<<< HEAD
const createProduct = async function  (res,res){

try{
    let requestBody = req.body;
    let profileImage = req.files;
    const {title, description, price, availableSizes,isFreeShipping, style, installments, deletedAt, isDeleted} = requestBody;
=======
    let productImage = req.files;
    let {
      title,
      description,
      price,
      availableSizes,
      isFreeShipping,
      style,
      installments,
    } = req.body;

    let product = {};
>>>>>>> d46c6103c635fb1e3eab9b8bc4b9292e495fd92b

    product.currencyId = "INR";
    product.currencyFormat = "₹";

    // title validation
    if (!title) {
      return res
        .status(400)
        .json({ status: false, message: `Title is mandatory!` });
    }
    if (!isValid(title)) {
      return res
        .status(400)
        .json({ status: false, message: `Please input valid Title!` });
    }
    const isTitleAlreadyUsed = await productModel.findOne({ title: title });
    if (isTitleAlreadyUsed) {
      return res
        .status(409)
        .send({ status: false, message: `${title} is already exists!` });
    }
    product.title = title;

    // description validation
    if (!description) {
      return res
        .status(400)
        .json({ status: false, message: `Description is mandatory!` });
    }
    if (!isValid(description)) {
      return res
        .status(400)
        .json({ status: false, message: `Please input valid Description!` });
    }
    product.description = description;

    // price validation
    if (!price) {
      return res
        .status(400)
        .json({ status: false, message: `Price is mandatory!` });
    }
    if (!isValidNumber(price)) {
      return res.status(400).json({
        status: false,
        message: `Please input valid Price(Numeric Values Only)!`,
      });
    }
    product.price = Math.round(req.body.price * 10) / 10;

    // validation for isFreeShipping
    if (isFreeShipping) product.isFreeShipping = isFreeShipping;

    // product image validation
    if (productImage && productImage.length == 0)
      return res
        .status(400)
        .send({ status: false, message: "Profile Image is required" });
    else if (
      !/\.(gif|jpe?g|tiff?|png|webp|bmp)$/i.test(productImage[0].originalname)
    )
      return res.status(400).send({
        status: false,
        message: "Profile Image is required as an Image format",
      });
    else product.productImage = await uploadFile(productImage[0]);

    // validation for style
    if (style) {
      if (!isValid(style))
        return res
          .status(400)
          .send({ status: false, message: "Please enter valid style" });
      product.style = style;
    }

    //installments validation
    if (installments) {
      if (!isValidNumber(installments))
        return res
          .status(400)
          .send({ status: false, message: "Please enter valid Installments" });
      product.installments = installments;
    }

    const userData = await productModel.create(product);
    res.status(201).json({ status: true, data: userData });
  } catch (error) {
    console.log(err);
    res.status(500).json({ status: false, error: error.message });
  }
};



const deleteProductById = async (req, res) => {
    try {
      let { productId: _id } = req.params;
    
      
      const checkID = await productModel.findById(_id);
  
      if (!checkID) {
        return res
          .status(404)
          .json({ status: false, msg: `${_id} is not present in DB!` });
        }
  
      const idAlreadyDeleted = await productModel.findOne({ _id: _id });
      if (idAlreadyDeleted.isDeleted === true) {
        return res
          .status(400)
          .json({ status: false, msg: `Product already deleted!` });
        }
  
       const productData = await productModel.findByIdAndUpdate(
        { _id },
        { isDeleted: true },
        { new: true }
      );
  
      res.status(200).json({ status: true, data: productData});
    } catch (error) {
      res.status(500).json({ status: false, error: error.message });
    }
<<<<<<< HEAD
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

  let finalData = {title, description, price, isFreeShipping, productImage, style, availableSizes, installments ,deletedAt, isDeleted};      
        const userData = await productModel.create(finalData);
        res.status(201).json({status:true, data:userData});

}catch(error){
    res.status(500).json({status:false, error:error.message});
}

}

exports.getProducts = async (req, res) => {

    let filters = req.query;
  
    Object.keys(filters).forEach(x => filters[x] = filters[x].trim())
  
    if (Object.keys(filters).length === 0) {
  
      let products = await productModel.findOne({ isDeleted: false })
      if (products.length === 0)
        res.status(404).send({ status: false, message: 'Product not found' })
      res.status(200).send({ status: true, data: products })
    }
  
  
  }


module.exports = { createProduct};


=======
  };
>>>>>>> d46c6103c635fb1e3eab9b8bc4b9292e495fd92b






module.exports = { createProduct,deleteProductById};
