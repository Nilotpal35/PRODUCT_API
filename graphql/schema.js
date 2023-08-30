const { buildSchema } = require("graphql");

const schema = buildSchema(`
    input setMessageInput {
        author : String!
        content : String!
    }

    input updateMessageInput {
        auhtor : String!
        content : String!
    }


    type Query {
        getMessage(id : ID!) : String
    }

    type Mutation {
        setMessage(input : setMessageInput ) : String
        updateMessage(id : ID! , input : updateMessageInput) : String
    }
`);

module.exports = schema;
