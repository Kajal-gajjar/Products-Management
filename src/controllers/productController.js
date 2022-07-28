const productModel = require("../models/productModel");
const { isValidObjectId } = require("mongoose");
const {
  uploadFile,
  isValid,
  isValidNumber,
  isValidRequest,
  isJsonString,
} = require("../validator/validation");

//-----------------------------------------------Create Product-----------------------------------------------
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
    if (!availableSizes)
      return res
        .status(400)
        .send({ status: false, message: "At least one size is required" });

    if (!isValid(availableSizes) || isJsonString(availableSizes))
      return res.status(400).send({
        status: false,
        message: "Please enter valid availableSizes in array",
      });

    availableSizes = JSON.parse(availableSizes);

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

//-----------------------------------------------Get product-----------------------------------------------
const getProducts = async (req, res) => {
  try {
    let data = req.query;
    let filters = {};

    // size validation
    if (data.size != undefined) {

      let size = data.size.split(",");
      
      if (size.length == 0)
        return res
          .status(400)
          .send({ status: false, message: "Please enter valid size" });

      size = size.map((x) => x.trim());
      const validSize = size.forEach((x) => {
        if (!["S", "XS", "M", "X", "L", "XXL", "XL"].includes(x)) return false;
      });

      if (validSize == false)
        return res
          .status(400)
          .send({ status: false, msg: "Please enter valid size" });
      else filters.availableSizes = { $in: size };
    }

    // name validation
    if (data.name != undefined) {
      let name = data.name.trim();
      if (!isValid(name))
        return res
          .status(400)
          .send({ status: false, message: "Please enter valid title" });
      filters.title = new RegExp(name, "i");
    }

    // price validations
    if (data.priceGreaterThan != undefined && data.priceLessThan != undefined) {
      let priceGreaterThan = data.priceGreaterThan.trim();
      let priceLessThan = data.priceLessThan.trim();
      if (!isValidNumber(priceLessThan) || !isValidNumber(priceGreaterThan))
        return res.status(400).send({
          status: false,
          message: "Please enter valid Price",
        });
      filters.price = { $gte: priceGreaterThan, $lte: priceLessThan };
    } else {
      if (data.priceGreaterThan != undefined) {
        let priceGreaterThan = data.priceGreaterThan.trim();
        if (!isValidNumber(priceGreaterThan))
          return res.status(400).send({
            status: false,
            message: "Please enter valid Greater than Price",
          });
        filters.price = { $gt: data.priceGreaterThan };
      }

      if (data.priceLessThan != undefined) {
        let priceLessThan = data.priceLessThan.trim();
        if (!isValidNumber(priceLessThan))
          return res.status(400).send({
            status: false,
            message: "Please enter valid Less than Price",
          });
        filters.price = { $lt: data.priceLessThan };
      }
    }

    let sortPrice = {};
    if (data.priceSort != undefined) {
      if (data.priceSort != 1 && data.priceSort != -1)
        return res.status(400).send({
          status: false,
          message:
            "Please enter priceSort = 1 for ascending and priceSort = -1 for descending",
        });
      else if (data.priceSort == -1) sortPrice = { price: -1 };
      else sortPrice = { price: 1 };
    } else sortPrice = { price: 1 };

    filters.isDeleted = false;

    const productData = await productModel
      .find(filters)
      .sort(sortPrice)
      .select({ deletedAt: 0 });

    if (productData.length === 0) {
      return res
        .status(404)
        .send({ status: false, message: "Product not found" });
    }

    return res
      .status(200)
      .send({ status: true, message: "success", data: productData });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ status: false, error: error.message });
  }
};

//-----------------------------------------------Get product by ID-----------------------------------------------


const getProducstById = async function (req, res) {
  try {
    let productId = req.params.productId;

    if (!isValidObjectId(productId))
      return res
        .status(400)
        .send({ status: false, message: "Invalid Product ID" });

    let getProduct = await productModel.findById(productId);

    if (!getProduct)
      return res.status(404).send({
        status: false,
        message: "Product for the mentioned ProductID is not found ",
      });

    if (getProduct.isDeleted == true)
      return res
        .status(400)
        .send({ status: false, message: "Product is deleted" });

    return res
      .status(200)
      .send({ status: true, message: "Product found", data: getProduct });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

//------------------------------------------------Update Product------------------------------------------------
const updateProductbyId = async function (res, req) {
  // try{
  //   const { product: _id} =req.params;
  //   const {title,description,price,availableSizes} =req.body;
  //   const checkID = await productModel.findById(_id);
  //    if (!checkID) {
  //         return res.status(404).json({ status: false, msg: `${_id} is not present in DB!` });
  //         }
  //       const idAlreadyDeleted =await productModel.findOne({_id : _id});
  //       if (idAlreadyDeleted.isDeleted === true) {
  //         return res.status(400).json({ status: false, msg: `Product already deleted!` });
  //         }
  //         cost (isTitleAlreadyUsed) = await productModel.findonw({ title:title});
  //         if (isTitleAlreadyUsed){
  //           return res.status(400).send({status:false, message :`${title} already exists!`});
  //         }
  //         if(!isValid(title)){
  //           return res.status(400).json({status:false, message: `Please input valid Title!`});
  //       }
  //       if(!isValid(price)){
  //         return res.status(400).json({status:false, message: `Please input valid Description!`});
  //     }
  //     if(!isValid(description)){
  //       return res.status(400).json({status:false, message: `Please input valid Description!`});
  //   }
  //     const newData = await productModel.findByIdAndUpdate({_id},req.body,{new:true});
  //     res.status(201).json({staus:true,message:`Updated Succesfully`,data :newData});
  // }catch(error){
  //   res.status(500).json({status :false,error:error.message});
  // }
};

//-----------------------------------------------Delete product by productID-----------------------------------------------
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

module.exports = {
  createProduct,
  getProducts,
  getProducstById,
  deleteProductById,
  updateProductbyId,
};
