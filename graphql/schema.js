const { buildSchema } = require("graphql");

const schema = buildSchema(`
    input postLoginForm {
        email : String!
        password : String!
    }

    type loginReturn {
        status : Int 
        message : String
        userName : String
        userToken : String
        token : String
    }

    input postSignupForm {
        name : String!
        email : String!
        dob : String!
        password : String!
        cnfPassword : String!
    }

    type product {
        _id : ID
        title : String
        imageUrl : String
        price : String
        description : String
    }

    type AllProducts {
        totalPages : [Int]
        products : [product]
    }

    type Query {
        postLogin(input : postLoginForm) : loginReturn
        postProducts(page : Int) : AllProducts
    }

    type Mutation {
        postSignup(input : postSignupForm) : String
    }
`);

module.exports = schema;
