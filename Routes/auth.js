const express = require("express");
const { postLoginCtr } = require("../controller/authController");
const { check, validationResult, matchedData } = require("express-validator");
const authModel = require("../model/authModel");

const authRouter = express.Router();

authRouter.post(
  "/login",
  [
    check("email", "Email not found!")
      .trim()
      .notEmpty()
      .custom((value) => {
        return value.includes("@");
      }),
    check("password", "Password should not be empty").notEmpty(),
  ],
  postLoginCtr
);

authRouter.post("/signUp", (req, res, next) => {
  const { email, password } = req.body;
  console.log("EMAIL", email);
  console.log("PASSWORD", password);
  res.status(201).json({ message: "Succesfully Signed Up!" });
});

exports.authRouter = authRouter;
