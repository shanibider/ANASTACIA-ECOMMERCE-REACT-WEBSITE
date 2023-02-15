import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import seedRouter from './routes/seedRoutes.js';
import productRouter from './routes/productRoutes.js';
import userRouter from './routes/userRoutes.js';
import orderRouter from './routes/orderRoutes.js';
import path from 'path';
import fs from 'fs';

//fetch variables in .env file
dotenv.config();

const app = express();

/*SCRAPING*/
//connect to mongodb data base,
//read data from cloths.json file and save it in mongodb

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    //scrapping data from website and save it in mongodb
    console.log('connected to db');
    fs.readFile('cloths.json', (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      const products = JSON.parse(data);

      const db = mongoose.connection;
      const collection = db.collection('products');

      products.forEach((product) => {
        collection.insertOne(product, function (err) {
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

/*SCRAPPING EXPLENATION:
1. mongoose.connect(process.env.MONGODB_URI) connects to the MongoDB database using the URI specified in the MONGODB_URI environment variable. 
2. The .then() function is called after the database connection is established. 
3. The code inside the .then() function reads data from a file named "cloths.json" using the fs library, which is a built-in Node.js library for working with the file system.
4. If the file is read successfully, the code parses the data in the file as JSON and stores it in a variable called 'products'.
5. Then the code gets a reference to the MongoDB database using mongoose.connection.
6. The collection variable is used to access the "products" collection in the database.
7. A loop is used to iterate over each product in the products array, and the insertOne() function is called to add the product to the "products" collection in the database.
*/

//data from post request will convert to json object in req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//this method has 2 parameters- first is the path we are going to serve, second is the function that respond to this api
//when user go to this address we need to return products to frontend (to user)
//api to return clientID for paypal
app.get('/api/keys/paypal', (req, res) => {
  //sending data
  //PAYPAL_CLIENT_ID is a variable in .env file
  res.send(process.env.PAYPAL_CLIENT_ID || 'sb');
});

//each component has its own router
app.use('/api/seed', seedRouter); //seedRouter responded to api/seed
app.use('/api/products', productRouter);
app.use('/api/users', userRouter);
app.use('/api/orders', orderRouter);

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, '/frontend/build')));
//* means that everything the user enter after the server name (website domain) is going to be served by index.html file
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/frontend/build/index.html'))
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
