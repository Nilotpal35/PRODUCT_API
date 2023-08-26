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
    console.log("old cartitems", cartItems);

    // : [{ prodId: itemid, qty: 1 }];
    console.log("New cart items", nerCartItems);
    // const response = await cartModel.storeSingleItem(userid, newCartItems);
    // console.log("addedcart response", response);
    res
      .status(200)
      .json({ message: "Product added Successfully into your cart" });
    // cartModel
    //   .storeItemInCart(userid, newCartItem)
    //   .then((result) => {
    //     if (result.matchedCount > 0 && result.modifiedCount > 0) {
    //       res
    //         .status(200)
    //         .json({ message: "Product added Successfully into your cart" });
    //     } else {
    //       return next(new Error("item not added into cart!"));
    //     }
    //   })
    //   .catch((err) => {
    //     next(err);
    //   });
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
