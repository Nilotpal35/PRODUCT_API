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

    type cartProduct {
        _id : String
        title : String
        price : String
        imageUrl : String
        description : String
        qty : Int
    }

    type cartReturn {
        product : [cartProduct!]!
    }

    input deleteCartForm {
        userId : String
        prodId : String
    }

    input cartForm {
        _id : String
        title : String
        price : String
        imageUrl : String
        description : String
        qty : Int
    }

    input postOrderForm {
        product : [cartForm!]!
    }

    type RootQuery {
        postLogin(input : postLoginForm) : loginReturn!
        postProducts(page : Int) : AllProducts!
        postCartItems(userId : String) : cartReturn!
    }

    type RootMutation {
        postSignup(input : postSignupForm) : String
        postAddCart(input : postAddCartForm) : AddCartMessage!
        postDeleteCart(prodId : String!) : AddCartMessage!
        postOrder(input : [cartForm!]!) : AddCartMessage!
    }

    schema {
        query : RootQuery
        mutation : RootMutation
    }
`);

module.exports = schema;
