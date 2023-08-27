const { header } = require("express-validator");
const authModel = require("../model/authModel");
const {
  getOrderCtrl,
  postOrderCtrl,
} = require("../controller/orderController");

const orderRouter = require("express").Router();

orderRouter.get(
  "/get-order",
  [
    header("userid", "user id not found")
      .trim()
      .notEmpty()
      .custom(async (value) => {
        const response = await authModel.getUserById(value);
        if (!response) {
          throw new Error("User not valid");
        }
      }),
  ],
  getOrderCtrl
);

orderRouter.post(
  "/post-order",
  [
    header("userid", "user id not found")
      .trim()
      .notEmpty()
      .custom(async (value) => {
        const response = await authModel.getUserById(value);
        if (!response) {
          throw new Error("User not valid");
        }
      }),
  ],
  postOrderCtrl
);

exports.orderRouter = orderRouter;
