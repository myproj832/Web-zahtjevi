import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RequestForm.css";
import { Card, Form, Button, Row, Col, InputGroup } from "react-bootstrap";

function RequestForm() {
  const [grupa, setGrupa] = useState("sve");

  const navigate = useNavigate();
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
      grupa: "sve",
    },
  ]);

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

  return (
    <div className="background text-dark">
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
          {/* Blok: Zdravstvena ustanova */}
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

          {/* Blok: Pacijent */}
          <Card
            className="p-4 my-4"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.51)",
              borderRadius: "1rem",
              boxShadow: "0 0 10px rgba(0,0,0,0.1)",
            }}
          >
            <h5>Podaci o pacijentu</h5>
            <Row className="mb-1">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="m-0">
                    Ime<span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="m-0">
                    Prezime<span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-1">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="m-0">
                    Broj telefona<span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control required placeholder="npr. 3269123456" />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="m-0">
                    Datum rođenja<span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control type="date" />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-1">
              <Form.Label className="m-0">
                Grad za preuzimanje lijeka
              </Form.Label>
              <Form.Select>
                <option></option>
                <option>Podgorica</option>
                <option>Tivat</option>
                <option>Bar</option>
              </Form.Select>
            </Form.Group>
          </Card>

          {/* Blok: Dijagnoza */}
          <h5 className="mt-4">Dijagnoza</h5>
          <Row className="mb-2">
            <Col md={12}>
              <Form.Group>
                <Form.Label className="m-0">Šifra i Naziv</Form.Label>
                <Form.Control />
              </Form.Group>
            </Col>
          </Row>

          {recepti.map((recept, index) => (
            <Card
              key={index}
              className="p-4 mb-2 mt-4"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.51)",
                borderRadius: "1rem",
                boxShadow: "0 0 10px rgba(0,0,0,0.1)",
              }}
            >
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h5 className="mb-1 d-flex justify-content-between w-25">
                  <span>*RP/</span>
                  <span>#{index + 1}</span>
                </h5>
                {recepti.length > 1 && (
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => {
                      const novi = [...recepti];
                      novi.splice(index, 1);
                      setRecepti(novi);
                    }}
                  >
                    Obriši
                  </Button>
                )}
              </div>

              {/* Tip recepta */}
              <h6>Tip recepta</h6>
              <Form.Check
                type="radio"
                name={`tipRecepta-${index}`}
                label="Obrazac lijeka"
                checked={recept.tipRecepta === "obrazac"}
                onChange={() => {
                  const novi = [...recepti];
                  novi[index].tipRecepta = "obrazac";
                  novi[index].tekstRecepta = "";
                  setRecepti(novi);
                }}
              />
              <Form.Check
                type="radio"
                name={`tipRecepta-${index}`}
                label="Blanko forma"
                checked={recept.tipRecepta === "blanko"}
                onChange={() => {
                  const novi = [...recepti];
                  novi[index].tipRecepta = "blanko";
                  novi[index].grupa = "";
                  novi[index].obrazac = "";
                  novi[index].odabraniObrazac = null;
                  setRecepti(novi);
                }}
              />

              {recept.tipRecepta === "blanko" && (
                <Form.Group className="mt-2">
                  <Form.Label>Recept (max 4000 karaktera)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    maxLength={4000}
                    value={recept.tekstRecepta}
                    onChange={(e) => {
                      const novi = [...recepti];
                      novi[index].tekstRecepta = e.target.value;
                      setRecepti(novi);
                    }}
                  />
                </Form.Group>
              )}

              {recept.tipRecepta === "obrazac" && (
                <>
                  <Form.Group className="mt-2">
                    <Form.Label>Grupa-indikacija</Form.Label>
                    <Form.Select
                      value={recept.grupa}
                      onChange={(e) => {
                        const novi = [...recepti];
                        novi[index].grupa = e.target.value;
                        novi[index].obrazac = "";
                        novi[index].odabraniObrazac = null;
                        setRecepti(novi);
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
                    <Form.Label>Magistralni lijek</Form.Label>
                    <Form.Select
                      value={recept.obrazac}
                      onChange={(e) => {
                        const novi = [...recepti];
                        const odabrani = filtriraniObrasci.find(
                          (o) => o.id === e.target.value
                        );
                        novi[index].obrazac = e.target.value;
                        novi[index].odabraniObrazac = odabrani || null;
                        setRecepti(novi);
                      }}
                    >
                      <option value="">-- Izaberite obrazac --</option>
                      {filtriraniObrasci.map((o) => (
                        <option key={o.id} value={o.id}>
                          {o.naziv}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>

                  {recept.odabraniObrazac && (
                    <div className="mt-2">
                      <strong>Normativi:</strong>
                      <ul>
                        {recept.odabraniObrazac.sastavnica.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}

              {/* Vrsta recepta */}
              <h6 className="mt-4">Vrsta recepta</h6>
              <Form.Check
                type="radio"
                name={`vrstaRecepta-${index}`}
                label="Neobnovljiv"
                checked={recept.vrstaRecepta === "neobn"}
                onChange={() => {
                  const novi = [...recepti];
                  novi[index].vrstaRecepta = "neobn";
                  setRecepti(novi);
                }}
              />
              <Form.Check
                type="radio"
                name={`vrstaRecepta-${index}`}
                label="Obnovljiv"
                checked={recept.vrstaRecepta === "obn"}
                onChange={() => {
                  const novi = [...recepti];
                  novi[index].vrstaRecepta = "obn";
                  setRecepti(novi);
                }}
              />

              <Form.Group className="mt-3">
                <Form.Label>Količina</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Unesite količinu"
                  value={recept.kolicina}
                  onChange={(e) => {
                    const novi = [...recepti];
                    novi[index].kolicina = e.target.value;
                    setRecepti(novi);
                  }}
                />
              </Form.Group>

              {recept.vrstaRecepta === "obn" && (
                <Row className="mt-2">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Broj ponavljanja</Form.Label>
                      <Form.Control
                        type="number"
                        value={recept.brojPonavljanja}
                        onChange={(e) => {
                          const novi = [...recepti];
                          novi[index].brojPonavljanja = e.target.value;
                          setRecepti(novi);
                        }}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Vremenski period (u mjesecima)</Form.Label>
                      <Form.Control
                        type="number"
                        value={recept.vremenskiPeriod}
                        onChange={(e) => {
                          const novi = [...recepti];
                          novi[index].vremenskiPeriod = e.target.value;
                          setRecepti(novi);
                        }}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              )}

              {/* Napomena */}
              <Form.Group className="mt-4">
                <Form.Label>Napomena (max 4000 karaktera)</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  maxLength={4000}
                  value={recept.napomena}
                  onChange={(e) => {
                    const novi = [...recepti];
                    novi[index].napomena = e.target.value;
                    setRecepti(novi);
                  }}
                />
              </Form.Group>
            </Card>
          ))}
          <Button
            className="mt-0 mb-3 btn btn-light btn-outline-success"
            onClick={() =>
              setRecepti([
                ...recepti,
                {
                  tipRecepta: "obrazac",
                  tekstRecepta: "",
                  grupa: "",
                  obrazac: "",
                  odabraniObrazac: null,
                  vrstaRecepta: "neobn",
                  kolicina: "",
                  brojPonavljanja: "",
                  vremenskiPeriod: "",
                  napomena: "",
                },
              ])
            }
          >
            + Dodaj lijek
          </Button>

          {/* Upload izvještaja */}
          <Form.Group className="mt-4">
            <Form.Label className="m-1">Priloži izvještaj</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              capture="environment" // ili "user" za prednju kameru
              multiple
            />
          </Form.Group>

          <Button className="mt-4" variant="primary">
            Snimi zahtjev
          </Button>
          {/*AUTOMATSKI BLOG NAKON KREIRANJA*/}
        </Form>
      </div>
    </div>
  );
}

export default RequestForm;
