import { Card, Form, Row, Col } from "react-bootstrap";

function InstitutionDetails() {
  return (
    <>
    <Card
          className="pb-3 px-4 my-4"
          style={{
            backgroundColor: "rgba(187, 221, 222, 0.58)",
            borderRadius: "1rem",
            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
          }}
        >
      <h5 className="mt-3">Zdravstvena ustanova</h5>
      <Form.Group as={Row}>
        <Form.Label column sm={2} className="py-0">
          Ustanova:
        </Form.Label>
        <Col sm={10}>
          <Form.Control
            readOnly
            defaultValue="Milmedika Budva"
            className="bg-#E8E8E8 border-2 p-1"
            disabled
            style={{"height":"30px"}}
          />
        </Col>
      </Form.Group>
      <Form.Group as={Row}>
        <Form.Label column sm={2} className="py-0">
          Adresa:
        </Form.Label>
        <Col sm={10}>
          <Form.Control
            readOnly
            defaultValue="Ulica 123"
            className="bg-#E8E8E8 border-2 p-1"
            disabled
            style={{"height":"30px"}}
          />
        </Col>
      </Form.Group>
      <Form.Group as={Row}>
        <Form.Label column sm={2} className="py-0">
          Telefon:
        </Form.Label>
        <Col sm={10}>
          <Form.Control
            readOnly
            defaultValue="32 69 123 456"
            className="bg-#E8E8E8 border-2 p-1"
            disabled
            style={{"height":"30px"}}
          />
        </Col>
      </Form.Group>
      </Card>
    </>
  );
}

export default InstitutionDetails;
