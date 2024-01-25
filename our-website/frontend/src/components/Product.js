import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import Rating from './Rating';
import axios from 'axios';
import { useContext, useState } from 'react';
import { Store } from '../Store';

function Product(props) {
  const { product } = props;

    // Extracting cartItems from the global state using useContext
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

    // State to manage the "Add to Cart" button click animation
  const [isClicked, setIsClicked] = useState(false);

// Function to handle adding the product to the cart
  const addToCartHandler = async (item) => {
    const existItem = cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;

        // Fetch product details, including updated quantity, from the server
    const { data } = await axios.get(`/api/products/${item._id}`, { quantity });

        // Check if the product is still in stock
    if (data.countInStock < quantity) {
      window.alert('Sorry. Product is out of stock');
      return;
    }

        // Dispatch an action to add the item to the cart
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...item, quantity },
    });

        // Set the state to trigger the "Add to Cart" button click animation
    setIsClicked(true);

        // Reset the animation state after a short delay
    setTimeout(() => {
      setIsClicked(false);
    }, 200);
  };

  return (
    <Card>
      <Link to={`/product/${product.slug}`}>
        <img src={product.image} className="card-img-top" alt={product.name} />
      </Link>
      <Card.Body>
        <Link to={`/product/${product.slug}`}>
          <Card.Title>{product.name}</Card.Title>
        </Link>
        <Rating rating={product.rating} numReviews={product.numReviews} />
        <Card.Text>${product.price}</Card.Text>
        {product.countInStock === 0 ? (
          <Button variant="light" disabled>
            Out of stock
          </Button>
        ) : (
           // If the product is in stock, show an "Add to Cart" button
          <Button
            onClick={() => addToCartHandler(product)}
            style={{
              position: 'relative',
              transition: 'transform 200ms ease-out',
              transform: isClicked ? 'scale(0.95)' : 'none',
            }}
          >
            Add to cart
          </Button>
        )}
      </Card.Body>
    </Card>
  );
}

export default Product;



/*
Key points:
* It receives product as a prop, which contains information about a specific product.
* The Link component from react-router-dom is used to create links to the individual product pages.
* The Rating component is used to display the product rating.
* The addToCartHandler function is triggered when the "Add to Cart" button is clicked. It dispatches an action to add the product to the global cart state and handles animation logic for the button click.
* The component conditionally renders either a disabled button (if the product is out of stock) or an "Add to Cart" button.
* The styling includes a transition effect to create a visual feedback for the button click.
*/