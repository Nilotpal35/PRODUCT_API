const express = require("express");
const { check, validationResult } = require("express-validator");
const multer = require("multer");
// const multerUtil = require("../util/multer");
const path = require("path");
const {
  postAddProduct,
  postEditProduct,
} = require("../controller/adminController");
const prodModel = require("../model/productModel");

const adminRouter = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join("store", "images"));
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [".png", ".jpg", ".jpeg", ".gif", ".avif"];
  if (allowedTypes.includes(path.extname(file.originalname))) {
    cb(null, true);
  } else {
    cb(new Error("FILE TYPE NOT ALLOWED"));
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

adminRouter.post(
  "/add-product",
  upload.single("imageUrl"),
  [
    check("_id", "Id should be emoty in add product field").trim().isEmpty(),
    check("title", "Title should be more than 4 char")
      .trim()
      .notEmpty()
      .isString()
      .custom((value) => {
        return value.length > 4;
      }),
    check("price", "Price should be greater than 5")
      .isDecimal()
      .custom((value) => {
        return +value > 5;
      }),
    check("description", "Description should be more than 5 character")
      .trim()
      .notEmpty()
      .isString()
      .custom((value) => {
        return value.length > 5;
      }),
  ],
  postAddProduct
);

adminRouter.post(
  "/edit-product",
  upload.single("imageUrl"),
  [
    check("_id", "Id not valid")
      .trim()
      .notEmpty()
      .custom(async (value) => {
        const prod = await prodModel.getProductById(value);
        console.log("Prod", prod);
        if (prod) {
          return true;
        } else {
          throw new Error("ID not found");
        }
      }),
    check("title", "Title should be more than 4 char")
      .trim()
      .notEmpty()
      .isString()
      .custom((value) => {
        return value.length > 4;
      }),
    check("price", "Price should be greater than 5")
      .isDecimal()
      .custom((value) => {
        return +value > 5;
      }),
    check("description", "Description should be more than 5 character")
      .trim()
      .notEmpty()
      .isString()
      .custom((value) => {
        return value.length > 5;
      }),
  ],
  postEditProduct
);

exports.adminRouter = adminRouter;
