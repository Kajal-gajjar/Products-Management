const productModel = require('../models/productModel');
const aws = require('aws-sdk');
const {
   uploadFile,
    isValid,
    isValidNumber
  } = require("../validator/validation");


const createProduct = async function  (res,res){

try{
    let requestBody = req.body;
    let profileImage = req.files;
    const {title, description, price, availableSizes,isFreeShipping, style, installments, deletedAt, isDeleted} = requestBody;

    if(!requestBody.title){
        return res.status(400).json({status:false, msg: `Title is mandatory!`});  
    }
    if(!isValid(title)){
        return res.status(400).json({status:false, msg: `Please input valid Title!`});
    }
    const isTitleAlreadyUsed = await productModel.findOne({ title: title });
    if (isTitleAlreadyUsed) {
        return res.status(400).send({ status: false, message: `${title} is already exists!` });
    }
    if(!requestBody.description){
        return res.status(400).json({status:false, msg: `Description is mandatory!`});  
    }
    if(!isValid(description)){
        return res.status(400).json({status:false, msg: `Please input valid Description!`});
    }
    if(!requestBody.price){
        return res.status(400).json({status:false, msg: `Price is mandatory!`});  
    }
    if(!isValidNumber(price)){
        return res.status(400).json({status:false, msg: `Please input valid Price(Numeric Values Only)!`});
    }
    
    if(!isValid(availableSizes)){
        return res.status(400).json({status:false, msg: `Size can only be: S, XS, M, X, L, XXL, XL`});
    }
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








