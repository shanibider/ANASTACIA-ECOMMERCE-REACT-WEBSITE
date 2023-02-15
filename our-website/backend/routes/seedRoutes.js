import express from 'express';
import data from '../data.js';
import Product from '../models/productModel.js';
import User from '../models/userModel.js';

//scrapping imports
import axios from 'axios';
import cheerio from 'cheerio';
import { createObjectCsvWriter as createCsvWriter } from 'csv-writer';
import fs from 'fs';

//save data.js in mongoose
const seedRouter = express.Router();

seedRouter.get('/', async (req, res) => {
  await Product.remove({});
  const createdProducts = await Product.insertMany(data.products);
  await User.remove({});
  const createdUsers = await User.insertMany(data.users);
  res.send({ createdProducts, createdUsers });
});

export default seedRouter;
