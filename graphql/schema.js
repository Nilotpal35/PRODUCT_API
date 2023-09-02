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

    input postAddCartForm {
        userId : String
        prodId : String
    }

    type AddCartMessage {
        message : String
        status : Int
    }

    type RootQuery {
        postLogin(input : postLoginForm) : loginReturn
        postProducts(page : Int) : AllProducts
        
    }

    type RootMutation {
        postSignup(input : postSignupForm) : String
        postAddCart(input : postAddCartForm) : AddCartMessage
    }

    schema {
        query : RootQuery
        mutation : RootMutation
    }
`);

module.exports = schema;
