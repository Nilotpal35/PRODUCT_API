const { validationResult, matchedData } = require("express-validator");
const authModel = require("../model/authModel");

exports.postLoginCtr = async (req, res, next) => {
  let errorMessage = "";
  const error = validationResult(req);
  error.errors.map((item) => {
    errorMessage += "-> " + item.msg;
  });
  if (errorMessage.trim().length > 0 && error.errors.length > 0) {
    return next(new Error(errorMessage));
  } else {
    const data = matchedData(req);
    const { email, password } = data;
    console.log("EMAIL", email);
    console.log("PASSWORD", password);
    try {
      const user = await authModel.checkUserByEmail(email);
      if (!user) {
        return next(new Error("User not found"));
      } else {
        console.log("USER ", user);
        res
          .status(201)
          .json({ message: `${user.name} Succesfully logged in!` });
      }
    } catch (error) {
      next(error);
    }
  }
};
