import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDataContext } from "../../context/DataContext";
import { Card, Form, Button, Row, Col } from "react-bootstrap";
import InstitutionDetails from "../../components/RequestForm/InstitutionDetails";
import PatientInfo from "../../components/RequestForm/PatientInfo";
import DiagnosisBlock from "../../components/RequestForm/DiagnosisBlock";
import PrescriptionCard from "../../components/RequestForm/PrescriptionCard";
import FileUpload from "../../components/RequestForm/FileUpload";
import AddPrescriptionButton from "../../components/RequestForm/AddPrescriptionButton";
import Header from "../../components/Header";
import "./RequestForm.css";

function RequestForm() {
  const navigate = useNavigate();
  const { indikLijek, lijekNormativ, gradovi, pacijenti, loading } =
    useDataContext();
  const [recepti, setRecepti] = useState([
    {
      tipRecepta: "obrazac",
      tekstRecepta: "",
      odabraniObrazac: null,
      vrstaRecepta: "neobn",
      kolicina: "",
      brojPonavljanja: "",
      vremenskiPeriod: "",
      napomena: "",
      grupa: "",
    },
  ]);
  const [isSaved, setIsSaved] = useState(false);
  const [formDisabled, setFormDisabled] = useState(false);
  const [patientInfo, setPatientInfo] = useState({
    phone: "",
    firstName: "",
    lastName: "",
    birthDate: "",
    city: "",
  });

  const isValidPhone = (phone) => {
    const phoneRegex = /^\+382\s?6[0-9]\s?\d{3}\s?\d{3}$/; // primjer za CG format npr: +382 67 123 456
    return phoneRegex.test(phone.trim());
  };

  return (
    <>
      <Header />
      <div className="background text-dark position-relative">
        <div className="p-4 mx-auto" style={{ maxWidth: "800px" }}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h1 className="mb-1">Unos Zahtjeva</h1>
            <Button
              variant="outline-secondary"
              onClick={() => navigate("/requests")}
            >
              Pregled zahtjeva
            </Button>
          </div>

          <Form>
            <InstitutionDetails />
            <PatientInfo
              patientInfo={patientInfo}
              setPatientInfo={setPatientInfo}
              pacijenti={pacijenti}
              gradovi={gradovi}
            />
            <DiagnosisBlock />

            {recepti.map((recept, index) => (
              <PrescriptionCard
                key={index}
                recept={recept}
                index={index}
                recepti={recepti}
                setRecepti={setRecepti}
                indikLijek={indikLijek}
                lijekNormativ={lijekNormativ}
              />
            ))}

            {!isSaved ? (
              <>
                <AddPrescriptionButton
                  setRecepti={setRecepti}
                  recepti={recepti}
                />
                <FileUpload />
                <Button
                  className="mt-4"
                  variant="primary"
                  onClick={() => {
                    if (!isValidPhone(patientInfo.phone)) {
                      alert(
                        "Molimo unesite ispravan broj telefona (npr. +382 67 123 456)"
                      );
                      return;
                    }
                    const newRequest = {
                      id: Date.now(),
                      datum: new Date().toLocaleString("sr-RS"),
                      pacijent: `${patientInfo.firstName} ${patientInfo.lastName}`,
                      telefon: patientInfo.phone,
                      grad: patientInfo.city,
                      lijek: "progesteron krem 10mg-0.25ml 15ml",
                      tipRecepta: "Obrazac lijeka",
                      obrazac: recepti[0].odabraniObrazac?.naziv || "",
                      sastav: ["progesteron 10mg/0.25ml", "excipiens ad 15ml"],
                      ustanova: "Milmedika Podgorica",
                      ljekarId: 1,
                      ljekar: "Dr Ivana Ivković",
                      status: "Kreiran",
                      datumStatusa: new Date().toISOString().split("T")[0],
                      napomena: recepti[0].napomena,
                      faksimil: "Dr. MN",
                      farmaceut: "Ivana Juric",
                      datumIzdavanja: new Date()
                        .toLocaleString("sr-RS")
                        .split("T")[0],
                    };

                    const existing =
                      JSON.parse(localStorage.getItem("requests")) || [];
                    localStorage.setItem(
                      "requests",
                      JSON.stringify([...existing, newRequest])
                    );

                    setIsSaved(true);
                    setFormDisabled(true);
                  }}
                >
                  Snimi zahtjev
                </Button>
              </>
            ) : (
              <>
                <Card
                  className="shadow-sm border rounded-3 p-0"
                  style={{
                    backgroundColor: "rgba(187, 221, 222, 0.58)",
                    borderRadius: "1rem",
                    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
                  }}
                >
                  <Card.Body className="py-2">
                    {/* <Form.Group className="mb-1">
                      <Form.Label className="mb-1">
                        <strong>Broj potvrde</strong>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        value={automatskiPodaci.brojPotvrde}
                        readOnly
                        className="m-0 py-1"
                        placeholder="208"
                      />
                    </Form.Group> */}
                    <Row className="mb-1">
                      <Col md={6}>
                        {/* <Form.Group className="mb-1 mt-0">
                          <Form.Label className="m-0 py-0">
                            Broj radnog naloga
                          </Form.Label>
                          <Form.Control
                            type="text"
                            value={automatskiPodaci.brojRadnogNaloga}
                            readOnly
                            className="m-0 py-1"
                            placeholder="19"
                          />
                        </Form.Group> */}
                      </Col>
                      <Col md={12}>
                        <Form.Group className="mb-1">
                          <Form.Label className="m-0 py-0">
                            Barkod zahtjeva
                          </Form.Label>
                          <Form.Control
                            type="text"
                            /* value={automatskiPodaci.barkod} */
                            readOnly
                            className="m-0 py-1"
                            placeholder="1100026789015"
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row className="mb-1">
                      <Col md={6}>
                        <Form.Group className="mb-1">
                          <Form.Label className="m-0 py-0">
                            Datum propisivanja lijeka
                          </Form.Label>
                          <Form.Control
                            type="text"
                            /* value={automatskiPodaci.datumPropisivanja} */
                            readOnly
                            className="m-0 py-1"
                            placeholder="29.06.2025"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-1">
                          <Form.Label className="m-0 py-0">
                            Potpis i Faksimil ljekara
                          </Form.Label>
                          <Form.Control
                            type="text"
                            /* value={automatskiPodaci.faksimil} */
                            readOnly
                            className="m-0 py-1"
                            placeholder="Ivana Ivkovic"
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row className="mb-1">
                      <Col md={6}>
                        <Form.Group className="mb-1">
                          <Form.Label className="m-0 py-0">
                            Email ljekara
                          </Form.Label>
                          <Form.Control
                            type="text"
                            /* value={automatskiPodaci.emailLjekara} */
                            readOnly
                            className="m-0 py-1"
                            placeholder="email@gmail.com"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-1">
                          <Form.Label className="m-0 py-0">
                            Telefon ljekara
                          </Form.Label>
                          <Form.Control
                            type="text"
                            /* value={automatskiPodaci.telefonLjekara} */
                            readOnly
                            className="m-0 py-1"
                            placeholder="+382 68 532 888"
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    {/* <Form.Group className="mb-0">
                      <Form.Label>Status lijeka</Form.Label>
                      <Form.Control
                        type="text"
                        value={automatskiPodaci.statusLijeka}
                        readOnly
                      />
                    </Form.Group> */}
                  </Card.Body>
                </Card>

                <div className="d-flex gap-2 mt-4">
                  <Button
                    variant="secondary"
                    onClick={() => setFormDisabled(false)}
                  >
                    Izmijeni
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => {
                      const existing =
                        JSON.parse(localStorage.getItem("requests")) || [];
                      const updated = existing.filter(
                        (r) => r.lijek !== recepti[0].tekstRecepta
                      );
                      localStorage.setItem("requests", JSON.stringify(updated));
                      setIsSaved(false);
                      setFormDisabled(false);
                    }}
                  >
                    Izbriši
                  </Button>
                  <Button variant="outline-dark" onClick={() => window.print()}>
                    Štampaj
                  </Button>
                </div>
              </>
            )}
          </Form>
        </div>
      </div>
    </>
  );
}

export default RequestForm;