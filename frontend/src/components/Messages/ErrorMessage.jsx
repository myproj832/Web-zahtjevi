import React from 'react';
import PropTypes from 'prop-types';
import { Alert } from 'react-bootstrap';

export default function ErrorMessages({ messages, variant = 'danger', dismissible = false, onDismiss  }) {
  if (!messages || messages.length === 0) {
    return null;
  }

  return (
      <>
      {messages.map((msg, idx) => (
        <Alert
          key={idx}
          variant={variant}
          dismissible={dismissible}
          onClose={() => onDismiss && onDismiss(idx)}
          className="text-center" 
        >
          {msg}
        </Alert>
      ))}
    </>
  );
}

ErrorMessages.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.string).isRequired,
  variant: PropTypes.oneOf([
    'primary','secondary','success','danger','warning','info','light','dark',
  ]),
  dismissible: PropTypes.bool,
   onDismiss: PropTypes.func,
};
