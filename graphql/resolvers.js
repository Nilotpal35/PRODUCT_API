const validator = require("validator");
const { v4: uuid } = require("uuid");
const { checkEmailValidity } = require("../useful/emailValid");
const authModel = require("../model/authModel");
const { comparePassword } = require("../util/bcrypt");
const { generateToken } = require("../useful/generateToken");
const prodModel = require("../model/productModel");

const resolvers = {
  postLogin: async ({ input }, req) => {
    console.log("Authentication", req.isAuth);
    console.log("POST LOGIN FORM", input.email);
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
  },

  postProducts: async ({ page }, req) => {
    // console.log("Authentication", req.isAuth);
    if (!req.isAuth) {
      throw new Error("User not Authorized");
    }
    let PAGE = 1;
    if (page) {
      PAGE = +page;
    }
    let PER_PAGE = 1;
    try {
      const totalPage = await prodModel.getTotalDocuments();
      //generates total no of pages into array form
      const generatedArray = [];
      for (let i = 1; i <= totalPage; i++) {
        generatedArray.push(i);
      }

      const products = await prodModel.getAllProducts(PAGE, PER_PAGE);
      console.log("ALL PRODUCTS", products);
      if (products) {
        return {
          products: products,
          // .map((item) => ({
          //   ...item,
          //   _id: item._id.toString(),
          //   title: item.title,
          //   price: item.price,
          //   imageUrl: item.imageUrl,
          //   description: item.description,
          // }))
          totalPages: generatedArray,
        };
      }
    } catch (error) {
      throw error;
    }
  },

  postSignup: ({ input }) => {
    console.log("POST SIGNUP FORM", input);
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
    // console.log("emailvalidation", emailValidation);
    // console.log("namevalidation", nameValidation);
    // console.log("Password Validation", passwordValidation);

    if (nameValidation && emailValidation && passwordValidation) {
      return "Sign Up successfull";
    } else {
      throw new Error(errorMessage);
    }
  },

  getMessage: ({ id }) => {
    return `Message from ${id}`;
  },
  setMessage: async (args) => {
    //db operation

    // const fs = require("fs");
    // const path = require("path");
    // const {} = require("uuid");
    // const filePath = path.join("store", "Text", "message.json");
    // fs.readFile(filePath, (err, data) => {
    //   if (err) throw err;
    //   if (data) {
    //     fs.writeFile(filePath, JSON.stringify(data), (err) => {
    //       if (err) throw err;
    //       console.log("ARGS", JSON.stringify(data));
    //     });
    //   }
    // });
    return "New Message Saved";
  },
  updateMessage: ({ id, author, content }) => {
    //db operation
    return `updated Message from ${id} - ${author} => ${content}`;
  },
};

module.exports = resolvers;
