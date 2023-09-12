const path = require("path");
const { productController } = require("../controller/productController");
const fs = require("fs");
const { isAuth } = require("../util/isAuth");

const productRouter = require("express").Router();

productRouter.get("/products", productController);

productRouter.get("/image/:image", (req, res, next) => {
  const imageName = req.params.image;
  const imagePath = path.join("store", "images", imageName);
  // console.log("image request coming",imageName,imagePath)
  if (fs.existsSync(imagePath)) {
    const imageStream = fs.createReadStream(imagePath);
    imageStream.pipe(res);
  } else {
    res.status(401).json({ message: "Image not found!" });
  }
});

exports.productRouter = productRouter;
