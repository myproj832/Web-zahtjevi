import { Form, Row, Col } from "react-bootstrap";

function InstitutionDetails() {
  return (
    <>
      <h5 className="mt-4">Zdravstvena ustanova</h5>
      <Form.Group as={Row}>
        <Form.Label column sm={2}>
          Ustanova:
        </Form.Label>
        <Col sm={4}>
          <Form.Control
            readOnly
            defaultValue="Dom zdravlja Centar"
            className="bg-light border-2"
            disabled
          />
        </Col>
      </Form.Group>
      <Form.Group as={Row}>
        <Form.Label column sm={2}>
          Adresa:
        </Form.Label>
        <Col sm={4}>
          <Form.Control
            readOnly
            defaultValue="Ulica 123"
            className="bg-light border-2"
            disabled
          />
        </Col>
      </Form.Group>
      <Form.Group as={Row}>
        <Form.Label column sm={2}>
          Telefon:
        </Form.Label>
        <Col sm={4}>
          <Form.Control
            readOnly
            defaultValue="32 69 123 456"
            className="bg-light border-2"
            disabled
          />
        </Col>
      </Form.Group>
    </>
  );
}

export default InstitutionDetails;
