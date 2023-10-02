const { errorNames } = require("../constants/constant");
const { cartModel } = require("../model/cartModel");
const { orderModel } = require("../model/orderModel");

exports.sendOrderController = async ({ input }, req) => {
  if (!req.isAuth) {
    const err = new Error("User not Authorized");
    err.statusCode = 404;
    throw err;
  }
  const userId = req?.userId;
  try {
    const response = await orderModel.postOrderUpdate(userId, input?.product);
    if (response.modifiedCount === 1 && response.matchedCount === 1) {
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
};

exports.getAllOrderController = async ({ page }, req) => {
  if (!req.isAuth) {
    const err = new Error(errorNames.UNAUTHORIZED);
    err.statusCode = 404;
    throw err;
  }
  const userid = req.userId;
  try {
    const orderResponse = await orderModel.getAllOrders(userid);
    if (orderResponse) {
      return {
        message: "Successfull",
        orderItems: orderResponse?.orderItems,
      };
    } else {
      return {
        message: "No Order Found",
        orderItems: [
          {
            orderAt: "",
            items: [
              {
                _id: "",
                title: "",
                price: "",
                description: "",
                imageUrl: "",
                qty: 0,
              },
            ],
          },
        ],
      };
    }
  } catch (error) {
    throw error;
  }
};
