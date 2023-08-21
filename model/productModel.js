const { ObjectId } = require("mongodb");
const { getDb } = require("../util/database");

module.exports = class prodModel {
  static getAllProducts() {
    const db = getDb();
    try {
      return db
        .collection("product")
        .find()
        .toArray()
        .then((res) => {
          return res;
        })
        .catch((err) => {
          throw err;
        });
    } catch (error) {
      throw error;
    }
  }

  static getProductById(prodId) {
    const db = getDb();
    return db
      .collection("product")
      .findOne({ _id: new ObjectId(prodId) })
      .then((res) => {
        console.log("FIND PRODUCT BY ID", res);
        return res;
      })
      .catch((err) => {
        throw err;
      });
  }
};
