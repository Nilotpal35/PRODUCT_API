const path = require("path");
const { productController } = require("../controller/productController");
const fs = require("fs");
const { isAuth } = require("../util/isAuth");

const productRouter = require("express").Router();

productRouter.get("/products", isAuth, productController);

productRouter.get("/image/:image", (req, res, next) => {
  const imageName = req.params.image;
  const imagePath = path.join("store", "images", imageName);
  if (fs.existsSync(imagePath)) {
    const imageStream = fs.createReadStream(imagePath);
    imageStream.pipe(res);
  } else {
    res.status(401).json({ message: "Image not found!" });
  }
});

exports.productRouter = productRouter;
