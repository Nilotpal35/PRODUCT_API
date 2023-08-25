const { validationResult, matchedData } = require("express-validator");

exports.addCartController = (req, res, next) => {
  let errorMessage = "";
  const error = validationResult(req);
  error.errors.map((item) => {
    errorMessage += "->" + item.msg;
  });
  if (errorMessage.trim().length > 0 && error.errors.length > 0) {
    return next(new Error(errorMessage));
  } else {
    console.log("MATCHED DATA In add cart contrller", matchedData(req));
    res
      .status(200)
      .json({ message: "Product added Successfully into your cart" });
  }
};
