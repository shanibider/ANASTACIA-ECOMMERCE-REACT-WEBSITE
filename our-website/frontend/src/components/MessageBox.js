import React from 'react';
import Alert from 'react-bootstrap/Alert';

export default function MessageBox(props) {
  //Alert from React Bootstrap
  return <Alert variant={props.variant || 'info'}>{props.children}</Alert>;
}
