// src/components/LoginModal.jsx
import { useState, useEffect } from "react";
import { Modal, Button, Form, InputGroup } from "react-bootstrap";
import PropTypes from "prop-types";
import userIcon from "../assets/Icons/user.png";
import padlockIcon from "../assets/Icons/padlock.png";
import unlockIcon from "../assets/Icons/unlock.png";
import { useAuth } from "../context/AuthContext.jsx";
import ErrorMessages from "./Messages/ErrorMessage.jsx";

function LoginModal({ show, onHide, container  }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessages, setErrorMessages] = useState([]);
   const [showPassword, setShowPassword] = useState(false);
  const auth = useAuth();

  // Clear errors when modal opens
  useEffect(() => {
    if (show) setErrorMessages([]);
  }, [show]);

   const handleTogglePassword = () => {
    setShowPassword(prev => !prev);
  };


  const handleSubmit = async e => {
    e.preventDefault();
    try {
      // prikupi IP sa window.location.host - kasnije 
       await auth.login({ username, password });
       onHide();

    } catch (err) {
      console.error("Login failed:", err);
      // Prikazujemo custom error za 401
      if (err.message.includes('401') || err.message.toLowerCase().includes('invalid')) {
        setErrorMessages(["Pogrešno korisničko ime ili lozinka."]);
      } else {
        setErrorMessages([`Prijava nije uspjela: ${err.message}`]);
      }
    }
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      container={container}
      fullscreen="sm-down"          // full‐screen on mobile, normal on md+
      centered
      backdropClassName="login-modal-backdrop"
    >
    <Modal.Header
  className="position-relative d-flex align-items-center justify-content-center"
>
 
  <Modal.Title className="mb-0">
    Prijava
  </Modal.Title>

  
  <button
    type="button"
    className="btn-close position-absolute top-50 end-0 translate-middle-y me-3"
    aria-label="Close"
    onClick={onHide}     // proslijeđuje se iz propsa LoginModal-a
  />
</Modal.Header>
      <Modal.Body>
         <ErrorMessages
          messages={errorMessages}
          variant="danger"
           onDismiss={idx =>
   setErrorMessages(prev => prev.filter((_, i) => i !== idx))
 }
        />
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-5" controlId="loginUsername">
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Korisničko ime"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
              />
              <InputGroup.Text>
                <img
                  src={userIcon}
                  alt="Korisnik"
                  style={{ width: '1.30rem', height: '1.30rem' }}
                />
              </InputGroup.Text>
            </InputGroup>
          </Form.Group>
          <Form.Group className="mb-5" controlId="loginPassword">
            <InputGroup>
              <Form.Control
                type={showPassword ? "text" : "password"}
                placeholder="Lozinka"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <InputGroup.Text
                onClick={handleTogglePassword}
                style={{ cursor: 'pointer' }}
                aria-label={showPassword ? "Sakrij lozinku" : "Prikaži lozinku"}
              >
                <img
                  src={showPassword ? unlockIcon : padlockIcon}
                  alt={showPassword ? 'Otključano' : 'Zaključano'}
                  style={{ width: '1.30rem', height: '1.30rem' }}
                />
              </InputGroup.Text>
            </InputGroup>
          </Form.Group>

          <Button type="submit" className="w-100" style={{ 
            background: "var(--gradient-primary-button)",
            border: "none",
            borderRadius: "50px",
            padding: "1rem",
            fontSize: "1.1rem",
            fontWeight: "bold",
            marginBottom: "2rem",
            boxShadow: "var(--box-shadow)"
          }}>
            Prijava
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

LoginModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  container: PropTypes.any
};


export default LoginModal;
