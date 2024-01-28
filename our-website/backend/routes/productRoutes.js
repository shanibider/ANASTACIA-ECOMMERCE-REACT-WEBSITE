import express from 'express';
import Product from '../models/productModel.js'; //.js is necessary to get rid of error
import expressAsyncHandler from 'express-async-handler';
import { isAuth, isAdmin } from '../utils.js';


const productRouter = express.Router(); // Creating an Express router for handling product-related routes


// Fetch all products
productRouter.get('/', async (req, res) => {
  const products = await Product.find (); // Retrieve all products from the database
  res.send (products); // Send the products as a response
});





// Create a new product (Admin only)
productRouter.post(
  '/',
  isAuth, // Middleware to check if the user is authenticated
  isAdmin, // Middleware to check if the user is an admin
  expressAsyncHandler(async (req, res) => {

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
    res.send({ message: 'Product Created', product });  // Send a success message and the created product as a response
  })
);




// Update a product by ID (Admin only)
productRouter.put(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);     // Find the product by ID

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



// Delete a product by ID (Admin only)
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




// Create a product review (Authenticated users)
productRouter.post(
  '/:id/reviews',
  isAuth,
  expressAsyncHandler(async (req, res) => {
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
        rating: Number(req.body.rating),
        comment: req.body.comment,
      };
      
      product.reviews.push(review); // Add the new review to the product's reviews array
      // Update product's review-related properties
      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce((a, c) => c.rating + a, 0) /
        product.reviews.length;
        const updatedProduct = await product.save(); // Save the updated product to the database
        // Send a success message along with the newly created review details
        
        res.status(201).send({
        message: 'Review Created',
        review: updatedProduct.reviews[updatedProduct.reviews.length - 1],
        numReviews: product.numReviews,
        rating: product.rating,
      });
    } else {
      res.status(404).send({ message: 'Product Not Found' });
    }
  })
);



// Fetch products for admin use (Admin only)
const PAGE_SIZE = 100;
//For Admin Product List (manage products)
productRouter.get(
  '/admin',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const page = query.page || 1;
    const limit =
      query.limit === 'all' ? 0 : parseInt(query.limit) || PAGE_SIZE;

    const findQuery = Product.find();
    const countQuery = Product.countDocuments();

    if (limit > 0) {
      findQuery.skip(limit * (page - 1)).limit(limit);
    }
    const products = await findQuery;
    const countProducts = await countQuery;


        // Send the products, total count, current page, and total pages as a response
    res.send({
      products,
      countProducts,
      page,
      pages: limit > 0 ? Math.ceil(countProducts / limit) : 1,
    });
  })
);




// Filter products based on search criteria (Public)
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


// Fetch unique product categories for Sidebar and Search Box
productRouter.get(
  '/categories',
  expressAsyncHandler(async (req, res) => {
    // Get distinct product categories
    const categories = await Product.find().distinct('category');
    res.send(categories);  // Send the categories as a response
  })
);




// Fetch product information by slug (From Product Screen -> useEffect)
productRouter.get('/slug/:slug', async (req, res) => {

  // Find the product by slug
  const product = await Product.findOne({ slug: req.params.slug });
  if (product) {
    res.send(product);  // Send the product details as a response
  } else {
    res.status(404).send({ message: 'Product Not Found' });
  }
});

// Fetch product by ID (From Product Screen -> addToCartHandler)
productRouter.get('/:id', async (req, res) => {
  const product = await Product.findById (req.params.id); // Find the product by ID
  if (product) {
    res.send(product); // Send the product details as a response
  } else {
    res.status(404).send({ message: 'Product Not Found' });
  }
});

export default productRouter;















