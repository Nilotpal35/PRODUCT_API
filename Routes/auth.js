const express = require("express");
const { postLoginCtr, postSignUpCtr } = require("../controller/authController");
const { check, validationResult, matchedData } = require("express-validator");
const authModel = require("../model/authModel");

const authRouter = express.Router();

authRouter.post(
  "/login",
  [
    check("email", "please enter a proper email id ").trim().isEmail(),
    check("password", "Password should not be empty").notEmpty(),
  ],
  postLoginCtr
);

authRouter.post(
  "/signUp",
  [
    check("name", "Name should be more than 3 char")
      .trim()
      .isString()
      .isLength({ min: 3 }),
    check("dob", "Please fill the date field").trim().isDate(),
    check("email", "Please enter an proper email address")
      .trim()
      .isEmail()
      .custom(async (value) => {
        const user = await authModel.checkUserByEmail(value);
        if (user) {
          throw new Error("Email already in use! try a diffirent one");
        }
      }),
    check("password", "Password should be more than 5 char")
      .trim()
      .trim()
      .isLength({ min: 5 }),
    check("cnfPassword", "Password not matche").custom((value, { req }) => {
      return value === req.body.password;
    }),
  ],
  postSignUpCtr
);

exports.authRouter = authRouter;
