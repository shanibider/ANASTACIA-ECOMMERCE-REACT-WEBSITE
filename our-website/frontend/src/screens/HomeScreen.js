import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import logger from 'use-reducer-logger';
import { useEffect, useState, useReducer } from 'react';
import { Row, Col } from 'react-bootstrap';
import Product from '../components/Product';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import data from '../data';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, product: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

export default function HomeScreen() {
  //define a reducer to fetch data from backend
  //we deconstruct from state from this reducer is { loading, error, product },
  //also get dispatch to call this cases and update the state of the reducer
  const [{ loading, error, product }, dispatch] = useReducer(logger(reducer), {
    product: [],
    loading: true,
    error: '',
  });

  //const [products, setProducts] = useState([]);

  //useEffect for send an ajax request to get the dashboard data
  //try and catch beacuse we have to catch any error on ajax requests to backend
  useEffect(() => {
    const fetchData = async () => {
      //ajax request. result is the response from the server (equal to data.products)
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get('/api/products');
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err.message });
      }
      //setProducts(result.data);
    };
    fetchData();
  }, []);

  return (
    <div>
      <Helmet>
        <title>Amazona</title>
      </Helmet>
      <h1>Features Products</h1>
      <div className="products">
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
