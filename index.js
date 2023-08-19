require("dotenv").config();
const express = require("express");
const body_parser = require("body-parser");
const path = require("path");
const { adminRouter } = require("./Routes/admin");
const { MongoConnect } = require("./util/database");
const session = require("express-session");
const { authRouter } = require("./Routes/auth");
const MongoDbStore = require("connect-mongodb-session")(session);

const app = express();

app.use(body_parser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});

const store = new MongoDbStore({
  uri: process.env.MONGODB_URI,
  databaseName: "shop",
  collection: "user",
});

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    store: store,
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 2,
    },
  })
);

app.use("/admin", adminRouter);

app.use("/", authRouter);

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
