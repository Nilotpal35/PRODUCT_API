const { ObjectId } = require("mongodb");
const { getDb } = require("../util/database");

module.exports = class prodModel {
  static getAllProducts(page, perPage) {
    const db = getDb();
    try {
      return db
        .collection("product")
        .find()
        .skip((page - 1) * perPage)
        .limit(perPage)
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
        return res;
      })
      .catch((err) => {
        throw err;
      });
  }

  static getTotalDocuments() {
    const db = getDb();
    return db
      .collection("product")
      .countDocuments()
      .then((res) => {
        return res;
      })
      .catch((err) => {
        throw err;
      });
  }
};
