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
  sendOrderController,
  getAllOrderController,
} = require("../graphql_controller/orderGqlController");
const {
  postProductController,
  getSingleProductController,
  createUpdateProductController,
  fetchSearchResult,
} = require("../graphql_controller/productController");
const { cartModel } = require("../model/cartModel");
const { orderModel } = require("../model/orderModel");
const prodModel = require("../model/productModel");

const resolvers = {
  demoMutation: ({ demo }) => {
    console.log("INSIDE DEMO MUTATAION", demo);
    return { message: "Demo Message" };
  },

  demoQuery: ({ demo }) => {
    console.log("INSIDE DEMO QUERY", demo);
    return { message: "Demo Message" };
  },

  postLogin: postLoginController,

  postProducts: postProductController,

  postSignup: postSignupController,

  postAddCart: postAddCartController,

  postCartItems: postCartItemController,

  postDeleteCart: postDeleteCartController,

  postOrder: sendOrderController,

  getAllOrders: getAllOrderController,

  getSingleProductById: getSingleProductController,

  createUpdateProduct: createUpdateProductController,

  getSearchResult: fetchSearchResult,
};

module.exports = resolvers;
