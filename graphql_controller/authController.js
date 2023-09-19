const validator = require("validator");
const { v4: uuid } = require("uuid");
const { checkEmailValidity } = require("../useful/emailValid");
const authModel = require("../model/authModel");
const {
  comparePassword,
  generateBcryptHashPawsword,
} = require("../util/bcrypt");
const { generateToken } = require("../useful/generateToken");
const { cartModel } = require("../model/cartModel");
const { orderModel } = require("../model/orderModel");

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

exports.postSignupController = async ({ input }) => {
  console.log("input form", input);
  // input validation using validator.js
  let errorMessage = "";
  const nameValidation = validator.isLength(input.name, { min: 5 });
  const emailValidation = validator.isEmail(input.email);
  const passwordValidation =
    !validator.isEmpty(input.password) &&
    validator.equals(input.password, input.cnfPassword) &&
    validator.isLength(input.password, { min: 6 });
  const dobValidation = validator.isDate(input.dob);

  if (!dobValidation) {
    errorMessage += "Date must be in YYYY-MM-DD format";
  }
  if (!nameValidation) {
    errorMessage += "Name must be of more than 5 char";
  }
  if (!passwordValidation) {
    errorMessage += "Password not matched";
  }
  if (!emailValidation) {
    errorMessage += "Email not correct";
  }
  if (
    nameValidation &&
    emailValidation &&
    passwordValidation &&
    dobValidation
  ) {
    try {
      const hashPwd = await generateBcryptHashPawsword(input.password, 10);
      console.log("HASH PASSWORD", hashPwd);
      const formData = {
        name: input.name,
        email: input.email,
        dob: input.dob,
        password: hashPwd,
      };
      const authResponse = await authModel.storeNewUser(formData);
      console.log("AUTH RESPONSE", authResponse);
      if (!authResponse.insertedId) {
        errorMessage += "Some issue while storing the user";
        throw new Error(errorMessage);
      }
      const cartResponse = await cartModel.initiateCart({
        userId: authResponse?.insertedId.toString(),
        cartItems: [],
      });
      console.log("CART RESPONSE AFTET AUTH", cartResponse);
      if (!cartResponse.insertedId) {
        errorMessage += "some issue in initiating cartItems";
        throw new Error(errorMessage);
      }
      const orderResponse = await orderModel.initiateOrder({
        userId: authResponse?.insertedId.toString(),
        orderItems: [],
      });
      console.log("ORDER RESPONSE AFTER CART", orderResponse);
      if (!orderResponse.insertedId) {
        errorMessage += "some issue in initiating orderItems";
        throw new Error(errorMessage);
      }
      return { message: "Sign Up successfull" };
    } catch (err) {
      throw err;
    }
  } else {
    const err = new Error(errorMessage);
    err.statusCode = 422;
    throw err;
  }
};
