import { Card, Form, Row, Col } from "react-bootstrap";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

function PatientInfo({ patientInfo, setPatientInfo, pacijenti, gradovi }) {
  const handleChange = (field, value) => {
    setPatientInfo({ ...patientInfo, [field]: value });
  };

  const handlePhoneChange = (value) => {
    handleChange("phone", value);

    // Pronađi pacijenta po broju telefona
    const matched = pacijenti?.find((p) => p.phoneNo === value);
    if (matched) {
      setPatientInfo({
        phone: matched.phoneNo,
        firstName: matched.name,
        lastName: matched.surname,
        birthDate: matched.dateOfBirth,
        city: "", // ili matched.city ako postoji
      });
    }
  };

  return (
    <Card
      className="pt-2 pb-2 px-4 mt-4 mb-3"
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.61)",
        borderRadius: "1rem",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
      }}
    >
      <h5>Podaci o pacijentu</h5>

      {/* Telefonski broj */}
      <Form.Group as={Row}>
        <Form.Label column sm={3} className="m-0 py-1">
          Telefon
        </Form.Label>
        <Col sm={9}>
          <PhoneInput
            country={"me"}
            value={patientInfo.phone}
            onChange={handlePhoneChange}
            inputStyle={{ width: "100%" }}
            masks={{ me: ".. ... ..." }}
          />
        </Col>
      </Form.Group>

      {/* Ime */}
      <Form.Group as={Row}>
        <Form.Label column sm={3} className="m-0 py-1">
          Ime
        </Form.Label>
        <Col sm={9}>
          <Form.Control
            className="p-1 text-capitalize"
            value={patientInfo.firstName}
            onChange={(e) => handleChange("firstName", e.target.value)}
          />
        </Col>
      </Form.Group>

      {/* Prezime */}
      <Form.Group as={Row}>
        <Form.Label column sm={3} className="m-0 py-1">
          Prezime
        </Form.Label>
        <Col sm={9}>
          <Form.Control
            className="p-1 text-capitalize"
            value={patientInfo.lastName}
            onChange={(e) => handleChange("lastName", e.target.value)}
          />
        </Col>
      </Form.Group>

      {/* Datum rođenja */}
      <Form.Group as={Row}>
        <Form.Label column sm={3} className="m-0 py-1">
          Datum rođenja
        </Form.Label>
        <Col sm={9}>
          <Form.Control
            className="p-1"
            type="text"
            value={patientInfo.birthDate}
            onChange={(e) => handleChange("birthDate", e.target.value)}
          />
        </Col>
      </Form.Group>

      {/* Grad */}
      <Form.Group as={Row}>
        <Form.Label column sm={3} className="m-0 py-1">
          Grad za preuzimanje lijeka
        </Form.Label>
        <Col>
          <Form.Select
            className="p-1"
            style={{ height: "35px" }}
            value={patientInfo.city}
            onChange={(e) => handleChange("city", e.target.value)}
          >
            <option value="">Izaberi grad</option>
            {gradovi?.map((grad) => (
              <option key={grad.code} value={grad.name}>
                {grad.name}
              </option>
            ))}
          </Form.Select>
        </Col>
      </Form.Group>
    </Card>
  );
}

export default PatientInfo;
