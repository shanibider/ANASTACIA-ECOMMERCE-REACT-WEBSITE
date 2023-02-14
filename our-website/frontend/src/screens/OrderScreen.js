import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { Store } from '../Store';
import { getError } from '../utils';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { toast } from 'react-toastify';

/*****reducer function*****/
function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, order: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    //paypal payment
    case 'PAY_REQUEST':
      return { ...state, loadingPay: true };
    case 'PAY_SUCCESS':
      return { ...state, loadingPay: false, successPay: true };
    case 'PAY_FAIL':
      return { ...state, loadingPay: false };
    case 'PAY_RESET':
      return { ...state, loadingPay: false, successPay: false };
    default:
      return state;
  }
}
export default function OrderScreen() {
  //for userInfo-
  //we bring it from useContext, and extract state from it
  //than from state we extract userInfo
  const { state } = useContext(Store);
  const { userInfo } = state;

  //useParams to get the id from url. and we need orderId to get the order information from backend, and use it in useEffect
  const params = useParams();
  const { id: orderId } = params; //destructuring orderId from params (and rename it to "id") (like: const id = params.orderId;)
  const navigate = useNavigate();

  /*reducer declaration*/
  //define a reducer to fetch data from backend
  //we deconstruct { loading, error, order, successPay, loadingPay} from state from this reducer,
  //also get dispatch to call this cases and update the state of the reducer
  const [{ loading, error, order, successPay, loadingPay }, dispatch] =
    useReducer(reducer, {
      loading: true,
      order: {},
      error: '',
      successPay: false,
      loadingPay: false,
    });

  //usePayPalScriptReducer
  //usePayPalScriptReducer to get the paypal script from paypal- that return the state of loading script ({isPending}) and function that load the script (PayPalDispatch)
  //paypalDispatch- we use it to load the paypal script
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  /*createOrder + onApprove + onError implementation*/
  //here we call 'create' on actions.order and we pass the amount based on the total price of the order (when we click on paypal button the price should be- order.totalPrice)

  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: { value: order.totalPrice },
          },
        ],
      })
      .then((orderID) => {
        return orderID;
      });
  }

  //this function happen after successful payment

  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      //after successful payment we send ajax request to backend to update the order status to paid
      try {
        //dispatch PAY_REQUEST to show loading box
        dispatch({ type: 'PAY_REQUEST' });
        //call this api that we implement in backend, it pass the 'deatils' that contain the user information and payment information in the paypal site, and third it pass the authorization (because its an authorization api)
        const { data } = await axios.put(
          `/api/orders/${order._id}/pay`,
          details,
          {
            headers: { authorization: `Bearer ${userInfo.token}` },
          }
        );
        //after successful payment dispatch this action
        dispatch({ type: 'PAY_SUCCESS', payload: data });
        toast.success('Order is paid');
      } catch (err) {
        dispatch({ type: 'PAY_FAIL', payload: getError(err) });
        toast.error(getError(err));
      }
    });
  }
  function onError(err) {
    toast.error(getError(err));
  }

  //useEffect for send an ajax request to get the dashboard data
  //try and catch beacuse we have to catch any error on ajax requests to backend
  useEffect(() => {
    /*fetchOrder function*/
    const fetchOrder = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        //sending ajax request (using axios) to backend to get the order information
        const { data } = await axios.get(`/api/orders/${orderId}`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        //after successful api response, we dispatch FETCH_SUCCESS action, and pass the data (order data) from backend for this action and pass it to reducer
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };

    //if  userInfo=null redirect user to login page
    if (!userInfo) {
      return navigate('/login');
    }
    //if order._id is null or order._id is not equal to orderId then fetchOrder
    //we add a new condition to fetch the Order- if successPay is true we need to fetch the order to update the order status in the screen
    if (!order._id || successPay || (order._id && order._id !== orderId)) {
      fetchOrder();
      //if successPay is true we need to reset the payment status
      if (successPay) {
        dispatch({ type: 'PAY_RESET' });
      }
    }
    //load paypal script in the frontend
    else {
      //async function bacuse we send an ajax request to backend to get the paypal client id that we implemented
      //after getting cliendId we need to use paypal dispatch (that is coming from usePayPalScriptReducer Hook)
      const loadPaypalScript = async () => {
        const { data: clientId } = await axios.get('/api/keys/paypal', {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        /*paypalDispatch*/
        //now we dispatch the paypalDispatch to load the paypal script
        paypalDispatch({
          type: 'resetOptions',
          value: {
            'client-id': clientId,
            currency: 'USD',
          },
        });
        paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
      };
      loadPaypalScript();
    }
  }, [order, userInfo, orderId, navigate, paypalDispatch, successPay]); //dependencies array (include all elemnts we use in useEffect)

  /*********************/
  return loading ? (
    <LoadingBox></LoadingBox>
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div>
      <Helmet>
        <title>Order {orderId}</title>
      </Helmet>
      <h1 className="my-3">Order {orderId}</h1>
      <Row>
        <Col md={8}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Shipping</Card.Title>
              <Card.Text>
                <strong>Name:</strong> {order.shippingAddress.fullName} <br />
                <strong>Address: </strong> {order.shippingAddress.address},
                {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                ,{order.shippingAddress.country}
              </Card.Text>
              {order.isDelivered ? (
                <MessageBox variant="success">
                  Delivered at {order.deliveredAt}
                </MessageBox>
              ) : (
                <MessageBox variant="danger">Not Delivered</MessageBox>
              )}
            </Card.Body>
          </Card>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Payment</Card.Title>
              <Card.Text>
                <strong>Method:</strong> {order.paymentMethod}
              </Card.Text>
              {order.isPaid ? (
                <MessageBox variant="success">
                  Paid at {order.paidAt}
                </MessageBox>
              ) : (
                <MessageBox variant="danger">Not Paid</MessageBox>
              )}
            </Card.Body>
          </Card>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Items</Card.Title>
              <ListGroup variant="flush">
                {/*render each item in the ListGroup.Item */}
                {order.orderItems.map((item) => (
                  <ListGroup.Item key={item._id}>
                    <Row className="align-items-center">
                      {/*new column*/}
                      <Col md={6}>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="img-fluid rounded img-thumbnail"
                        ></img>{' '}
                        <Link to={`/product/${item.slug}`}>{item.name}</Link>
                      </Col>
                      {/*new column*/}
                      <Col md={3}>
                        <span>{item.quantity}</span>
                      </Col>
                      {/*new column*/}
                      <Col md={3}>${item.price}</Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
        {/*new column*/}
        <Col md={4}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Order Summary</Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Items</Col>
                    <Col>${order.itemsPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Shipping</Col>
                    <Col>${order.shippingPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Tax</Col>
                    <Col>${order.taxPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>
                      <strong> Order Total</strong>
                    </Col>
                    <Col>
                      <strong>${order.totalPrice.toFixed(2)}</strong>
                    </Col>
                  </Row>
                </ListGroup.Item>
                {/*conditional rendering-
                if order is not paid show the paypal button- so create a ListItem and check isPending
                //isPending (coming from reactPayPal.js)- if its true show loadingBox,
                otherwise show the paypal button from reactPayPal.js and pass 3 props
                */}
                {!order.isPaid && (
                  <ListGroup.Item>
                    {isPending ? (
                      <LoadingBox />
                    ) : (
                      <div>
                        <PayPalButtons
                          createOrder={createOrder} //run when you click on the paypal button
                          onApprove={onApprove} //run when you have a succedful payment
                          onError={onError}
                        ></PayPalButtons>
                      </div>
                    )}
                    {/*if loadingPay is true show LoadingBox*/}
                    {loadingPay && <LoadingBox></LoadingBox>}
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
