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
  getAllOrders: async ({ page }, req) => {
    if (!req.isAuth) {
      throw new Error("User not Authorized!");
    }
    console.log("page no ", page);
    const userid = req.userId;
    try {
      const orderResponse = await orderModel.getAllOrders(userid);
      if (orderResponse) {
        return {
          message : "Successfull",
          orderItems : orderResponse?.orderItems
        }
      } else {
        console.log("Nothing in order Items");
        // return next(new Error("some issue in fetching order"));
      }
    } catch (error) {
      console.log("error", error);
    }

    return {
      message: "Hello ",
      orderItems: [
        {
          _id: "demoId",
          title: "demoTitle",
          price: "demoPrice",
          description: "demoDescription",
          imageUrl: "demoUrl",
          qty: 1,
        },
      ],
    };
  },

  getSingleProductById : async ({prodId},req) => {
    if(!req.isAuth){
      throw new Error("User not Authorized!")
    }
    try {
      const product = await prodModel.getProductById(prodId);
      if(!product) {
        throw new Error("No product found with this id")
      }
      console.log("Product",product);
      return product
    } catch (error) {
      throw error
    }
  }
};

module.exports = resolvers;
