const mongoose = require("mongoose");
const { isValidObjectId } = require("mongoose");
const cartModel = require("../models/cartModel");
const userModel = require("../models/userModel");
const productModel = require("../models/productModel");
const { isValidRequest, isValidNumber } = require("../validator/validation");

const createCart = async function (req, res) {
  try {
    let userIdFromPrams = req.params.userId;
    if (!isValidObjectId(userIdFromPrams))
      return res
        .status(400)
        .send({ status: false, message: `Invalid User ID!` });

    if (userIdFromPrams != req.token.userId)
      return res
        .status(403)
        .send({ status: false, message: `You are not authorized` });

    if (!isValidRequest(req.body))
      return res.status(400).send({
        status: false,
        message: `Invalid Input. Body can't be empty!`,
      });

    const items = req.body.items;

    let finalCart = { items: [], totalItems: 0, totalPrice: 0 };

    for (let i = 0; i < items.length; i++) {
      const { productId, quantity } = items[i];
      const product = {};
      // product ID validation
      if (!items[i].hasOwnProperty("productId"))
        return res
          .status(400)
          .send({ status: false, message: `Product ID is required!` });

      if (!isValidObjectId(productId))
        return res
          .status(400)
          .send({ status: false, message: `Invalid Product ID!` });

      const findProduct = await productModel.findOne({
        _id: productId,
        isDeleted: false,
      });
      if (!findProduct)
        return res.status(404).send({
          status: false,
          message: `Product- ${productId} is not found`,
        });
      product.productId = productId;

      // quantity validation
      if (!quantity)
        return res
          .status(400)
          .send({ staus: false, message: `Quantity is required` });

      if (!isValidNumber(quantity) || quantity <= 0)
        return res
          .status(400)
          .send({ staus: false, message: `Minimum 1 quantity is required` });
      product.quantity = Math.floor(quantity);

      finalCart.items.push(product);
      finalCart.totalItems += product.quantity;
      finalCart.totalPrice += product.quantity * findProduct.price;
    }

    finalCart.userId = userIdFromPrams;

    let findCart = await cartModel.findOneAndUpdate(
      { userId: userIdFromPrams },
      finalCart
    );
    if (!findCart) {
      findCart = await cartModel.create(finalCart);
      return res
        .status(201)
        .send({ status: true, message: "Success", data: finalCart });
    } else {
      findCart.totalItems += finalCart.totalItems;
      findCart.totalPrice += finalCart.totalPrice;
      findCart.items = [...findCart.items, ...finalCart.items];

      const cart = await cartModel.findOneAndUpdate(
        { _id: findCart.id },
        findCart,
        {
          new: true,
        }
      );

      return res
        .status(200)
        .send({ status: true, message: "Cart is Updated", data: cart });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: false, error: error.message });
  }
};

const getCart = async (req, res) => {
  try {
    let { userId: _id } = req.params;
    if (isValidObjectId(_id)) {
      return res.status(400).sent({ staus: false, message: "invalid ID" });
    }

    const userCart = await cartModel.findOne({ userId: _id });
    if (!userCart) {
      return res.status(404).sent({ staus: false, message: "no cart Found" });
    }
    res.status(200).sent({ staus: true, data: userCart });
  } catch (error) {
    res.status(500).send({ staus: false, error: error.message });
  }
};

module.exports = { createCart, getCart };
