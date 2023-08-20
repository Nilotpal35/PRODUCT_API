const express = require("express");
const { check, validationResult } = require("express-validator");
const multer = require("multer");
// const multerUtil = require("../util/multer");
const path = require("path");

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
  const allowedTypes = [".png", ".jpg", ".jpeg", ".gif"];
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
    check("title", "Title should be more than 4 char")
      .trim()
      .notEmpty()
      .isAlphanumeric().custom((value) => {
        return value.length > 4
      }),
    check("price", "Price should be greater than 5")
      .isDecimal()
      .custom((value) => {
        return +value > 5;
      }),
    check("description", "Description should be more than 5 character")
      .trim()
      .notEmpty()
      .isAlphanumeric().custom((value) => {
        return value.length > 5
      }),
  ],
  (req, res, next) => {
    console.log("REQ BODY", req.body);
    console.log("REQ FILE", req.file);
    console.log("SESSION",req?.session?.userId);ƒ
    let errorMessage = "";
    const error = validationResult(req);
    error.errors.map((item) => {
      errorMessage += "->" + item.msg;
    });
    if (errorMessage.trim().length > 0 && error.errors.length > 0) {
      return next(new Error(errorMessage));
    } else {
      if (req.file) {
        res.status(200).json({ message: "FILE UPLOADED SUCCESSFULLY" });
      } else {
        next(new Error("FILE NOT PRESENT"));
      }
    }
  }
);

exports.adminRouter = adminRouter;
