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
const multer = require("multer");

const app = express();

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


app.use(body_parser.json());
app.use(express.static(path.join("store", "images")));

app.use(multer({storage : storage , fileFilter : fileFilter}).single("imageUrl"))

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

app.post("/upload-image" ,isAuth,(req,res,next) => {
  console.log("upload image", req.isAuth)
  console.log("upload image", req.body);
  console.log("upload image", req.file);
  if(!req.isAuth){
    const err = new Error("User not Authorized!")
    err.statusCode = 401;
    return next(err);
  }
  res.status(200).json({filename : req?.file?.originalname})
})  

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
  console.log("backend error", err?.message, err?.statusCode);
  const status = err?.statusCode || 500;
  const message = err?.message || "Backend Error";
  res.status(status).json({ message: message });
});

MongoConnect(() => {
  app.listen(8080, () => {
    console.log(`server running on port 8080`);
  });
});
