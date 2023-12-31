const prodModel = require("../model/productModel");

exports.productController = async (req, res, next) => {
  const query = req?.query;
  let page = 1;
  // console.log("REQ USER ID", query);
  if (query.page > 1) {
    page = query?.page;
  }
  const perPage = 1;
  try {
    const totalPage = await prodModel.getTotalDocuments();
    const generatedArray = [];

    for (let i = 1; i <= totalPage; i++) {
      generatedArray.push(i);
    }

    const products = await prodModel.getAllProducts(page, perPage);
    // console.log("All products", products);
    if (products) {
      res.status(200).json({ products, totalPage: generatedArray });
    }
  } catch (error) {
    next(error);
  }
};
