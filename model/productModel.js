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
          console.log(res);
          return res;
        })
        .catch((err) => {
          throw err;
        });
    } catch (error) {
      throw error;
    }
  }
};
