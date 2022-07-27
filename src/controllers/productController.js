const productModel = require("../models/productModel");
const { isValidObjectId } = require("mongoose");
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

    // validation of availableSizes
    try {
      availableSizes = JSON.parse(availableSizes);
    } catch (err) {
      return res.status(400).send({
        status: false,
        message: `Please enter at least one valid size from ["S", "XS", "M", "X", "L", "XXL", "XL"] in array format`,
      });
    }
    if (!availableSizes.length)
      return res
        .status(400)
        .send({ status: false, message: "At least one size is required" });
    if (!Array.isArray(availableSizes))
      return res.status(400).send({
        status: false,
        message: "enter valid available sizes in array",
      });

    let sizes = availableSizes.filter(
      (size) =>
        isValid(size) && ["S", "XS", "M", "X", "L", "XXL", "XL"].includes(size)
    );
    if (sizes.length == 0)
      return res.status(400).send({
        status: false,
        message: `available sizes should be in valid format and should be from:  S, XS, M, X, L, XXL, XL`,
      });
    product.availableSizes = sizes;

    const userData = await productModel.create(product);
    res.status(201).json({ status: true, data: userData });
  } catch (error) {
    return res.status(500).json({ status: false, error: error.message });
  }
};

const deleteProductById = async (req, res) => {
  try {
    let productId = req.params.productId;

    if (!isValidObjectId(productId))
      return res
        .status(400)
        .send({ status: false, message: "Invalid product ID" });

    const checkID = await productModel.findOneAndUpdate(
      { _id: productId, isDeleted: false },
      { isDeleted: true, deletedAt: Date.now() }
    );

    if (!checkID) {
      return res
        .status(404)
        .json({ status: false, msg: `${productId} is not present in DB!` });
    }

    res.status(200).json({
      status: true,
      message: "Request product is deleted sucessfully",
    });
  } catch (error) {
    return res.status(500).json({ status: false, error: error.message });
  }
};

module.exports = { createProduct, deleteProductById };
