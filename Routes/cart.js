const { header } = require("express-validator");
const { addCartController } = require("../controller/cartController");

const cartRouter = require("express").Router();

cartRouter.post(
  "/add-cart",
    [
      header("cartid", "Cart Id not matched").trim().notEmpty(),
      header("userid", "User not found").trim().notEmpty(),
    ],
    addCartController
//   (req, res, next) => {
//     console.log("add cart backend", req.headers);
//   }
);

exports.cartRouter = cartRouter;
