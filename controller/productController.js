const prodModel = require("../model/productModel");

exports.productController = async (req, res, next) => {
  try {
    const products = await prodModel.getAllProducts();
    console.log("All products", products);
    if (products) {
      res.status(200).json(products);
    }
  } catch (error) {
    next(error);
  }
};