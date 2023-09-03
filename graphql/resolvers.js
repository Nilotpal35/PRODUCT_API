const {
  postLoginController,
  postSignupController,
} = require("../graphql_controller/authController");
const {
  postProductController,
} = require("../graphql_controller/productController");
const { cartModel } = require("../model/cartModel");
const prodModel = require("../model/productModel");

const resolvers = {
  postLogin: postLoginController,

  postProducts: postProductController,

  postSignup: postSignupController,

  postAddCart: async ({ input }, req) => {
    if (!req.isAuth) {
      // return { message: "User Not Authorized", status: 404 };
      throw new Error("User not Authorized");
    }
    const { userId, prodId } = input;
    const { cartItems } = await cartModel.getCartById(userId);
    const newCartItems = [];
    const prodcutFound = cartItems.find((item) => item?.prodId === prodId);
    if (prodcutFound) {
      prodcutFound.qty += 1;
      newCartItems.push(prodcutFound);
      const restCartItems = cartItems.filter((item) => item.prodId !== prodId);
      newCartItems.push(...restCartItems);
    } else {
      newCartItems.push(...cartItems);
      newCartItems.push({ prodId: prodId, qty: 1 });
    }
    try {
      const response = await cartModel.modifySingleItem(userId, newCartItems);
      if (response.matchedCount > 0 && response.modifiedCount > 0) {
        return {
          message: "Product added Successfully into your cart",
          status: 200,
        };
      } else {
        throw new Error("item not added into cart!");
      }
    } catch (error) {
      throw error;
    }
    //end
    // return { message: "item added Successfully", status: 200 };
  },

  postCartItems: async ({ userId }, req) => {
    if (!req.isAuth) {
      throw new Error("User not Authorized!");
      // return {
      //   product: [],
      //   message: "User not Authenticated!",
      //   status: 404,
      // };
    }

    try {
      const cartItems = await cartModel.getCartById(userId);
      const awaitedfinalCartList = cartItems.cartItems.map(async (item) => {
        const prod = await prodModel.getProductById(item.prodId);
        return { ...prod, qty: item.qty };
      });

      const allSettled = await Promise.allSettled(awaitedfinalCartList);
      const finalCartList = allSettled.map((item) => item.value);

      return {
        product: finalCartList,
        message: "Successfull",
        status: 200,
      };
    } catch (error) {
      throw new Error(error?.message || "Backend Error");
      // return {
      //   product: [],
      //   message: error?.message || "Backend Error",
      //   status: error?.status || 500,
      // };
    }
  },

  postDeleteCart: ({ prodId }, req) => {
    // if (!req.isAuth) {
    //   throw new Error("User not Authorized!");
    // }
    console.log("input items", prodId);
    return {
      message: "Item deleted Successfully",
      status: 200,
    };
  },
};

module.exports = resolvers;
