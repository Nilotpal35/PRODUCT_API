const { validationResult, matchedData } = require("express-validator");
const { cartModel } = require("../model/cartModel");
const prodModel = require("../model/productModel");

exports.addCartController = async (req, res, next) => {
  let errorMessage = "";
  const error = validationResult(req);
  error.errors.map((item) => {
    errorMessage += "->" + item.msg;
  });
  if (errorMessage.trim().length > 0 && error.errors.length > 0) {
    return next(new Error(errorMessage));
  } else {
    const { userid, itemid } = matchedData(req);
    const { cartItems } = await cartModel.getCartById(userid);
    const newCartItems = [];
    const prodcutFound = cartItems.find((item) => item?.prodId === itemid);
    if (prodcutFound) {
      prodcutFound.qty += 1;
      newCartItems.push(prodcutFound);
      const restCartItems = cartItems.filter((item) => item.prodId !== itemid);
      newCartItems.push(...restCartItems);
    } else {
      newCartItems.push(...cartItems);
      newCartItems.push({ prodId: itemid, qty: 1 });
    }
    try {
      const response = await cartModel.modifySingleItem(userid, newCartItems);
      if (response.matchedCount > 0 && response.modifiedCount > 0) {
        res
          .status(200)
          .json({ message: "Product added Successfully into your cart" });
      } else {
        return next(new Error("item not added into cart!"));
      }
    } catch (error) {
      next(error);
    }
  }
};

exports.getCartController = (req, res, next) => {
  let errorMessage = "";
  const error = validationResult(req);
  error.errors.map((item) => {
    errorMessage += "->" + item.msg;
  });
  if (errorMessage.trim().length > 0 && error.errors.length > 0) {
    return next(new Error(errorMessage));
  } else {
    const { userid } = matchedData(req);
    cartModel
      .getCartById(userid)
      .then(({ cartItems }) => {
        if (cartItems) {
          res.status(200).json({ cartItems });
        } else {
          return next(new Error("Some issue fetching cart"));
        }
      })
      .catch((err) => {
        next(err);
      });
  }
};

exports.deleteCartController = async (req, res, next) => {
  let errorMessage = "";
  const error = validationResult(req);
  error.errors.map((item) => {
    errorMessage += "-> " + item.msg;
  });
  if (error.errors.length > 0) {
    return next(new Error(errorMessage));
  } else {
    const { prodId, userid } = matchedData(req);
    // console.log("delete cart id :", prodId);
    const { cartItems } = await cartModel.getCartById(userid);
    // console.log("before delete cart", cartItems);
    const newCartItems = [];
    const productFound = cartItems.find((item) => item?.prodId === prodId);
    if (!productFound) {
      return next(new Error("No product found for this user with this name"));
    } else if (productFound && productFound.qty > 1) {
      productFound.qty -= 1;
      newCartItems.push(productFound);
      const restCartItems = cartItems.filter((item) => item.prodId !== prodId);
      newCartItems.push(...restCartItems);
    } else if (productFound && productFound.qty === 1) {
      const restCartItems = cartItems.filter((item) => item.prodId !== prodId);
      newCartItems.push(...restCartItems);
    }
    // console.log("after delete cart", newCartItems);
    try {
      const response = await cartModel.modifySingleItem(userid, newCartItems);
      if (response.matchedCount > 0 && response.modifiedCount > 0) {
        res.status(200).json({ message: "cart item deleted successfully" });
      } else {
        return next(new Error("item not deleted from cart!"));
      }
    } catch (error) {
      next(error);
    }
  }
};
