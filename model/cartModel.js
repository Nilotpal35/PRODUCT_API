const { ObjectId } = require("mongodb");
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

  // static storeItemInCart(userId, newCartItem) {
  //   console.log("product", newCartItem);
  //   const db = getDb();
  //   return (
  //     db
  //       .collection("carts")
  //       .findOne({ userId: userId })
  //       .then((res) => {
  //         return db
  //           .collection("carts")
  //           .updateOne(
  //             { _id: res._id },
  //             {
  //               $set: {
  //                 ...res,
  //                 cartItems: [...res.cartItems,],
  //               },
  //             }
  //           )
  //           .then((res) => {
  //             //console.log("res in cart model", res);
  //             return res;
  //           });
  //       })
  //       // .updateOne({ userId: userId }, { $set: { cartItems: [itemId] } })

  //       .catch((err) => {
  //         throw err;
  //       })
  //   );
  // }

  static storeSingleItem(userid, modifiedCartItems) {
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
