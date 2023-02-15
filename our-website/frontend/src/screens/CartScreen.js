import React from 'react';
import { useContext } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import { Helmet } from 'react-helmet-async';
import { Store } from '../Store';
import MessageBox from '../components/MessageBox';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function CartScreen() {
  const navigate = useNavigate();

  //for cartItems-
  //we bring it from useContext, and extract state from it
  //than from state we extract cartItems
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const updateCartHandler = async (item, quantity) => {
    //send an ajax request to the backend to get the current product
    const { data } = await axios.get(`/api/products/${item._id}`, { quantity });
    if (data.countInStock < quantity) {
      window.alert('Sorry. Product is out of stock');
      return;
    }
    ctxDispatch({
      //for + button on cart
      type: 'CART_ADD_ITEM',
      payload: { ...item, quantity }, //item beacuse we want to keep the same item and just change the quantity
    });
  };

  const removeItemHandler = (item) => {
    ctxDispatch({ type: 'CART_REMOVE_ITEM', payload: item }); //implement in Store.js
  };
  const checkoutHandler = () => {
    navigate('/signin?redirect=/shipping'); //?=query string. if the user is authenticated we redirect him to the shipping screen
  };
  return (
    <div>
      <Helmet>
        <title>Shopping Cart</title>
      </Helmet>
      <h1>Shopping Cart</h1>
      <Row>
        <Col md={8}>
          {cartItems.length === 0 ? (
            <MessageBox>
              Cart is empty. <Link to="/">Go Shopping</Link>
            </MessageBox>
          ) : (
            <ListGroup>
              {cartItems.map((item) => (
                <ListGroup.Item key={item._id} className="my-3">
                  <Row className="align-items-center justify-content-between">
                    <Col md={4}>
                      <img
                        src={item.image}
                        alt={item.name}
                        className="img-fluid rounded img-thumbnail"
                      ></img>{' '}
                      <Link to={`/product/${item.slug}`}>{item.name}</Link>
                    </Col>
                    {/*button to decrese number of items in the cart*/}
                    <Col md={3} className="d-flex align-items-center">
                      <Button
                        onClick={() =>
                          updateCartHandler(item, item.quantity - 1)
                        }
                        variant="primary"
                        size="sm"
                        disabled={item.quantity === 1}
                      >
                        <i className="fas fa-minus-circle"></i>
                      </Button>{' '}
                      <span className="mx-2">{item.quantity}</span>{' '}
                      {/*Increase this item in the cart*/}
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() =>
                          updateCartHandler(item, item.quantity + 1)
                        }
                        disabled={item.quantity === item.countInStock}
                      >
                        <i className="fas fa-plus-circle"></i>
                      </Button>
                    </Col>
                    <Col md={3} className="d-flex align-items-center">
                      ${item.price}
                    </Col>
                    <Col md={2}>
                      <Button
                        onClick={() => removeItemHandler(item)}
                        variant="danger"
                        size="sm"
                      >
                        <i className="fas fa-trash"></i>
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3>
                    Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)}{' '}
                    items) : $
                    {cartItems
                      .reduce((a, c) => a + c.price * c.quantity, 0)
                      .toFixed(3)}
                  </h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="d-grid">
                    <Button
                      type="button"
                      variant="primary"
                      onClick={checkoutHandler}
                      disabled={cartItems.length === 0}
                    >
                      Proceed to Checkout
                    </Button>
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
