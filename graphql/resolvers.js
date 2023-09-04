const {
  postLoginController,
  postSignupController,
} = require("../graphql_controller/authController");
const {
  postAddCartController,
  postCartItemController,
  postDeleteCartController,
} = require("../graphql_controller/cartController");
const {
  postProductController,
} = require("../graphql_controller/productController");
const { cartModel } = require("../model/cartModel");
const prodModel = require("../model/productModel");

const resolvers = {
  postLogin: postLoginController,

  postProducts: postProductController,

  postSignup: postSignupController,

  postAddCart: postAddCartController,

  postCartItems: postCartItemController,

  postDeleteCart: postDeleteCartController,

  postOrder: async ({ input }, req) => {
    console.log("post order input data", input);
    return {
      message: "Order Successfull",
      status: 200,
    };
  },
};

module.exports = resolvers;
