import express from 'express';
import data from '../data.js';
import Product from '../models/productModel.js';
import User from '../models/userModel.js';

//save data.js in mongoose
const seedRouter = express.Router();

seedRouter.get('/', async (req, res) => {
  await Product.remove({});
  const createdProducts = await Product.insertMany(data.products);
  await User.remove({});
  const createdUsers = await User.insertMany(data.users);
  res.send({ createdProducts, createdUsers });
});

/*
//Scrapping data from zara.com
seedRouter.get('/', async (req, res) => {
  await User.remove({});
  const createdUsers = await User.insertMany(data.users);
  res.send({ createdProducts, createdUsers });
  const axios = require('axios');
  const cheerio = require('cheerio');
  
  await Product.remove({});
  const url = 'https://www.zara.com/il/he/woman-outerwear-l1184.html?v1=2184152';
  
  axios 
  .get(url)
  .then((response) => {
    const $ = cheerio.load(response.data);
    const products = $('li.product-item');
    products.map((i, product) => {
      const productName = $(product).find('span.product-name').text();
      const productPrice = $(product).find('span.product-price').text();
      const productImageUrl = $(product).find('img').attr('src');
      console.log(`Product Name: ${productName}`);
      console.log(`Product Price: ${productPrice}`);
      console.log(`Product Image URL: ${productImageUrl}`);
      console.log('');

      return new Product({
      name: productName,
      slug: '',
      category: 'Shirts',
      image: productImageUrl,
      price: productPrice,
      countInStock: 10,
      brand: 'Zara',
      rating: 4.5,
      numReviews: 10,
      description: 'high quality shirt',
      });
    });
    const createdProducts = await Product.insertMany(products);
  })
  .catch((error) => {
    console.log(error);
  });
});
*/

export default seedRouter;
