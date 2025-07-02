import { useContext, useState } from "react";
import { Form, Row, Col } from "react-bootstrap";
import { ValidationContext } from "../../context/ValidationContext";

function DiagnosisBlock() {
  const allowedSigns = useContext(ValidationContext);
  const [error, setError] = useState("");

  const handleBeforeInput = (e) => {
    const char = e.data;

    if (!char || !allowedSigns) return;

    if (!allowedSigns.includes(char)) {
      e.preventDefault();
      setError(`Znak "${char}" nije dozvoljen.`);
    } else {
      setError(""); // očisti grešku ako je validan unos
    }
    setTimeout(() => setError(""), 3000);
  };
  return (
    <>
      <h5 className="mt-2">Dijagnoza</h5>
      <Row className="mb-2">
        <Col md={12}>
          <Form.Group>
            <Form.Label className="m-0">Šifra i Naziv</Form.Label>
            <Form.Control className="p-1" onBeforeInput={handleBeforeInput} />
             {error && (
              <Form.Text className="text-danger">{error}</Form.Text>
            )}
          </Form.Group>
        </Col>
      </Row>
    </>
  );
}

export default DiagnosisBlock;
