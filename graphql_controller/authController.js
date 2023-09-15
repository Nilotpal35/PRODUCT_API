const validator = require("validator");
const { v4: uuid } = require("uuid");
const { checkEmailValidity } = require("../useful/emailValid");
const authModel = require("../model/authModel");
const { comparePassword } = require("../util/bcrypt");
const { generateToken } = require("../useful/generateToken");

exports.postLoginController = async ({ input }, req) => {
  // console.log("Authentication", req.isAuth);
  // console.log("POST LOGIN FORM", input.email);
  const emailValidation =
    validator.isEmail(input.email) && (await checkEmailValidity(input.email));
  if (!emailValidation) {
    throw new Error("email not valid");
  } else {
    //db operation
    const user = await authModel.checkUserByEmail(input.email);
    const isValidPassword = await comparePassword(
      input.password,
      user.password
    );
    if (!isValidPassword) {
      throw new Error("wrong email or password");
    } else {
      const GENERATED_TOKEN = await generateToken({
        email: input.email,
        name: user.name,
        userId: user._id.toString(),
      });
      if (GENERATED_TOKEN) {
        return {
          status: 200,
          message: `${user.name} Successfully logged in `,
          userName: user.name,
          userToken: user._id,
          token: GENERATED_TOKEN,
        };
      }
    }
  }
};

exports.postSignupController = ({ input }) => {
  // console.log("POST SIGNUP FORM", input);
  let errorMessage = "";
  const nameValidation = validator.isLength(input.name, { min: 5 });
  const emailValidation = validator.isEmail(input.email);
  const passwordValidation =
    !validator.isEmpty(input.password) &&
    validator.equals(input.password, input.cnfPassword) &&
    validator.isLength(input.password, { min: 6 });
  if (!nameValidation) {
    errorMessage += "Name must be of more than 5 char";
  }
  if (!passwordValidation) {
    errorMessage += "Password not matched";
  }
  if (!emailValidation) {
    errorMessage += "Email not correct";
  }
  // // console.log("emailvalidation", emailValidation);
  // // console.log("namevalidation", nameValidation);
  // // console.log("Password Validation", passwordValidation);

  if (nameValidation && emailValidation && passwordValidation) {
    return "Sign Up successfully";
  } else {
    throw new Error(errorMessage);
  }
};
