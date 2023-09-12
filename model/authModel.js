const { ObjectId } = require("mongodb");
const { getDb } = require("../util/database");

module.exports = class authModel {
  static checkUserByEmail(email) {
    const db = getDb();
    try {
      return db
        .collection("users")
        .findOne({ email: email })
        .then((res) => {
          return res;
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      throw error;
    }
  }

  static getUserById(userId) {
    // console.log("USER ID", userId);
    const db = getDb();
    return db
      .collection("users")
      .findOne({ _id: new ObjectId(userId.toString()) })
      .then((res) => {
        // console.log("res", res);
        return res;
      })
      .catch((err) => {
        throw err;
      });
  }

  static storeNewUser(formData) {
    const db = getDb();
    return db
      .collection("users")
      .insertOne(formData)
      .then((res) => {
        // console.log("res", res);
        return res;
      })
      .catch((err) => {
        throw err;
      });
  }
};
