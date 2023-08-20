const { ObjectId } = require("mongodb");
const { getDb } = require("../util/database");

module.exports = class authModel {
  static checkUserByEmail(email) {
    const db = getDb();
    try {
      return db
        .collection("user")
        .findOne({ email: email })
        .then((res) => {
          return res;
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log("ERROR IN CHECK USER BY EMAIL", error.message);
    }
  }

  static getUserById(userId) {
    console.log("USER ID", userId);
    const db = getDb();
    return db
      .collection("user")
      .findOne({ _id: ObjectId(userId.toString()) })
      .then((res) => {
        console.log("res", res);
        return res;
      })
      .catch((err) => {
        console.log(err);
      });
  }
};
