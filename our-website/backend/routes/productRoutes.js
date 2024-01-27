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



  Number(rating),
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















