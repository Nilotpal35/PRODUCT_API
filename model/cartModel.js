const { getDb } = require("../util/database");

exports.cartModel = class cartModel {
  static initiateCart(formData) {
    const db = getDb();
    db.collection("carts")
      .insertOne(formData)
      .then((res) => {
        console.log("carts res", res);
      })
      .catch((err) => {
        throw err;
      });
  }

  static storeItemInCart(userId, itemId) {
    const db = getDb();
    db.collection("carts")
      .updateOne(
        { _id: userId },
        { $set: { cartItems: [...cartItems, itemId] } }
      )
      .then((res) => {
        console.log("update cart response",res);
      })
      .catch((err) => {
        throw err;
      });
  }
};
