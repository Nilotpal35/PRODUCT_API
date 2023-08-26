const { header } = require("express-validator");
const {
  addCartController,
  getCartController,
} = require("../controller/cartController");

const cartRouter = require("express").Router();

cartRouter.post(
  "/add-cart",
  [
    header("itemid", "item Id not matched").trim().notEmpty(),
    header("userid", "User not found").trim().notEmpty(),
  ],
  addCartController
  //   (req, res, next) => {
  //     console.log("add cart backend", req.headers);
  //   }
);

cartRouter.get(
  "/cart",
  [header("userid", "User not found").trim().notEmpty()],
  getCartController
);

exports.cartRouter = cartRouter;
