require("dotenv").config();
const jwt = require("jsonwebtoken");

exports.isAuth = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    req.isAuth = false;
    return next();
  }
  const token = authHeader.split(" ")[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    req.isAuth = false;
    return next();
  }
  if (!decodedToken) {
    req.isAuth = false;
    return next();
  }
  req.userId = decodedToken.userId;
  req.isAuth = true;
  next();
};

// const AuthToken = req.get("Authorization");
//   let token;
//   let decodedToken;
//   if (AuthToken) {
//     token = AuthToken.split(" ")[1];
//   }
//   console.log("JWT TOKEN", token);
//   try {
//     decodedToken = jwt.verify(token, process.env.JWT_SECRET);
//     if (!decodedToken) {
//       const error = new Error("User Not Autherized!");
//       error.statusCode = 401;
//       //throw new Error("User Not Autherized!");
//       req.isAuth = false;
//     } else {
//       req.isAuth = true;
//       req.userId = decodedToken.userId;
//     }
//   } catch (error) {
//     throw error;
//   }
//   next();
