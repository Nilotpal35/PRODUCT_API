const { buildSchema } = require("graphql");

const schema = buildSchema(`
    input postLoginForm {
        userName : String!
        password : String!
    }

    type loginReturn {
        token : String
    }

    input postSignupForm {
        name : String!
        email : String!
        dob : String!
        password : String!
        cnfPassword : String!
    }

    type Query {
        postLogin(input : postLoginForm) : loginReturn
    }

    type Mutation {
        postSignup(input : postSignupForm) : String
    }
`);

module.exports = schema;
