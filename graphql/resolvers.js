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
const { orderModel } = require("../model/orderModel");
const prodModel = require("../model/productModel");

const resolvers = {
  postLogin: postLoginController,

  postProducts: postProductController,

  postSignup: postSignupController,

  postAddCart: postAddCartController,

  postCartItems: postCartItemController,

  postDeleteCart: postDeleteCartController,

  postOrder: async ({ input }, req) => {
    if (!req.isAuth) {
      const err = new Error("User not Authorized!");
      err.statusCode = 404;
      throw err;
    }
    const userId = req?.userId;
    try {
      const response = await orderModel.postOrderUpdate(userId, input?.product);
      if (response) {
        await cartModel.removeCartAfterOrderSuccessfull(userId);
        return {
          message: "Order successfull!",
        };
      } else {
        return { message: "Order successfull but cart items not deleted!" };
      }
    } catch (error) {
      throw error;
    }
  },
};

module.exports = resolvers;
