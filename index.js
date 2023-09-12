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
const { isAuth, isValidUser } = require("./util/isAuth");
const multer = require("multer");
const helmet = require("helmet");
const fs = require("fs");
// const compression = require("compression");
// const cors = require("cors");
const morgan = require("morgan");
const { fetchSearchResult } = require("./graphql_controller/productController");
const prodModel = require("./model/productModel");

const app = express();

const PORT = process.env.PORT || 8080;

//file upload with multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join("store", "images"));
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [".png", ".jpg", ".jpeg", ".gif", ".avif"];
  if (allowedTypes.includes(path.extname(file.originalname))) {
    cb(null, true);
  } else {
    cb(new Error("FILE TYPE NOT ALLOWED"));
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });
const appLogStream = fs.createWriteStream(path.join(__dirname, "access.log"), {
  flags: "a",
});

app.use(body_parser.json());
app.use(express.static(path.join("store", "images")));

app.use(morgan("combined", { stream: appLogStream }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Methods", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use("/serverHealth", (req, res, next) => {
  console.log("api endpoint triggering");
  res.status(200).json({ message: "Server is Up" });
});

app.get("/searchResult", fetchSearchResult);

app.post(
  "/upload-image",
  isValidUser,
  upload.single("imageUrl"),
  (req, res, next) => {
    if (!req?.isAuth) {
      fs.unlinkSync(path.join("store", "images", req?.file.originalname));
      const err = new Error("User not Authorized!");
      err.statusCode = 401;
      return next(err);
    }
    res.status(200).json({ filename: req?.file?.originalname });
  }
);

app.use(isAuth);

//GRAPHQL API Endpoint
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: resolvers,
    graphiql: true,
  })
);

//REST API endpoint
app.use("/", authRouter);

app.use("/", productRouter);

app.use("/", cartRouter);

app.use("/", orderRouter);

app.use("/admin", adminRouter);

app.use((req, res, next) => {
  res.status(404).json({ message: "page not found" });
});

//catch any error thrown
app.use((err, req, res, next) => {
  const status = err?.statusCode || 500;
  const message = err?.message || "Backend Error";
  res.status(status).json({ message: message });
});

MongoConnect(() => {
  app.listen(PORT, () => {
    console.log(`server running on port 8080`);
  });
});

process.on("SIGINT", () => {
  console.log("Server is shutting down!");

  process.exit(0);
});
