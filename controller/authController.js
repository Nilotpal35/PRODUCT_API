require("dotenv");
const { validationResult, matchedData } = require("express-validator");
const authModel = require("../model/authModel");
const {
  generateBcryptHashPawsword,
  comparePassword,
} = require("../util/bcrypt");
const { cartModel } = require("../model/cartModel");
const { orderModel } = require("../model/orderModel");
const jwt = require("jsonwebtoken");

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
    // console.log("EMAIL", email);
    // console.log("PASSWORD", password);
    try {
      const user = await authModel.checkUserByEmail(email);
      if (!user) {
        return next(new Error("User not found"));
      } else {
        // console.log("USER ", user);
        const compResult = await comparePassword(password, user.password);
        if (compResult) {
          const token = jwt.sign(
            {
              email: user.email,
              userId: user._id.toString(),
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
          );
          if (token) {
            res.status(200).json({
              message: `${user.name} Succesfully logged in!`,
              userToken: user?._id,
              userName: user?.name,
              token,
            });
          } else {
            return next(new Error("Token not generated"));
          }
        } else {
          return next(new Error("wrong email or password"));
        }
      }
    } catch (error) {
      next(error);
    }
  }
};

exports.postSignUpCtr = async (req, res, next) => {
  let errorMessage = "";
  const error = validationResult(req);
  error.errors.map((item) => {
    errorMessage += "-> " + item.msg;
  });
  if (errorMessage.trim().length > 0 && error.errors.length > 0) {
    return next(new Error(errorMessage));
  } else {
    const data = matchedData(req);
    const { name, dob, email, password, cnfPassword } = data;
    try {
      const hashPwd = await generateBcryptHashPawsword(password, 10);
      // console.log("HASH PASSWORD", hashPwd);
      const formData = {
        name,
        email,
        dob,
        password: hashPwd,
      };
      const response = await authModel.storeNewUser(formData);
      // console.log("response data", response);
      if (response?.insertedId) {
        cartModel
          .initiateCart({
            userId: response?.insertedId.toString(),
            cartItems: [],
          })
          .then((result) => {
            orderModel
              .initiateOrder({
                userId: response?.insertedId.toString(),
                orderItems: [],
              })
              .then((result) => {
                res.status(201).json({ message: "Succesfully Signed Up!" });
              });
          });
      }
    } catch (error) {
      return next(error);
    }
  }
};
