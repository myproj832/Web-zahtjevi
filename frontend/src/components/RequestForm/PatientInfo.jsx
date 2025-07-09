import { useRef, useContext, useState } from "react";
import { Card, Form, Row, Col } from "react-bootstrap";
import PhoneInput from "react-phone-input-2";
import { IMaskInput } from "react-imask";
import "react-phone-input-2/lib/style.css";
import { ValidationContext } from "../../context/ValidationContext";

function PatientInfo({ patientInfo, setPatientInfo, pacijenti, gradovi }) {
  const allowedSigns = useContext(ValidationContext);

  const handleChange = (field, value) => {
    setPatientInfo({ ...patientInfo, [field]: value });
  };
  const phoneRef = useRef(null);
  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const birthDateRef = useRef(null);
  const cityRef = useRef(null);
  const [showLatinMsg, setShowLatinMsg] = useState({ firstName: false, lastName: false });

  const handleBeforeInput = (e) => {
    const char = e.data;
    if (!char || !allowedSigns) return;
    if (!allowedSigns.includes(char)) {
      e.preventDefault();
    }
  };

  const handleBlur = (e) => {
    // kad korisnik “izleti” iz polja, dodatno formatiramo vrijednost
    const digits = e.target.value.replace(/\D/g, "");
    if (digits.length === 8) {
      const day = digits.slice(0, 2);
      const month = digits.slice(2, 4);
      const year = digits.slice(4, 8);
      handleChange("birthDate", `${day}.${month}.${year}`);
    } else {
      // opcionalno: možete obrisati neispravan unos
      handleChange("birthDate", "");
    }
  };

  const handleKeyDown = (e, nextRef) => {
    if (e.key === "Enter" && nextRef?.current) {
      e.preventDefault(); // sprečava submit ako si u formi
      nextRef.current.focus();
    }
  };

  const handlePhoneChange = (value) => {
    handleChange("phone", value);

    // Pronađi pacijenta po broju telefona
    const matched = pacijenti?.find((p) => p.phoneNo === value);
    if (matched) {
      setPatientInfo((prev) => ({
        ...prev,
        phone: matched.phoneNo,
        firstName: matched.name,
        lastName: matched.surname,
        birthDate: matched.dateOfBirth,
        city: matched.city || "", // ovo će postaviti grad ako postoji
      }));
    }
  };

  // Dodatna validacija za ime i prezime
  const forbiddenLetters = /[šđžčćŠĐŽČĆ]/g;

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
        <Form.Label
          column
          sm={3}
          className="m-0 pt-3"
          style={{ textTransform: "none" }}
        >
          Telefon<span style={{ color: "red" }}>*</span>
        </Form.Label>
        <Col sm={9}>
          <PhoneInput
            ref={phoneRef}
            country={"me"}
            value={patientInfo.phone}
            onChange={handlePhoneChange}
            masks={{
              me: ".. ... ....",
              rs: ".. ... ....",
              ba: ".. ... ....",
              hr: ".. ... ....",
              mk: ".. ... ....",
            }}
            inputProps={{
              onKeyDown: (e) => handleKeyDown(e, firstNameRef),
            }}
          />
        </Col>
      </Form.Group>

      {/* Ime */}
      <Form.Group as={Row}>
        <Form.Label
          column
          sm={3}
          className="m-0 py-1"
          style={{ textTransform: "none" }}
        >
          Ime<span style={{ color: "red" }}>*</span>
        </Form.Label>
        <Col sm={9}>
          <Form.Control
            ref={firstNameRef}
            className="p-1 text-capitalize"
            value={patientInfo.firstName}
            onChange={(e) => {
              const value = e.target.value;
              if (forbiddenLetters.test(value)) {
                setShowLatinMsg((prev) => ({ ...prev, firstName: true }));
                return;
              } else {
                setShowLatinMsg((prev) => ({ ...prev, firstName: false }));
              }
              handleChange("firstName", value);
            }}
            onBeforeInput={handleBeforeInput}
            onKeyDown={(e) => handleKeyDown(e, lastNameRef)}
          />
          {showLatinMsg.firstName && (
            <div style={{ color: 'red', fontSize: 12 }}>Nisu dozvoljena slova č,ć,š,ž,đ - Molimo Vas da koristite c,s,z,dj,dz</div>
          )}
        </Col>
      </Form.Group>

      {/* Prezime */}
      <Form.Group as={Row}>
        <Form.Label
          column
          sm={3}
          className="m-0 py-1"
          style={{ textTransform: "none" }}
        >
          Prezime<span style={{ color: "red" }}>*</span>
        </Form.Label>
        <Col sm={9}>
          <Form.Control
            ref={lastNameRef}
            className="p-1 text-capitalize"
            value={patientInfo.lastName}
            onChange={(e) => {
              const value = e.target.value;
              if (forbiddenLetters.test(value)) {
                setShowLatinMsg((prev) => ({ ...prev, lastName: true }));
                return;
              } else {
                setShowLatinMsg((prev) => ({ ...prev, lastName: false }));
              }
              handleChange("lastName", value);
            }}
            onBeforeInput={handleBeforeInput}
            onKeyDown={(e) => handleKeyDown(e, birthDateRef)}
          />
          {showLatinMsg.lastName && (
            <div style={{ color: 'red', fontSize: 12 }}>Koristite csd</div>
          )}
        </Col>
      </Form.Group>

      {/* Datum rođenja */}
      <Form.Group as={Row}>
        <Form.Label
          column
          sm={3}
          className="m-0 py-1"
          style={{ textTransform: "none" }}
        >
          Datum rođenja<span style={{ color: "red" }}>*</span>
        </Form.Label>
        <Col sm={9}>
          <IMaskInput
            mask="00.00.0000"
            unmask={false}
            placeholder="dd.mm.yyyy"
            value={patientInfo.birthDate}
            onAccept={(val) => handleChange("birthDate", val)}
            onBlur={handleBlur}
            onKeyDown={(e) => handleKeyDown(e, cityRef)}
            inputRef={birthDateRef}
            className="form-control p-1"
          />
        </Col>
      </Form.Group>

      {/* Grad */}
      <Form.Group as={Row}>
        <Form.Label
          column
          sm={3}
          className="m-0 py-1"
          style={{ textTransform: "none" }}
        >
          Grad za preuzimanje lijeka
        </Form.Label>
        <Col>
          <Form.Select
            ref={cityRef}
            className="p-1"
            style={{ height: "35px" }}
            value={patientInfo.city}
            onChange={(e) => handleChange("city", e.target.value)}
          >
            <option value="">Izaberi grad</option>
            {gradovi?.filter((grad) => grad.name_delivery).map((grad) => (
              <option key={grad.code} value={grad.code}>
                {grad.name_delivery}
              </option>
            ))}
          </Form.Select>
        </Col>
      </Form.Group>
    </Card>
  );
}

export default PatientInfo;
