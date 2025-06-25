// src/components/LoginModal.jsx
import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useAuth } from "../context/AuthContext.jsx";

function LoginModal({ show, onHide, container  }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const auth = useAuth();

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      // prikupi IP sa window.location.host - kasnije 
       await auth.login({ username, password, ip: "" });
       onHide();

    } catch (err) {
      console.error("Login failed:", err);
      alert("Prijava nije uspjela. Provjerite korisničko ime i lozinku.");
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
      <Modal.Header closeButton>
        <Modal.Title>Prijava</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-5" controlId="loginUsername">
            <Form.Control
              type="text"
              placeholder="Korisničko ime"
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-5" controlId="loginPassword">
            <Form.Control
              type="password"
              placeholder="Lozinka"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
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

export default LoginModal;
