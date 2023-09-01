const authModel = require("../model/authModel");

exports.checkEmailValidity = async (email) => {
  const validUser = await authModel.checkUserByEmail(email);
  if (validUser) {
    return true;
  } else {
    return false;
  }
};


