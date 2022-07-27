const productModel = require('../models/productModel');
const aws = require('../aws/s3Upload');
const {
   uploadFile,
    isValid,
    isValidNumber
  } = require("../validator/validation");


const createProduct = function async (res,res){

try{
    let requestBody =req.body;
    let profileImage =req.files;
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

const deleteProductById = function async (req, res)  {
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
  };
  













module.exports = { createProduct,deleteProductById};
