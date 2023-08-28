const jwt = require("jsonwebtoken");

exports.isAuth = (req, res, next) => {
  const AuthToken = req.get("Authorization");
  let token;
  let decodedToken;
  if (AuthToken) {
    token = AuthToken.split(" ")[1];
  }
  console.log("JWT TOKEN", token);
  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    if (!decodedToken) {
      const error = new Error("User Not Autherized!");
      error.statusCode = 401;
      return next(error);
    } else {
      req.userId = decodedToken.userId;
    }
  } catch (error) {
    return next(error);
  }
  next();
};
