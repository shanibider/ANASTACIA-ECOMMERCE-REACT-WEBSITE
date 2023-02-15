import React from 'react';

import axios from 'axios';
import logger from 'use-reducer-logger';
import { useEffect, useReducer } from 'react';
import { Row, Col } from 'react-bootstrap';
import Product from '../components/Product';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';


//Reducer accept current state, and an action that change the state and create a new state
const reducer = (state, action) => {
  switch (action.type) {
    //this case happen when we send an ajax request to backend
    //then we return ...state (keep the previous state values) and only update loading to true (so we can show the loading box)
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    //here we need to update product equal to data that coming from action.payload
    //action.payload contains all data from backend
    case 'FETCH_SUCCESS':
      return { ...state, product: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

/*Fetch Products From Backend*/
export default function HomeScreen() {
  //userReducer defined by an object- {loading, error, product}, and dispatch.
  //and accept a reducer and defualt state, that we set.
  //we use dispatch to call an action and update the state
  const [{ loading, error, product }, dispatch] = useReducer(logger(reducer), {
    product: [],
    loading: true,
    error: '',
  });
  //(logger used to log the state changes in the console)

  //useEffect use to send an ajax request to get data
  //useEffect accpets a function and an array of dependencies
  //(try and catch beacuse we have to catch any error on ajax requests)
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        //ajax request to '/api/products'
        //result is the response from the server (data.products)
        //if i successfuly get the result that contains the products from backend i need to dispatch FETCH_SUCCESS
        //and as payload i need to pass products from backend
        const result = await axios.get('/api/products');
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err.message });
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <Helmet>
        <title>Anastacia</title>
      </Helmet>
      <h1>Features Products</h1>
      <div className="products">
        {/*Conditional rendering- if loading is true show loading box*/}
        {loading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <Row>
            {product.map((product) => (
              <Col key={product.slug} sm={6} md={4} lg={3} className="mb-3">
                <Product product={product}></Product>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
}

/*If we were using useState:
const [products, setProducts] = useState([]);
setProducts(result.data);
*/
