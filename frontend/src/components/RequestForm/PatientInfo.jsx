import { Card, Form, Row, Col } from "react-bootstrap";

function PatientInfo() {
  return (
    <Card className="p-4 my-4" style={{ backgroundColor: "rgba(255, 255, 255, 0.51)", borderRadius: "1rem", boxShadow: "0 0 10px rgba(0,0,0,0.1)" }}>
      <h5>Podaci o pacijentu</h5>
      <Row className="mb-1">
        <Col md={6}>
          <Form.Group>
            <Form.Label className="m-0">Ime<span className="text-danger">*</span></Form.Label>
            <Form.Control />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label className="m-0">Prezime<span className="text-danger">*</span></Form.Label>
            <Form.Control />
          </Form.Group>
        </Col>
      </Row>
      <Row className="mb-1">
        <Col md={6}>
          <Form.Group>
            <Form.Label className="m-0">Broj telefona<span className="text-danger">*</span></Form.Label>
            <Form.Control required placeholder="npr. 3269123456" />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label className="m-0">Datum rođenja<span className="text-danger">*</span></Form.Label>
            <Form.Control type="date" />
          </Form.Group>
        </Col>
      </Row>
      <Form.Group className="mb-1">
        <Form.Label className="m-0">Grad za preuzimanje lijeka</Form.Label>
        <Form.Select>
          <option></option>
          <option>Podgorica</option>
          <option>Tivat</option>
          <option>Bar</option>
        </Form.Select>
      </Form.Group>
    </Card>
  );
}

export default PatientInfo;
