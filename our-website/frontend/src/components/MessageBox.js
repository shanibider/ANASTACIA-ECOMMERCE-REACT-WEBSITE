import React from 'react';
import { propTypes } from 'react-bootstrap/esm/Image';
import { Alert } from 'react-bootstrap';

export default function MessageBox(props) {
  return (
    <Alert variant={propTypes.variant || 'info'}>{propTypes.children}</Alert>
  );
}
