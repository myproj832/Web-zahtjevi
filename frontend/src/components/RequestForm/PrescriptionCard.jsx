import { Card, Form, Button, Row, Col } from "react-bootstrap";
import { useContext, useCallback } from "react";
import Select from "react-select";
import { ValidationContext } from "../../context/ValidationContext";

function PrescriptionCard({
  recept,
  index,
  recepti,
  setRecepti,
  indikacije,
  indikLijek,
  lijekNormativ,
}) {
  const allowedSigns = useContext(ValidationContext);

  // Optimizovana funkcija za ažuriranje recepta
  const updateRecept = useCallback(
    (changes) => {
      setRecepti((prev) => {
        const novi = [...prev];
        novi[index] = { ...novi[index], ...changes };
        return novi;
      });
    },
    [index, setRecepti]
  );

  const handleBeforeInput = (e) => {
    const char = e.data;
    if (!char || !allowedSigns) return;
    if (char === "\n") return;
    if (!allowedSigns.includes(char)) {
      e.preventDefault();
    }
  };

  const handleTipReceptaChange = (tip) => {
    updateRecept({
      tipRecepta: tip,
      tekstRecepta: "",
      grupa: "",
      obrazac: "",
      odabraniObrazac: null,
      odabrani: null,
      kolicina: "",
      brojPonavljanja: "",
      vremenskiPeriod: "",
      napomena: "",
      vrstaRecepta: "neobn",
      manualChange: false,
      tekstObrasca: "",
    });
  };

  const handleObrazacChange = (e, filtriraniLijekovi) => {
    const value = e.target ? e.target.value : e.value;
    const odabrani = lijekNormativ.find(
      (o) =>
        o.id_normativ ===
        filtriraniLijekovi.find((f) => f.lijek_name === value)?.id_normativ
    );
    const changes = {
      obrazac: value,
      odabraniObrazac: odabrani || null,
      odabrani: odabrani || null,
      kolicina: "",
      brojPonavljanja: "",
      vremenskiPeriod: "",
      napomena: "",
      vrstaRecepta: "neobn",
      manualChange: false,
    };
    if (odabrani) {
      const normativi = odabrani.lijek_normativ.map((n) => n.normativ_name).join("\n");
      const tekst = `${normativi}\n${odabrani.lijek_m_f}\n${odabrani.lijek_d_s}`;
      if (!recept.manualChange) {
        changes.tekstObrasca = tekst;
        changes.tekstRecepta = tekst;
      }
    } else {
      changes.tekstObrasca = "";
      changes.tekstRecepta = "";
    }
    updateRecept(changes);
  };

  const handleGrupaChange = (e) => {
    const value = e.target ? e.target.value : e.value;
    updateRecept({ grupa: value, obrazac: "", odabraniObrazac: null });
  };

  const handleFieldChange = (field, value) => {
    updateRecept({ [field]: value });
  };

  const getFiltriraniLijekovi = () => {
    if (!recept.grupa) return lijekNormativ;
    return lijekNormativ.filter((ln) =>
      indikLijek
        .filter((il) => il.indikacije_name === recept.grupa)
        .some((il) => Number(il.id_normativ) === Number(ln.id_normativ))
    );
  };

  // Opcije za react-select
  const grupaOptions = indikacije?.map((ind) => ({
    value: ind.indikacije_name,
    label: ind.indikacije_name,
  })) || [];
  const magistralniOptions = getFiltriraniLijekovi().map((nor) => ({
    value: nor.lijek_name,
    label: nor.lijek_name,
  }));

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
        <h5 className="mb-1 d-flex justify-content-between w-25"></h5>
        {recepti.length > 1 && (
          <Button
            variant="outline-danger"
            size="sm"
            onClick={() => {
              setRecepti((prev) => {
                const novi = [...prev];
                novi.splice(index, 1);
                return novi;
              });
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
        onChange={() => handleTipReceptaChange("obrazac")}
      />
      <Form.Check
        type="radio"
        name={`tipRecepta-${index}`}
        label="Blanko forma"
        checked={recept.tipRecepta === "blanko"}
        onChange={() => handleTipReceptaChange("blanko")}
      />
      {/* Tekst recepta za blanko formu */}
      {recept.tipRecepta === "blanko" && (
        <Form.Group className="mt-2">
          <Form.Label style={{ textTransform: "none" }}>
            Recept (max 4000 karaktera)
          </Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            maxLength={4000}
            value={recept.tekstRecepta}
            onChange={(e) => handleFieldChange("tekstRecepta", e.target.value)}
            onBeforeInput={handleBeforeInput}
          />
        </Form.Group>
      )}
      {/* Obrazac sa grupom i normativima */}
      {recept.tipRecepta === "obrazac" && (
        <>
          <Form.Group className="mt-2">
            <Form.Label style={{ textTransform: "none" }}>
              Grupa-indikacija
            </Form.Label>
        <Select
          className="text-capitalize"
          options={grupaOptions}
          value={
            grupaOptions.find(opt => {
              // Support both code and name for preselection
              return opt.value === recept.grupa || opt.value === recept.r_indikacija || opt.value === recept.indikacija;
            }) || null
          }
          onChange={(selected) => handleGrupaChange(selected || { target: { value: "" } })}
          placeholder="-- Izaberite grupu --"
          isClearable
        />
          </Form.Group>
          <Card className="mt-3 mb-0 pt-0 pb-2">
            <Card.Body className="py-0">
              <Form.Group className="mt-2">
                <Form.Label style={{ textTransform: "none" }}>
                  Magistralni lijek
                </Form.Label>
                <Select
                  options={magistralniOptions}
                  value={magistralniOptions.find(opt => opt.value === recept.obrazac || opt.value === recept.odabrani) || null}
                  onChange={(selected) => handleObrazacChange(selected || { target: { value: "" } }, getFiltriraniLijekovi())}
                  placeholder="-- Izaberite obrazac --"
                  isClearable
                  isDisabled={!recept.grupa}
                />
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
                        updateRecept({
                          tekstObrasca: e.target.value,
                          tekstRecepta: e.target.value,
                          manualChange: true,
                        });
                      }}
                      onBeforeInput={handleBeforeInput}
                    />
                  </Form.Group>
                  <Form.Group className="mt-3">
                    <Form.Control
                      as="textarea"
                      rows={6}
                      value={
                        `${recept.odabraniObrazac.lijek_normativ.map((n) => n.normativ_name).join("\n")}
${recept.odabraniObrazac.lijek_m_f}\n${recept.odabraniObrazac.lijek_d_s}`
                      }
                      readOnly
                      style={{ display: "none" }}
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
            onChange={() => updateRecept({ vrstaRecepta: "neobn", brojPonavljanja: "", vremenskiPeriod: "" })}
            className="mb-2"
          />
          <Form.Check
            type="radio"
            name={`vrstaRecepta-${index}`}
            label="Obnovljiv"
            checked={recept.vrstaRecepta === "obn"}
            onChange={() => updateRecept({ vrstaRecepta: "obn" })}
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
                      <Form.Label
                        className="py-0 my-0 mx-0"
                        style={{ textTransform: "none" }}
                      >
                        Količina
                      </Form.Label>
                      <Form.Control
                        type="text"
                        value={recept.kolicina}
                        onChange={(e) => handleFieldChange("kolicina", e.target.value)}
                        className="py-0"
                        style={{ width: "50px" }}
                        onBeforeInput={handleBeforeInput}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row style={{ color: "transparent" }}>nesto</Row>
              </>
            )}
            {recept.vrstaRecepta === "obn" && (
              <>
                <Row style={{ color: "transparent" }}>nesto</Row>
                <Row className="pt-1 gap-0 align-items-center" style={{ marginBottom: '-10px' }}>
                  <Col md={3} className="px-1">
                    <Form.Group className="d-flex align-items-center gap-0 mb-0">
                      <Form.Label
                        style={{ width: "60px", textTransform: "none", marginBottom: 0 }}
                        className="py-0 my-0"
                      >
                        Količina
                      </Form.Label>
                      <Form.Control
                        type="text"
                        value={recept.kolicina}
                        onChange={(e) => handleFieldChange("kolicina", e.target.value)}
                        className="py-0"
                        style={{ width: "50px", minWidth: "50px" }}
                        onBeforeInput={handleBeforeInput}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4} className="px-1">
                    <Form.Group className="d-flex align-items-center gap-0 mb-0">
                      <Form.Label
                        style={{ width: "110px", textTransform: "none", marginBottom: 0 }}
                        className="py-0 my-0"
                      >
                        Broj ponavljanja
                      </Form.Label>
                      <Form.Control
                        type="text"
                        value={recept.brojPonavljanja}
                        onChange={(e) => handleFieldChange("brojPonavljanja", e.target.value)}
                        className="py-0"
                        style={{ width: "50px", minWidth: "50px" }}
                        onBeforeInput={handleBeforeInput}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={5} className="px-1">
                    <Form.Group className="d-flex align-items-center gap-0 mb-0">
                      <Form.Label
                        style={{ width: "120px", textTransform: "none", marginBottom: 0 }}
                        className="py-0 my-0"
                      >
                        Period liječenja(mjeseci)
                      </Form.Label>
                      <Form.Control
                        type="text"
                        value={recept.vremenskiPeriod}
                        onChange={(e) => handleFieldChange("vremenskiPeriod", e.target.value)}
                        className="py-0"
                        style={{ width: "50px", minWidth: "50px" }}
                        onBeforeInput={handleBeforeInput}
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
        <Form.Label style={{ textTransform: "none" }}>
          Napomena (max 4000 karaktera)
        </Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          maxLength={4000}
          value={recept.napomena}
          onChange={(e) => handleFieldChange("napomena", e.target.value)}
          onBeforeInput={handleBeforeInput}
        />
      </Form.Group>
    </Card>
  );
}

export default PrescriptionCard;
