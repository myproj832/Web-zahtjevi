import React, { useState } from "react";
import "./RequestForm.css";
import { Form, Button, Row, Col, InputGroup } from "react-bootstrap";

function RequestForm() {
  const [tipRecepta, setTipRecepta] = useState("obrazac");
  const [grupa, setGrupa] = useState("sve");
  const [obrazac, setObrazac] = useState("");
  const [tekstRecepta, setTekstRecepta] = useState("");
  const [napomena, setNapomena] = useState("");

  const grupe = [
    { id: "sve", naziv: "Sve grupe" },
    { id: "grupa1", naziv: "Grupa 1" },
    { id: "grupa2", naziv: "Grupa 2" },
  ];

  const obrasci = [
    {
      id: "obrazac1",
      naziv: "Obrazac A",
      grupa: "grupa1",
      sastavnica: ["Lijek 1", "Lijek 2"],
    },
    {
      id: "obrazac2",
      naziv: "Obrazac B",
      grupa: "grupa2",
      sastavnica: ["Lijek 3"],
    },
  ];

  const filtriraniObrasci =
    grupa === "sve" ? obrasci : obrasci.filter((o) => o.grupa === grupa);
  const odabraniObrazac = obrasci.find((o) => o.id === obrazac);

  return (
    <div className="background text-dark">
      <div className="p-4 mx-auto" style={{ maxWidth: "800px" }}>
        <h1>Request Form</h1>
        <Form>
          {/* Blok: Zdravstvena ustanova */}
          <h5 className="mt-4">Zdravstvena ustanova</h5>
          <Form.Group as={Row} className="mb-2">
            <Form.Label column sm={2}>
              Ustanova:
            </Form.Label>
            <Col sm={10}>
              <Form.Control readOnly defaultValue="Dom zdravlja Centar" />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-2">
            <Form.Label column sm={2}>
              Adresa:
            </Form.Label>
            <Col sm={10}>
              <Form.Control readOnly defaultValue="Ulica 123" />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-2">
            <Form.Label column sm={2}>
              Telefon:
            </Form.Label>
            <Col sm={10}>
              <Form.Control readOnly defaultValue="+387 33 123 456" />
            </Col>
          </Form.Group>

          {/* Blok: Pacijent */}
          <h5 className="mt-4">Podaci o pacijentu</h5>
          <Row className="mb-2">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Broj telefona</Form.Label>
                <Form.Control placeholder="npr. +38761234567" />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Datum rođenja</Form.Label>
                <Form.Control type="date" />
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-2">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Ime</Form.Label>
                <Form.Control />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Prezime</Form.Label>
                <Form.Control />
              </Form.Group>
            </Col>
          </Row>
          <Form.Group className="mb-2">
            <Form.Label>Grad za preuzimanje lijeka</Form.Label>
            <Form.Select>
              <option>Sarajevo</option>
              <option>Banja Luka</option>
              <option>Tuzla</option>
            </Form.Select>
          </Form.Group>

          {/* Blok: Dijagnoza */}
          <h5 className="mt-4">Dijagnoza</h5>
          <Row className="mb-2">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Šifra</Form.Label>
                <Form.Control />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Naziv</Form.Label>
                <Form.Control />
              </Form.Group>
            </Col>
          </Row>

          {/* Blok: Tip recepta */}
          <h5 className="mt-4">Tip recepta</h5>
          <Form.Check
            type="radio"
            name="tipRecepta"
            label="Obrazac lijeka"
            checked={tipRecepta === "obrazac"}
            onChange={() => setTipRecepta("obrazac")}
          />
          <Form.Check
            type="radio"
            name="tipRecepta"
            label="Blanko forma"
            checked={tipRecepta === "blanko"}
            onChange={() => setTipRecepta("blanko")}
          />

          {tipRecepta === "blanko" && (
            <Form.Group className="mt-2">
              <Form.Label>Recept (max 4000 karaktera)</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                maxLength={4000}
                value={tekstRecepta}
                onChange={(e) => setTekstRecepta(e.target.value)}
              />
            </Form.Group>
          )}

          {tipRecepta === "obrazac" && (
            <>
              <Form.Group className="mt-2">
                <Form.Label>Grupa</Form.Label>
                <Form.Select
                  value={grupa}
                  onChange={(e) => {
                    setGrupa(e.target.value);
                    setObrazac("");
                  }}
                >
                  {grupe.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.naziv}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group className="mt-2">
                <Form.Label>Obrazac</Form.Label>
                <Form.Select
                  value={obrazac}
                  onChange={(e) => setObrazac(e.target.value)}
                >
                  <option value="">-- Izaberite obrazac --</option>
                  {filtriraniObrasci.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.naziv}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              {odabraniObrazac && (
                <div className="mt-2">
                  <strong>Sastavnica:</strong>
                  <ul>
                    {odabraniObrazac.sastavnica.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}

          {/* Napomena */}
          <Form.Group className="mt-4">
            <Form.Label>Napomena (max 4000 karaktera)</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              maxLength={4000}
              value={napomena}
              onChange={(e) => setNapomena(e.target.value)}
            />
          </Form.Group>

          {/* Upload izvještaja */}
          <Form.Group className="mt-4">
            <Form.Label>Priloži izvještaj</Form.Label>
            <Form.Control type="file" />
          </Form.Group>

          <Button className="mt-4" variant="primary">
            Snimi zahtjev
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default RequestForm;
