const { cartModel } = require("../model/cartModel");
const prodModel = require("../model/productModel");

exports.postAddCartController = async ({ input }, req) => {
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
};



exports.postCartItemController = async ({ userId }, req) => {
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
};



exports.postDeleteCartController = async ({ prodId }, req) => {
  if (!req.isAuth) {
    throw new Error("User not Authorized!");
  }
  console.log("input items", prodId);
  const userId = req?.userId;
  try {
    const { cartItems } = await cartModel.getCartById(userId);
    console.log("before delete cart", cartItems);
    const newCartItems = [];
    const productFound = cartItems.find((item) => item?.prodId === prodId);
    if (!productFound) {
      throw new Error("No product found for this user with this name");
    } else if (productFound && productFound.qty > 1) {
      productFound.qty -= 1;
      newCartItems.push(productFound);
      const restCartItems = cartItems.filter((item) => item.prodId !== prodId);
      newCartItems.push(...restCartItems);
    } else if (productFound && productFound.qty === 1) {
      const restCartItems = cartItems.filter((item) => item.prodId !== prodId);
      newCartItems.push(...restCartItems);
    }
    console.log("after delete cart", newCartItems);
    const response = await cartModel.modifySingleItem(userId, newCartItems);
    if (response.matchedCount > 0 && response.modifiedCount > 0) {
      return { message: "cart item deleted successfully", status: 200 };
    } else {
      return { messsage: "item not deleted from cart!", status: 400 };
    }

    // return {
    //   message: "Item deleted Successfully",
    //   status: 200,
    // };
  } catch (error) {
    throw new Error(error?.message || "Backend Error");
  }
};
