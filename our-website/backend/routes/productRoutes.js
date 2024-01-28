import express from 'express';
import Product from '../models/productModel.js'; //.js is necessary to get rid of error
import expressAsyncHandler from 'express-async-handler';  //middleware that wraps asynchronous route handlers, making error handling with async functions easier.
import { isAuth, isAdmin } from '../utils.js';

// Server-side route handles product-related functionalities/ requests.
// It includes routes for fetching, creating, updating, and deleting products, as well as managing product reviews, categories, and search criteria.


const productRouter = express.Router(); // Creating an Express router for handling product-related routes



// FETCH, CREATE, UPDATE, and DELETE products (Admin only)


// FETCH all products
productRouter.get ('/', async (req, res) => {
  const products = await Product.find ();       // Retrieve all products from the database
  res.send (products);            // Send the products as a response
});



// CREATE a new product (Admin Only)
// Middleware functions (isAuth, isAdmin, expressAsyncHandler) are custom middleware functions used to execute code before the actual route handler.
productRouter.post(
  '/',  
  isAuth,        // Middleware to check if the user is authenticated
  isAdmin,      // Middleware to check if the user is an admin
  expressAsyncHandler (async (req, res) => {

    // Creating a new product with default values 
    const newProduct = new Product({
      name: 'sample name ' + Date.now(),
      slug: 'sample-name-' + Date.now(),
      image: '/images/i1.jpg',
      price: 0,
      category: 'sample category',
      brand: 'sample brand',
      countInStock: 0,
      rating: 0,
      numReviews: 0,
      description: 'sample description',
    });
    // Save the new product to the database
    const product = await newProduct.save();
    // Send a success message and the created product as a response
    res.send ({ message: 'Product Created', product });  
  })
);




// UPDATE a product by ID (Admin only)
productRouter.put(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler (async (req, res) => {
    const productId = req.params.id;      // extracts id from route path.
    const product = await Product.findById (productId);     // queries the database for a product with the specified ID

    // If the product exists, update its properties with the new values
    if (product) {
      product.name = req.body.name;       
      product.slug = req.body.slug;
      product.price = req.body.price;
      product.image = req.body.image;
      product.category = req.body.category;
      product.brand = req.body.brand;
      product.countInStock = req.body.countInStock;
      product.description = req.body.description;
      
      await product.save(); // Save the updated product to the database
      res.send({ message: 'Product Updated' }); // Send a success message
    } 
    
    else {
      res.status(404).send({ message: 'Product Not Found' });
    }
  })
);



// DELETE a product by ID (Admin only)
productRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);   // Find the product by ID
    if (product) {
      await product.remove(); // Remove the product from the database
      res.send({ message: 'Product Deleted' }); // Send a success message
    } else {
      res.status(404).send({ message: 'Product Not Found' });
    }
  })
);




// Handles product reviews, category retrieval, and product filtering based on search criteria. The routes are designed for public admin users, with appropriate authentication and authorization checks. 


// Create a Product Review (Authenticated Users) - define routes for handling HTTP POST requests
productRouter.post(
  '/:id/reviews',
  isAuth,
  expressAsyncHandler (async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);

    if (product) {
            // Check if the user has already submitted a review for this product
      if (product.reviews.find((x) => x.name === req.user.name)) {
        return res
          .status(400)
          .send({ message: 'You already submitted a review' }); // Send an error if a review already exists
      }

      // Create a new review with user-submitted data
      const review = {
        name: req.user.name,
        rating: Number(req.body.rating),      // contains data sent in the request body
        comment: req.body.comment,
      };
      
      product.reviews.push(review); // Add the new review to the product's reviews array

      // Update product's review-related properties
      product.numReviews = product.reviews.length;

      // calculates the average rating of all reviews.
      product.rating = product.reviews.reduce ((a, c) => c.rating + a, 0) / product.reviews.length;

      const updatedProduct = await product.save(); // Save the updated product to the database

        //  sends an HTTP response with the specified status code and data.
        res.status(201).send({
        message: 'Review Created',
        review: updatedProduct.reviews [updatedProduct.reviews.length - 1],
        numReviews: product.numReviews,
        rating: product.rating,
      });
    } else {
      res.status(404).send({ message: 'Product Not Found' });
    }
  })
);



// Fetch Products for Admin Use (Admin Only) - define routes for handling HTTP GET requests
const PAGE_SIZE = 100;        // sets default page size 

