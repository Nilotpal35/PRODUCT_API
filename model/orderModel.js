const { getDb } = require("../util/database");

exports.orderModel = class orderModel {
  static initiateOrder(formData) {
    const db = getDb();
    return db
      .collection("orders")
      .insertOne(formData)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        throw err;
      });
  }

  static postOrderUpdate(userId, formData) {
    const db = getDb();
    return (
      db
        .collection("orders")
        .findOne({ userId: userId })
        .then((res) => {
          if (res) {
            return db
              .collection("orders")
              .updateOne(
                { userId: userId },
                {
                  $set: {
                    orderItems: [
                      ...res.orderItems,
                      { orderAt: new Date().toISOString(), items: formData },
                    ],
                  },
                }
              )
              .then((res) => {
                console.log("order response ", res);
                return res;
              });
          }
        })
        // .insertOne({ oderAt: new Date().toISOString(), formData })
        .catch((err) => {
          throw err;
        })
    );
  }

  static getAllOrders(userid) {
    const db = getDb();
    return db
      .collection("orders")
      .findOne({ userId: userid })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        throw err;
      });
  }
};
