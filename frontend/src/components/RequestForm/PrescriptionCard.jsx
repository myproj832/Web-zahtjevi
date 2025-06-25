import { Card, Form, Button, Row, Col } from "react-bootstrap";

function PrescriptionCard({ recept, index, recepti, setRecepti, grupe, obrasci, filtriraniObrasci }) {
  return (
    <Card
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

      {/* Tekst recepta za blanko formu */}
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

      {/* Obrazac sa grupom i normativima */}
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

      {/* Količina */}
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

      {/* Broj ponavljanja i vremenski period (samo za obnovljive recepte) */}
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
  );
}

export default PrescriptionCard;
