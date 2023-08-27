const { ObjectId } = require("mongodb");
const { getDb } = require("../util/database");

exports.cartModel = class cartModel {
  static initiateCart(formData) {
    const db = getDb();
    return db
      .collection("carts")
      .insertOne(formData)
      .then((res) => {
        console.log("carts res", res);
        return res;
      })
      .catch((err) => {
        throw err;
      });
  }

  static modifySingleItem(userid, modifiedCartItems) {
    const db = getDb();
    return db
      .collection("carts")
      .findOne({ userId: userid })
      .then((res) => {
        return db
          .collection("carts")
          .updateOne(
            { userId: userid },
            { $set: { cartItems: [...modifiedCartItems] } }
          )
          .then((res) => {
            return res;
          })
          .catch((err) => {
            throw err;
          });
      })
      .catch((err) => {
        throw err;
      });
  }

  static removeCartAfterOrderSuccessfull(userid) {
    const db = getDb();
    return db
      .collection("carts")
      .findOne({ userId: userid })
      .then((res) => {
        return db
          .collection("carts")
          .updateOne({ userId: userid }, { $set: { cartItems: [] } })
          .then((res) => {
            return res;
          })
          .catch((err) => {
            throw err;
          });
      })
      .catch((err) => {
        throw err;
      });
  }

  static getCartById(userId) {
    const db = getDb();
    return db
      .collection("carts")
      .findOne({ userId: userId })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        throw err;
      });
  }
};
