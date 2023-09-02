const {
  postLoginController,
  postSignupController,
} = require("../graphql_controller/authController");
const {
  postProductController,
} = require("../graphql_controller/productController");
const { cartModel } = require("../model/cartModel");

const resolvers = {
  postLogin: postLoginController,

  postProducts: postProductController,

  postSignup: postSignupController,

  postAddCart: async ({ input }, req) => {
    console.log("INPUT ", input);
    //start
    if (req.isAuth) {
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
};

module.exports = resolvers;
