const prodModel = require("../model/productModel");

exports.postProductController = async ({ page }, req) => {
  // // console.log("Authentication", req.isAuth);
  if (!req.isAuth) {
    throw new Error("User not Authorized");
  }
  let PAGE = 1;
  if (page) {
    PAGE = +page;
  }
  let PER_PAGE = 3;
  try {
    const totalPage = await prodModel.getTotalDocuments();

    //generates total no of pages into array form
    const generatedArray = [];
    for (let i = 1; i <= Math.ceil(totalPage / PER_PAGE); i++) {
      generatedArray.push(i);
    }

    const products = await prodModel.getAllProducts(PAGE, PER_PAGE);
    // console.log("ALL PRODUCTS", products);
    // await new Promise(res => setTimeout(res,1000))
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

exports.getSingleProductController = async ({ prodId }, req) => {
  if (!req.isAuth) {
    throw new Error("User not Authorized");
  }
  try {
    const product = await prodModel.getProductById(prodId);
    if (!product) {
      throw new Error("No product found with this id");
    }
    return product;
  } catch (error) {
    throw error;
  }
};

exports.createUpdateProductController = async ({ method, input }, req) => {
  if (!req.isAuth) {
    const err = new Error("User not Authorized");
    err.statusCode = 404;
    throw err;
  }
  if (method.trim() === "") {
    throw new Error("No method found!");
  }
  try {
    if (method === "PATCH") {
      //DO SOME UPDATE IN EXISTING PRODUCT
      const updatedData = {
        title: input.title,
        price: input.price,
        description: input.description,
      };
      if (input.imageUrl.trim().length > 0) {
        updatedData.imageUrl = input.imageUrl;
      }

      const response = await prodModel.updateProduct(input._id, updatedData);
      return {
        message: "product updated successfully",
        status: 201,
      };
    } else if (method === "POST") {
      //CREATE NEW PRODUCT
      const response = await prodModel.createProduct({
        title: input?.title,
        price: input?.price,
        description: input?.description,
        imageUrl: input?.imageUrl,
      });
      return {
        message: "product added successfully",
        status: 201,
      };
    }
  } catch (error) {
    throw error;
  }
};

exports.fetchSearchResult = async ({ searchText }) => {
  console.log("search middlware working fine", searchText);

  try {
    const result = await prodModel.getSingleProductByTitle(searchText);
    console.log("search result from mongodb", result);
    return result;
  } catch (error) {
    throw error;
  }
};