productRouter.get(
  '/admin',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { query } = req;            // extracts query parameters from the request URL
    const page = query.page || 1;         // defaults to 1 if not provided
    
    // Sets the limit based on the 'limit' query parameter. If 'all' is provided, limit is set to 0 (no limit).
    // Otherwise, it uses the provided 'limit' parameter and parses the value to an integer, or defaults to PAGE_SIZE.
    const limit =
      query.limit === 'all' ? 0 : parseInt(query.limit) || PAGE_SIZE;   

      // Database Queries:
      const findQuery = Product.find();              // Creates a query to find products
      const countQuery = Product.countDocuments();  // Creates a query to count the total number of products
  
    // If there is a limit (greater than 0), skips a certain number of products based on the page and limits the number of products returned.
    if (limit > 0) {
      findQuery.skip (limit * (page - 1)).limit(limit);
    }

    const products = await findQuery;     // Executes the find query to get the products
    const countProducts = await countQuery;  // Executes the count query to get the total count of products


    // Send the products, total count, current page, and total pages as a response
    res.send({
      products,
      countProducts,
      page,
      pages: limit > 0 ? Math.ceil (countProducts / limit) : 1,
      // Calculates the total number of pages based on the count of products and the limit (if greater than 0).
    });
  })
);





// Filter Products Based on Search Criteria (Public)
productRouter.get(
  '/search',
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const pageSize = query.pageSize || PAGE_SIZE;
    const page = query.page || 1;
    const category = query.category || '';
    const price = query.price || '';
    const rating = query.rating || '';
    const order = query.order || '';
    const searchQuery = query.query || '';

    // Define filters based on query parameters
    const queryFilter =
      searchQuery && searchQuery !== 'all'
        ? {
            name: {
              $regex: searchQuery,
              $options: 'i', //case insensitive search
            },
          }
        : {};
    //category filter
    const categoryFilter = category && category !== 'all' ? { category } : {};
    //rating filter
    const ratingFilter =
      rating && rating !== 'all'
        ? {
            rating: {
              $gte: Number(rating),
            },
          }
        : {};
    const priceFilter =
      price && price !== 'all'
        ? {
            // 1-50
            price: {
              $gte: Number(price.split('-')[0]),
              $lte: Number(price.split('-')[1]),
            },
          }
        : {};
    const sortOrder =
      order === 'featured'
        ? { featured: -1 }
        : order === 'lowest'
        ? { price: 1 }
        : order === 'highest'
        ? { price: -1 }
        : order === 'toprated'
        ? { rating: -1 }
        : order === 'newest'
        ? { createdAt: -1 }
        : { _id: -1 };


        
    //queryFilter is the object that we pass to the find() method on the product model in mongoose
    const products = await Product.find({
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    })
      .sort(sortOrder)
      .skip(pageSize * (page - 1))
      .limit(pageSize);

    const countProducts = await Product.countDocuments({
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    });

        // Send the filtered products, total count, current page, and total pages as a response
    res.send({
      products,
      countProducts,
      page,
      pages: Math.ceil(countProducts / pageSize),
    });
  })
);





// Fetch Unique Product Categories for Sidebar and Search Box
productRouter.get(
  '/categories',
  expressAsyncHandler(async (req, res) => {
    // Get distinct product categories
    const categories = await Product.find().distinct('category');
    res.send(categories);  // Send the categories as a response
  })
);




// Fetch Product Information by Slug. (From useEffect in ProductScreen: const result = await axios.get(`/api/products/slug/${slug}`);
productRouter.get('/slug/:slug', async (req, res) => {

  // Find the product by slug
  // uses the Product model to query the database for a product with the specified slug.
  const product = await Product.findOne({ slug: req.params.slug });
  if (product) {
    res.send(product);  // Send the product details as a response
  } else {
    res.status(404).send({ message: 'Product Not Found' });
  }
});




// Fetch product by ID (From addToCartHandler in ProductScreen: const{data} = await axios.get(`/api/products/${product._id}`)
productRouter.get('/:id', async (req, res) => {
  const product = await Product.findById (req.params.id); // Find the product by ID
  if (product) {
    res.send(product); // Send the product details as a response
  } else {
    res.status(404).send({ message: 'Product Not Found' });
  }
});

export default productRouter;