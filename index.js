const express = require("express");
const body_parser = require("body-parser");
const multer = require("multer");
const path = require("path");
const { adminRouter } = require("./Routes/admin");


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join("images"));
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

const app = express();

app.use(body_parser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000"); // Replace with your frontend's domain
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});

// app.get("/posts", (req, res, next) => {
//   res.status(200).json({
//     title: "Nilotpal",
//     Content: "This is me bro!",
//     message: "Successfull",
//   });
// });

// app.post("/posts", (req, res, next) => {
//   try {
//     console.log("UPCOMING DATA", req.body?.title);
//     res.status(200).json({ message: "Successfully", title: req.body?.title });
//   } catch (error) {
//     next(error);
//   }
// });

app.use("/", adminRouter)
// app.post("/fileUpload", upload.single("imageUrl"), (req, res, next) => {
//   //   console.log("OTHER DATA ", req.body?.title);
//   console.log("FILE ", req.body);
//   console.log("FILE ", req.file);

//   if (req?.file) {
//     res.status(200).json({ message: "File Uploaded Successfully!" });
//   } else {
//     next(new Error("File not found "));
//   }
// });

app.use((err, req, res, next) => {
  console.log("backend error", err?.message);
  res.status(404).json({ error : err?.message });
});

app.listen(8080, () => {
  console.log(`server running on port 8080`);
});
