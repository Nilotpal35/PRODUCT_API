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

  static createProduct(formData) {
    const db = getDb();
    return db
      .collection("product")
      .insertOne(formData)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        throw err;
      });
  }

  static updateProduct(prodId, formData) {
    // // console.log("inside update product model", formData);
    const db = getDb();
    return db
      .collection("product")
      .updateOne(
        { _id: new ObjectId(prodId) },
        {
          $set: {
            ...formData,
          },
        }
      )
      .then((res) => {
        // console.log("update product res", res);
        return res;
      })
      .catch((err) => {
        throw err;
      });
  }

  static getSingleProductByTitle(text) {
    const searchText = new RegExp(`${text}`);
    console.log("search text regex", searchText);
    const db = getDb();
    return db
      .collection("product")
      .find({ title: searchText })
      .toArray()
      .then((res) => {
        console.log(res);
        return res;
      })
      .catch((err) => {
        throw err;
      });
  }
};
