const { isValidObjectId } = require("mongoose");
const cartModel = require("../models/cartModel");
const productModel = require("../models/productModel");
const { isValidRequest, isValidNumber } = require("../validator/validation");

// ----------------------------------------------Create cart------------------------------------------------
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

    const { productId, quantity } = req.body;

    if (!productId && !quantity)
      return res.status(400).send({
        status: false,
        message: "Please enter productID and Quantity in request body",
      });

    let finalCart = { items: [], totalItems: 0, totalPrice: 0 };

    const product = {};
    // product ID validation
    if (!productId)
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

    finalCart.userId = userIdFromPrams;
    finalCart.items.push(product);
    finalCart.totalItems++;
    finalCart.totalPrice += product.quantity * findProduct.price;

    let findCart = await cartModel.findOne({ userId: userIdFromPrams });
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
    // console.log(error);
    res.status(500).send({ status: false, error: error.message });
  }
};

// ----------------------------------------------Update cart------------------------------------------------
const updateCart = async function (req, res) {
  try {
    const userId = req.user._id;
    let { cartId, productId, removeProduct } = req.body;

    // cart ID validation
    if (!cartId)
      return res
        .status(400)
        .send({ status: false, message: "Cart ID is required" });

    if (!isValidObjectId(cartId))
      return res
        .status(400)
        .send({ status: false, message: "Cart Id is invalid" });

    if (!productId)
      return res
        .status(400)
        .send({ status: false, message: "Product ID is required" });

    if (!isValidObjectId(productId))
      return res
        .status(400)
        .send({ status: false, message: "Product Id is invalid" });

    const product = await productModel.findById(productId);
    if (!product)
      return res
        .status(400)
        .send({ status: false, message: "Product Id is not found" });

    if (product.isDeleted == true)
      return res
        .status(400)
        .send({ status: false, message: "Product Id is deleted" });

    let cart = await cartModel.findOne({ _id: cartId, userId: userId });
    if (!cart)
      return res
        .status(400)
        .send({ status: false, message: "Cart is invalid" });

    let productInCart = cart.items;
    let productToUpdate;
    let indexOfProduct = 0;
    for (let i = 0; i < productInCart.length; i++) {
      if (productInCart[i].productId == productId) {
        indexOfProduct = i;
        productToUpdate = productInCart[i];
      }
    }

    if (!productToUpdate)
      return res
        .status(404)
        .send({ status: false, message: "Product is not found in cart" });

    let updateProduct = {};
    if (removeProduct == 1) {
      for (let i = 0; i < productInCart.length; i++) {
        if (productInCart[i].productId == productId) {
          productInCart[i].quantity = --productToUpdate.quantity;
        }
      }
      updateProduct.items = productInCart;
      updateProduct.totalPrice = cart.totalPrice - product.price;
    } else if (removeProduct == 0) {
      updateProduct.items = [
        ...productInCart.slice(0, indexOfProduct),
        ...productInCart.slice(indexOfProduct + 1, productInCart.length),
      ];
      updateProduct.totalItems = cart.totalItems - 1;
      updateProduct.totalPrice =
        cart.totalPrice - product.price * productToUpdate.quantity;
    } else
      return res.status(400).send({
        status: false,
        message:
          "Please enter 0 to remove product or 1 to decrease quantity of product",
      });

    const updatedCart = await cartModel.findOneAndUpdate(
      { _id: cartId, userId: userId },
      updateProduct,
      { new: true }
    );

    return res
      .status(200)
      .send({ status: true, message: "Cart is updated", data: updatedCart });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ status: false, message: error.message });
  }
};

//------------------------------------Get cart-----------------------------------------
const getCart = async (req, res) => {
  try {
    let userId = req.user._id;

    const userCart = await cartModel.findOne({ userId: userId });
    if (!userCart) {
      return res.status(404).send({ status: false, message: "no cart Found" });
    }
    res.status(200).send({ status: true, data: userCart });
  } catch (error) {
    res.status(500).send({ status: false, error: error.message });
  }
};

//----------------------------------------------Delete cart------------------------------------------------
const deleteCart = async (req, res) => {
  try {
    let userId = req.user._id;

    let cart = {
      items: [],
      totalItems: 0,
      totalPrice: 0,
    };
    const updatedCart = await cartModel.findOneAndUpdate(
      { userId: userId },
      cart
    );
    if (!updatedCart) {
      return res.status(404).send({ status: false, message: "No cart Found" });
    }
    res.status(200).send({ status: true, message: "Cart is deleted successfully" });
  } catch (error) {
    res.status(500).send({ status: false, error: error.message });
  }
};

module.exports = { createCart, getCart, deleteCart, updateCart };
