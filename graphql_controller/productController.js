const prodModel = require("../model/productModel");

exports.postProductController = async ({ page }, req) => {
  // console.log("Authentication", req.isAuth);
  if (!req.isAuth) {
    throw new Error("User not Authorized");
  }
  let PAGE = 1;
  if (page) {
    PAGE = +page;
  }
  let PER_PAGE = 1;
  try {
    const totalPage = await prodModel.getTotalDocuments();

    //generates total no of pages into array form
    const generatedArray = [];
    for (let i = 1; i <= totalPage; i++) {
      generatedArray.push(i);
    }

    const products = await prodModel.getAllProducts(PAGE, PER_PAGE);
    console.log("ALL PRODUCTS", products);
    if (products) {
      return {
        products: products,
        totalPages: generatedArray,
      };
    }
  } catch (error) {
    throw error;
  }
};
