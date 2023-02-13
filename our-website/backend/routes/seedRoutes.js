import express from 'express';
import data from '../data.js';
import Product from '../models/productModel.js';
import User from '../models/userModel.js';
//packages:
/*
import axios from 'axios';
import cheerio from 'cheerio';
//important to install csv-writer
import { createObjectCsvWriter as createCsvWriter } from 'csv-writer';
import fs from 'fs';
import { sync as parse } from 'csv-parse/lib/sync';
*/

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

/*********************************************/

/*
async function scrape() {
  const result = await axios.get('https://books.toscrape.com/');
  const $ = cheerio.load(result.data);

  //const createCsvWriter = require('csv-writer').createObjectCsvWriter;

  const bookList = $('.product_pod');

  const books = [];
  bookList.each((index, element) => {
    books.push({
      title: $(element).find('.product_pod h3 a').attr('title'),
      rating: $(element)
        .find('.product_pod p.star-rating')
        .attr('class')
        .split(' ')[1],
      price: $(element).find('.product_pod .price_color').text().trim(),
      availability: $(element).find('.product_pod .availability').text().trim(),
    });
  });

  console.log(books);

  const csvWriter = createCsvWriter({
    path: 'books.csv',
    header: ['title', 'rating', 'price', 'availability'],
  });

  csvWriter
    .writeRecords(books)
    .then(() => console.log('The CSV file was written successfully'));
}

scrape();

/*******/
/*
//const fs = require('fs');
//const parse = require('csv-parse/lib/sync');

const csvFile = fs.readFileSync('books.csv', 'utf-8');
const records = parse(csvFile, {
  columns: true,
  header: true,
});

const jsonFile = JSON.stringify(records, null, 2);
fs.writeFileSync('books.json', jsonFile);
*/
/*************************************************/

/*
SCRAPE FROM BOOK WEBSITE
/*
FROM CHATGPT-
  web scrape https://books.toscrape.com/ using javaScript and BeautifulSoup
  export the data to CSV file
//const axios = require('axios');
//const cheerio = require('cheerio');

async function scrape() {
  const result = await axios.get('https://books.toscrape.com/');
  const $ = cheerio.load(result.data);

  const bookList = $('.product_pod');

  const books = [];
  bookList.each((index, element) => {
    books.push({
      title: $(element).find('.product_pod h3 a').attr('title'),
      rating: $(element)
        .find('.product_pod p.star-rating')
        .attr('class')
        .split(' ')[1],
      price: $(element).find('.product_pod .price_color').text().trim(),
      availability: $(element).find('.product_pod .availability').text().trim(),
    });
  });

  console.log(books);
}

scrape();
*/

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

/*
async function scrape() {
  const url = 'http://books.toscrape.com/';
  const response = await axios.get(url);
  const html = response.data;
  const $ = cheerio.load(html);

  const books = [];

  $('.product_pod').each((i, el) => {
    const title = $(el).find('h3 > a').attr('title');
    const rating = $(el).find('.star-rating').attr('class').split(' ')[1];
    const price = $(el).find('.price_color').text();
    const availability = $(el).find('.availability').text().trim();

    books.push({ title, rating, price, availability });
  });

  console.log(books);
}

scrape();*/
