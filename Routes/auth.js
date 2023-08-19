const express = require("express");

const authRouter = express.Router();

authRouter.post("/login", (req, res, next) => {
  const { email, password } = req.body;
  console.log("EMAIL", email);
  console.log("PASSWORD", password);
  res.status(201).json({ message: "Succesfully logged in!" });
});

authRouter.post("/signUp", (req, res, next) => {
  const { email, password } = req.body;
  console.log("EMAIL", email);
  console.log("PASSWORD", password);
  res.status(201).json({ message: "Succesfully Signed Up!" });
});

exports.authRouter = authRouter;
