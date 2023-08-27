const { validationResult, matchedData } = require("express-validator");
const { orderModel } = require("../model/orderModel");
const { cartModel } = require("../model/cartModel");

exports.getOrderCtrl = (req, res, next) => {
  let errorMessage = "";
  const error = validationResult(req);
  error.errors.map((item) => {
    errorMessage += "-> " + item.msg;
  });
  if (errorMessage.trim().length > 0 && error.errors.length > 0) {
    console.log(error);
    return next(new Error(errorMessage));
  } else {
    const { userid } = matchedData(req);
    console.log("userid for get cart", userid);
    try {
      orderModel.getAllOrders(userid).then((orderResponse) => {
        if (orderResponse) {
          res.status(200).json({
            message: "Successfull",
            orderItems: orderResponse?.orderItems,
          });
        } else {
          return next(new Error("some issue in fetching order"));
        }
      });
    } catch (error) {
      next(error);
    }
  }
};

exports.postOrderCtrl = (req, res, next) => {
  console.log("req body", req?.body);
  const { userid } = matchedData(req);
  if (req.body && userid) {
    //db operation
    try {
      orderModel.postOrderUpdate(userid, req?.body).then((response) => {
        if (response) {
          cartModel
            .removeCartAfterOrderSuccessfull(userid)
            .then((cartResponse) => {
              res.status(200).json({ message: "Order successfull!" });
            });
        } else {
          return next(new Error("Order unsuccessfull!"));
        }
      });
    } catch (error) {
      return next(error);
    }
  } else {
    next(new Error("nothing in the cart item"));
  }
};
