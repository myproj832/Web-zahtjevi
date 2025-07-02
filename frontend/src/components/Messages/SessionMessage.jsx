import React from 'react';
import { Alert } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';

const SessionMessage = () => {
  const { warningMessage, sessionMessage, clearSessionMessage } = useAuth();

  if (!warningMessage && !sessionMessage) return null;

  return (
    <div className="position-fixed top-0 start-50 translate-middle-x mt-3" style={{ zIndex: 1051, minWidth: '300px' }}>
      {warningMessage && (
        <Alert variant="warning" dismissible onClose={clearSessionMessage}>
          {warningMessage}
        </Alert>
      )}
      {sessionMessage && (
        <Alert variant="danger" dismissible onClose={clearSessionMessage}>
          {sessionMessage}
        </Alert>
      )}
    </div>
  );
};

export default SessionMessage;

