import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { Store } from '../Store';

//for protected route- we need to check if user is logged in or not
export default function ProtectedRoute({ children }) {
  //for userInfo- we bring it from useContext like always, and extract state from it
  const { state } = useContext(Store);
  //than from state we extract userInfo
  const { userInfo } = state;
  //if userInfo exist return children otherwise navigate user to /signin screen
  return userInfo ? children : <Navigate to="/signin" />;
}
