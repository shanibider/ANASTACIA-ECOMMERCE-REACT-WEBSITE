import React, { useContext, useEffect, useReducer } from 'react';
import Chart from 'react-google-charts';
import axios from 'axios';
import { Store } from '../Store';
import { getError } from '../utils';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import { Helmet } from 'react-helmet-async';
/*reducer function*/
const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    //when we successfuly fetch data from backend we fill the summary field with summery data from backend (in action.payload)
    case 'FETCH_SUCCESS':
      return {
        ...state,
        summary: action.payload,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
export default function DashboardScreen() {
  //define a reducer to fetch data from backend
  //we deconstruct from state from this reducer is { loading, summary, error },
  //also get dispatch to call this cases and update the state of the reducer
  const [{ loading, summary, error }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });

  //to get userInfo (from state)
  //we need the { userInfo } token to authenticate the request for getting dashboard data
  const { state } = useContext(Store);
  const { userInfo } = state;

  //useEffect for send an ajax request to get the dashboard data
  //try and catch beacuse we have to catch any error on ajax requests to backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        //send ajax request using axios to this url: '/api/orders/summary'

        const { data } = await axios.get('/api/orders/summary', {
          headers: { Authorization: `Bearer ${userInfo.token}` }, //this is to authenticate this api request- /api/orders/summery
        });
        //here we get the data from backend and set it as a payload for 'FETCH_SUCCESS'
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err),
        });
      }
    };
    //calling fetchData()
    fetchData();
  }, [userInfo]);

  return (
    <div>
    <Helmet>
    <title>Dashboard</title>
  </Helmet>
      <h1>Dashboard</h1>
      
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          <Row>
            <Col md={4}>
              <Card>
                <Card.Body>
                <Card.Text>Number Of Users</Card.Text>
                  <Card.Title>
                    {/*if summery.users and summery.users first element exist-
                    show- summary.users[0].numUsers,
                    otherwise- show 0
                    */}
                    {summary.users && summary.users[0]
                      ? summary.users[0].numUsers
                      : 0}
                  </Card.Title>
                  
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card>
                <Card.Body>
                <Card.Text>Number Of Orders</Card.Text>
                  <Card.Title>
                    {summary.orders && summary.users[0]
                      ? summary.orders[0].numOrders
                      : 0}
                  </Card.Title>
                  
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card>
                <Card.Body>
                <Card.Text>Money Orders</Card.Text>
                  <Card.Title>
                    $
                    {summary.orders && summary.users[0]
                      ? summary.orders[0].totalSales.toFixed(2) //2 digits after dicimal point
                      : 0}
                  </Card.Title>
                  
                </Card.Body>
              </Card>
            </Col>
          </Row>
          {/*This is out chart-
          first element- array
          second element- data (summry.dailyOrders) and map each dailyOrder to this array- [x._id, x.sales]
          
          
          */}
          <div className="my-3">
            <h2>Sales</h2>
            {summary.dailyOrders.length === 0 ? (
              <MessageBox>No Sale</MessageBox>
            ) : (
              <Chart
                width="100%"
                height="400px"
                chartType="AreaChart"
                loader={<div>Loading Chart...</div>}
                data={[
                  ['Date', 'Sales'],
                  ...summary.dailyOrders.map((x) => [x._id, x.sales]),
                ]}
              ></Chart>
            )}
          </div>
          <div className="my-3">
            <h2>Categories</h2>
            {summary.productCategories.length === 0 ? (
              <MessageBox>No Category</MessageBox>
            ) : (
              <Chart
                width="100%"
                height="400px"
                chartType="PieChart"
                loader={<div>Loading Chart...</div>}
                data={[
                  ['Category', 'Products'],
                  ...summary.productCategories.map((x) => [x._id, x.count]),
                ]}
              ></Chart>
            )}
          </div>
        </>
      )}
    </div>
  );
}
