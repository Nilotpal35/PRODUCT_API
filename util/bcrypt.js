const bcrypt = require("bcrypt");

exports.generateBcryptHashPawsword = async (password, saltRounds) => {
  const hash = await bcrypt.hash(password, saltRounds);
  return hash;
};

exports.comparePassword = async (password, hash) => {
  const matchedResult = await bcrypt.compare(password, hash);
  console.log("matchedResult", matchedResult);
  return matchedResult;
};
