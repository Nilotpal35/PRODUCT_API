const { header, param } = require("express-validator");
const {
  addCartController,
  getCartController,
  deleteCartController,
} = require("../controller/cartController");
const prodModel = require("../model/productModel");
const { isAuth, isValidUser } = require("../util/isAuth");

const cartRouter = require("express").Router();

cartRouter.post(
  "/add-cart",
  isValidUser,
  [
    header("itemid", "item Id not matched").trim().notEmpty(),
    header("userid", "User not found").trim().notEmpty(),
  ],
  addCartController
  //   (req, res, next) => {
  //     console.log("add cart backend", req.headers);
  //   }
);

cartRouter.delete(
  "/delete-cart/:prodId",
  isValidUser,
  [
    header("userid", "user id field is blank")
      .trim()
      .notEmpty()
      .isAlphanumeric(),
    param("prodId")
      .trim()
      .notEmpty()
      .custom(async (value) => {
        const product = await prodModel.getProductById(value);
        if (!product) {
          throw new Error("item not available in cart!");
        }
      }),
  ],
  deleteCartController
);

cartRouter.get(
  "/cart",
  isValidUser,
  [header("userid", "User not found").trim().notEmpty()],
  getCartController
);

exports.cartRouter = cartRouter;
