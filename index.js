require("dotenv").config();
const express = require("express");
const body_parser = require("body-parser");
const path = require("path");
const { adminRouter } = require("./Routes/admin");
const { MongoConnect } = require("./util/database");
const { authRouter } = require("./Routes/auth");
const { productRouter } = require("./Routes/product");
const { cartRouter } = require("./Routes/cart");
const { orderRouter } = require("./Routes/order");
const { graphqlHTTP } = require("express-graphql");
const resolvers = require("./graphql/resolvers");
const schema = require("./graphql/schema");
const { isAuth } = require("./util/isAuth");

const app = express();

app.use(body_parser.json());
app.use(express.static(path.join("store", "iamges")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(isAuth);

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: resolvers,
    graphiql: true,
  })
);

app.use("/", authRouter);

app.use("/", productRouter);

app.use("/", cartRouter);

app.use("/", orderRouter);

app.use("/admin", adminRouter);

app.use((req, res, next) => {
  res.status(401).json({ message: "page not found" });
});

app.use((err, req, res, next) => {
  console.log("backend error", err?.message);
  const status = err.status || 500;
  const message = err.message || "Backend Error";
  res.status(status).json({ message: message });
});

MongoConnect(() => {
  app.listen(8080, () => {
    console.log(`server running on port 8080`);
  });
});
