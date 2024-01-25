import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import seedRouter from './routes/seedRoutes.js';
import productRouter from './routes/productRoutes.js';
import userRouter from './routes/userRoutes.js';
import orderRouter from './routes/orderRoutes.js';
import path from 'path';
import fs from 'fs';

// Load environment variables from the .env file
dotenv.config();

// Create an Express application
const app = express();

/*SCRAPING*/
//connect to mongodb data base,

mongoose
  .connect(process.env.MONGODB_URI)
  .then ( () => {
    //scrapping data from website and save it in mongodb
    console.log('connected to db');
        // Read data from the 'cloths.json' file and save it in MongoDB
    fs.readFile('cloths.json', (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
            // Parse the JSON data
      const products = JSON.parse(data);

            // Get a reference to the MongoDB database
      const db = mongoose.connection;
            // Access the 'products' collection in the database
      const collection = db.collection('products');


            // Insert each product into the 'products' collection
      products.forEach ( (product) => {
        collection.insertOne ( product, function (err) {
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


/* SCRAPPING EXPLANATION:
1. Connect to MongoDB using the provided URI.
2. After the connection is established, read data from 'cloths.json' and store it in the 'products' collection in MongoDB.
3. Use fs.readFile to read the JSON data, parse it, and insert each product into the collection.
*/


// Parse JSON and URL-encoded data from POST requests
app.use (express.json ());
app.use (express.urlencoded ({ extended: true }));


// API to return clientID for PayPal
app.get ('/api/keys/paypal', (req, res) => {
  // Send PayPal client ID (from .env file)
  res.send (process.env.PAYPAL_CLIENT_ID || 'sb');
});


// Each component has its own router
// http://localhost:5000/api/products gets all the products
// When a request is made to a path starting with /api/seed, /api/products, /api/users, or /api/orders,
// Express will pass the request to the corresponding router (seedRouter, productRouter, userRouter, or orderRouter) for further handling.
// EEach endpoints has purpose. 

app.use ('/api/seed', seedRouter); //seedRouter responds to api/seed
app.use ('/api/products', productRouter);
app.use ('/api/users', userRouter);
app.use ('/api/orders', orderRouter);



// Serve static files from the 'frontend/build' directory
const __dirname = path.resolve();
app.use (express.static (path.join(__dirname, '/frontend/build')));



// '*' means any path not matched by previous routes; serve 'index.html'.
// commonly used for client-side routing in Single Page Applications (SPAs). To catch-all route ensures that the server returns the main HTML file for any URL
app.get ('*', (req, res) =>
  // res.sendFile is used to send the specified file (index.html) as the response.
  res.sendFile (path.join(__dirname, '/frontend/build/index.html'))
);



// Error handler for express
app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).send({ message: err.message });
});



// Set the port to the environment variable PORT or default to 5000
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`serve at http://localhost:${port}`);
});