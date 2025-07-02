import { Card, Form, Button, Row, Col } from "react-bootstrap";

function PrescriptionCard({
  recept,
  index,
  recepti,
  setRecepti,
  indikacije,
  indikLijek,
  lijekNormativ,
}) {
  return (
    <Card
      className="pt-2 pb-3 px-4 mb-2 mt-3"
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.61)",
        borderRadius: "1rem",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
      }}
    >
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h5 className="mb-1 d-flex justify-content-between w-25">
          {/* <span className="fs-3 mb-3">*RP/</span> */}
          {/* <span>#{index + 1}</span> */}
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
      <h6 className="mb-3 fs-5">Tip recepta</h6>
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
              className="text-capitalize"
              value={recept.grupa}
              onChange={(e) => {
                const novi = [...recepti];
                novi[index].grupa = e.target.value;
                novi[index].obrazac = "";
                novi[index].odabraniObrazac = null;
                setRecepti(novi);
              }}
            >
              <option value="">-- Izaberite grupu --</option>
              {indikacije?.map((ind) => (
                <option
                  key={ind.indikacije_id}
                  value={ind.indikacije_name}
                  className="text-capitalize"
                >
                  {ind.indikacije_name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Card className="mt-3 mb-0 pt-0 pb-2">
            <Card.Body className="py-0">
              <Form.Group className="mt-2">
                <Form.Label>Magistralni lijek</Form.Label>

                {/* Filtrirani lijekovi na osnovu izabrane grupe */}
                {(() => {
                  const filtriraniLijekovi = !recept.grupa
                    ? lijekNormativ
                    : lijekNormativ.filter((ln) =>
                        indikLijek
                          .filter((il) => il.indikacije_name === recept.grupa)
                          .some(
                            (il) => Number(il.lijek_id) === Number(ln.lijek_id)
                          )
                      );

                  return (
                    <Form.Select
                      className="text-capitalize"
                      value={recept.obrazac}
                      onChange={(e) => {
                        const novi = [...recepti];
                        const odabrani = lijekNormativ.find(
                          (o) =>
                            o.lijek_id ===
                            filtriraniLijekovi.find(
                              (f) => f.lijek_name === e.target.value
                            )?.lijek_id
                        );

                        novi[index].obrazac = e.target.value;
                        novi[index].odabraniObrazac = odabrani || null;

                        if (odabrani) {
                          const normativi = odabrani.lijek_normativ
                            .map((n) => n.normativ_name)
                            .join("\n");
                          const tekst = `${normativi}\n${odabrani.lijek_m_f}\n${odabrani.lijek_d_s}`;
                          novi[index].tekstObrasca = tekst;
                        } else {
                          novi[index].tekstObrasca = "";
                        }

                        setRecepti(novi);
                      }}
                    >
                      <option value="">-- Izaberite obrazac --</option>
                      {filtriraniLijekovi.map((nor) => (
                        <option
                          key={nor.lijek_id}
                          value={nor.lijek_name}
                          className="text-capitalize"
                        >
                          {nor.lijek_name}
                        </option>
                      ))}
                    </Form.Select>
                  );
                })()}
              </Form.Group>

              {recept.odabraniObrazac && (
                <>
                  <Card.Subtitle
                    className="my-2 mx-1 text-muted strong"
                    style={{ color: "#000000", fontSize: 26 }}
                  >
                    *RP/
                  </Card.Subtitle>
                  <Form.Group className="mt-3">
                    <Form.Control
                      as="textarea"
                      rows={6}
                      value={recept.tekstObrasca || ""}
                      onChange={(e) => {
                        const novi = [...recepti];
                        novi[index].tekstObrasca = e.target.value;
                        setRecepti(novi);
                      }}
                    />
                  </Form.Group>
                </>
              )}
            </Card.Body>
          </Card>
        </>
      )}

      <Row className="align-items-start mt-4">
        {/* Leva kolona: radio dugmad */}
        <Col md={2}>
          <Form.Check
            type="radio"
            name={`vrstaRecepta-${index}`}
            label="Neobnovljiv"
            checked={recept.vrstaRecepta === "neobn"}
            onChange={() => {
              const novi = [...recepti];
              novi[index].vrstaRecepta = "neobn";
              novi[index].brojPonavljanja = "";
              novi[index].vremenskiPeriod = "";
              setRecepti(novi);
            }}
            className="mb-2"
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
        </Col>

        {/* Desna kolona: polja u zavisnosti od izbora */}
        <Col md={10}>
          <Row className="align-items-center">
            {recept.vrstaRecepta === "neobn" && (
              <>
                <Row>
                  <Col md={3}>
                    <Form.Group className="d-flex align-items-center gap-2">
                      <Form.Label className="py-0 my-0 mx-0">Količina</Form.Label>
                      <Form.Control
                        type="text"
                        value={recept.kolicina}
                        onChange={(e) => {
                          const novi = [...recepti];
                          novi[index].kolicina = e.target.value;
                          setRecepti(novi);
                        }}
                        className="py-0"
                        style={{ width: "50px" }} // ili koliko ti odgovara
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row style={{"color": "transparent"}}>nesto</Row>
              </>
            )}

            {recept.vrstaRecepta === "obn" && (
              <>
                <Row style={{"color": "transparent"}}>nesto</Row>
                <Row>
                  <Col md={3}>
                    <Form.Group className="d-flex align-items-center gap-2">
                      <Form.Label style={{ width: "60px" }} className="py-0 my-0">Količina</Form.Label>
                      <Form.Control
                        type="text"
                        value={recept.kolicina}
                        onChange={(e) => {
                          const novi = [...recepti];
                          novi[index].kolicina = e.target.value;
                          setRecepti(novi);
                        }}
                        className="py-0"
                        style={{ width: "50px" }}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={5}>
                    <Form.Group className="d-flex align-items-center gap-2">
                      <Form.Label style={{ width: "120px" }} className="py-0 my-0">
                        Broj ponavljanja
                      </Form.Label>
                      <Form.Control
                        type="number"
                        value={recept.brojPonavljanja}
                        onChange={(e) => {
                          const novi = [...recepti];
                          novi[index].brojPonavljanja = e.target.value;
                          setRecepti(novi);
                        }}
                        className="py-0"
                        style={{ width: "50px" }}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="d-flex align-items-center gap-2">
                      <Form.Label style={{ width: "140px" }} className="py-0 my-0">
                        Period liječenja
                      </Form.Label>
                      <Form.Control
                        type="number"
                        value={recept.vremenskiPeriod}
                        onChange={(e) => {
                          const novi = [...recepti];
                          novi[index].vremenskiPeriod = e.target.value;
                          setRecepti(novi);
                        }}
                        className="py-0"
                        style={{ width: "50px" }}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </>
            )}
          </Row>
        </Col>
      </Row>

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
