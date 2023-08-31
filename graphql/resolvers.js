const validator = require("validator");
const { v4: uuid } = require("uuid");

const resolvers = {
  postLogin: (args) => {
    console.log("POST LOGIN FORM", args);
    return { token: "dfgdg54rtgrgrtghreg435fgd" };
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
