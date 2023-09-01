require("dotenv").config();
const JWT = require("jsonwebtoken");

exports.generateToken = (data) => {
  return JWT.sign(data, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};
