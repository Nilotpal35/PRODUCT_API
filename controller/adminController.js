const { validationResult, matchedData } = require("express-validator");

exports.postAddProduct = (req, res, next) => {
  console.log("REQ BODY", req.body);
  console.log("REQ FILE", req.file);
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
};

exports.postEditProduct = (req, res, next) => {
  console.log("REQ BODY", req.body);
  console.log("REQ FILE", req.file);
  let errorMessage = "";
  const error = validationResult(req);
  error.errors.map((item) => {
    errorMessage += "->" + item.msg;
  });
  if (errorMessage.trim().length > 0 && error.errors.length > 0) {
    return next(new Error(errorMessage));
  } else {
    const data = matchedData(req);
    //DB operation
    res.status(201).json({ message: "File edited successfully" });
  }
};
