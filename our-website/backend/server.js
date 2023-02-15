import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import seedRouter from "./routes/seedRoutes.js";
import productRouter from "./routes/productRoutes.js";
import userRouter from "./routes/userRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import path from "path";
import fs from "fs";

//fetch variables in .env file
dotenv.config();
const app = express();
//connect to mongodb data base
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("connected to db");
    fs.readFile("cloths.json", (err, data) => {
      if (err) {
        console.error(err);
        return;
      }

      const products = JSON.parse(data);

      const db = mongoose.connection;
      const collection = db.collection("products");
      products.forEach((product) => {
        collection.insertOne(product, function (err, result) {
          if (err) {
            console.error(err);
            return;
          }
        });
      });
    });
  })
  .catch((err) => {
    console.log(err.message);
  });

//data from post request will convert to json object in req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//api to return clientID for paypal
app.get("/api/keys/paypal", (req, res) => {
  //PAYPAL_CLIENT_ID is a variable in .env file
  res.send(process.env.PAYPAL_CLIENT_ID || "sb");
});

//seedRouter responded to api/seed
app.use('/api/seed', seedRouter);
app.use('/api/products', productRouter);
app.use('/api/users', userRouter);
app.use('/api/orders', orderRouter);

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "/frontend/build")));
//* means that everything the user enter after the server name (website domain) is going to be served by index.html file
app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "/frontend/build/index.html"))
);

//error handler for express
app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).send({ message: err.message });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`serve at http://localhost:${port}`);
});
