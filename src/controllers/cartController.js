const mongoose = require('mongoose');

const cartModel = require('../models/cartModel');
const userModel = require('../models/userModel');
const productModel = require('../models/productModel');
const validation =require('../validator/validation')



const createCart = async (req,res) =>{

try{

    let userIdFromPrams =req.params.userId;
    if(!validation.isValidObjectId(userIdFromPrams ))
            return res.status(400).send({status:false, message:`Invalid User ID!`});

            if(Object.keys(req.body).length == 0)
            return res.status(400).send({status:false, message:`Invalid Input. Body can't be empty!`});


            const {userId,items} =req.body
            if(!validation.isValidObjectId(userId))
            return res.status(400).send({status:false, message:`Invalid User ID!`});
             
            if(!validation.isValidObjectId(items[0].productId))
            return res.status(400).send({status:false, message:`Invalid Product ID!`});    


             if(!validation.isValidNumber(items[0].quantity))
             return res.status(400).send({staus:false,message:`Invalid product ID`})
             
             const findCart =await cartModel.findOne({userId:userIdFromPrams})
             if(findCart){

             }else {let finalData = {userId, items, totalPrice, totalItems};

                const cartData = await cartModel.create(finalData);
                res.status(201).send({status:true, data: cartData});}

             

            
             

}catch(error){
    res.status(500).send({status:false,error:error.message})
}

}















module.exports={createCart}