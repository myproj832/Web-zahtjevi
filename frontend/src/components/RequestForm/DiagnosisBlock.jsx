import { Form, Row, Col } from "react-bootstrap";

function DiagnosisBlock() {
  return (
    <>
      <h5 className="mt-2">Dijagnoza</h5>
      <Row className="mb-2">
        <Col md={12}>
          <Form.Group>
            <Form.Label className="m-0">Šifra i Naziv</Form.Label>
            <Form.Control className="p-1"/>
          </Form.Group>
        </Col>
      </Row>
    </>
  );
}

export default DiagnosisBlock;
