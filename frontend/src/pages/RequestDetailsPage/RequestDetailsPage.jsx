// ...existing code...
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card, Row, Col, Button, Modal } from "react-bootstrap";
import Barcode from "react-barcode";
import Header from "../../components/Header";
import MedicalPrescriptionContent from "../../components/MedicalPrescriptionContent";
import "./RequestDetailsPage.css";

function DetailsPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const initialData = location.state?.request;
  const [requestData, setRequestData] = useState(initialData || null);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState(null);
  const [printModal, setPrintModal] = useState({ show: false, data: null });

  useEffect(() => {
    if (!requestData) {
      fetch(`/api/request/${id}`)
        .then((res) => {
          if (!res.ok) throw new Error("Zahtjev nije pronađen.");
          return res.json();
        })
        .then((data) => {
          setRequestData(data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, [id, requestData]);

  if (loading) return <p>Učitavanje podataka...</p>;
  if (error) return <p>{error}</p>;
  if (!requestData) return <p>Zahtjev nije pronađen.</p>;

  const {
    barcode,
    br_tel,
    dat_isporuke,
    dat_prijema,
    id_zah,
    isporuka_mg,
    izdao_recept_lj,
    izdao_recept_u,
    napomena_isporuka,
    napomena_prijem,
    pacijent_dat_rodj,
    pacijent_ime,
    pacijent_prezime,
    rp,
    p_grad, // <-- dodato
  } = requestData;

  return (
    <div className="background">
      <Header />
      <div className="details-topbar">
        <Button
          variant="outline-secondary"
          onClick={() => navigate("/requests")}
        >
          Lista zahtjeva
        </Button>
      </div>
      <Card className="details-main-card">
        <Card.Body>
          <Card.Title
            as="h1"
            className="px-4 details-title flex-row justify-content-between"
          >
            Detalji zahtjeva
            <Card.Subtitle className="items-right">
              <div className="mb-1">
                ID zahtjeva #<strong>{id_zah}</strong>
              </div>
              <div>Datum zahtjeva: {dat_prijema || "Nije uneto"}</div>
            </Card.Subtitle>
          </Card.Title>

          <Row xs={1} md={2} lg={2} className="g-3">
            <Col>
              <Card className="details-section-card mb-2">
                <Card.Body>
                  <Card.Title as="h2" className="details-section-title mb-2">
                    Podaci o pacijentu
                  </Card.Title>
                  <ul className="details-list">
                    <li className="details-list-item">
                      <strong>Ime i prezime:</strong> {pacijent_ime}{" "}
                      {pacijent_prezime}
                    </li>
                    <li className="details-list-item">
                      <strong>Datum rođenja:</strong> {pacijent_dat_rodj}
                    </li>
                    <li className="details-list-item">
                      <strong>Broj telefona:</strong>{" "}
                      {br_tel || "Nije dostupan"}
                    </li>
                  </ul>
                </Card.Body>
              </Card>
              <Card className="details-section-card mb-2 mt-2 pt-1 align-items-center">
                {barcode ? (
                  <Barcode
                    value={barcode}
                    width={2}
                    height={45}
                    fontSize={16}
                    background="transparent"
                  />
                ) : (
                  "—"
                )}
              </Card>
            </Col>

            <Col>
              <Card className="details-section-card mb-2">
                <Card.Body>
                  <Card.Title as="h2" className="details-section-title mb-2">
                    Detalji zahteva
                  </Card.Title>
                  <ul className="details-list">
                    <li className="details-list-item">
                      <strong>Izdavanje recepta (ljekar):</strong>{" "}
                      {izdao_recept_lj}
                    </li>
                    <li className="details-list-item">
                      <strong>Izdavanje recepta (ustanova):</strong>{" "}
                      {izdao_recept_u}
                    </li>
                    <li className="details-list-item">
                      <strong>Isporuka - željeni grad:</strong> {p_grad || "/"}
                    </li>
                    <li className="details-list-item">
                      <strong>Isporuka - apoteka:</strong> {isporuka_mg}
                    </li>
                    <li className="details-list-item">
                      <strong>Isporuka - datum:</strong>{" "}
                      {dat_isporuke || "Nije uneto"}
                    </li>
                    {/* <li className="details-list-item">
                      <strong>Isporuka - farmaceut:</strong> -
                    </li> */}
                  </ul>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <h2 className="details-rp-title">Propisani recepti (rp)</h2>
          {rp && rp.length > 0 ? (
            <Row xs={1} md={2} lg={3} className="g-3">
              {rp.map((item, idx) => (
                <Col key={idx}>
                  <Card className="details-rp-card h-100 d-flex flex-column">
                    <Card.Body className="d-flex flex-column">
                      <Card.Title className="details-rp-card-title">
                        {item.naziv === "null" || item.naziv == null || item.naziv == "NORMATIV" ||item.naziv === "" ? "Blanko recept" : item.naziv}
                      </Card.Title>
                      <Card.Text className="details-rp-card-text">
                        <strong>ID art:</strong> {item.id_art || "-"} <br />
                        <strong>Tip RP:</strong>{" "}
                        {item.tip_rp === "OB"
                          ? "Obrazac lijeka"
                          : "Blanko obrazac"}{" "}
                        <br />
                        <strong>Vrsta RP:</strong>{" "}
                        {item.vrsta_rp === "NO" ? "Neobnovljiv" : "Obnovljiv"}{" "}
                        <br />
                        <strong>Količina:</strong> {item.kol} <br />
                        <strong>Broj mjeseci:</strong> {item.br_mjeseci || "-"}{" "}
                        <br />
                        <strong>Broj ponavljanja:</strong>{" "}
                        {item.br_ponavljanja || "-"} <br />
                        <br></br>
                        Normativi:
                      </Card.Text>
                      <Card.Text className="details-rp-obrazac">
                        {item.rp_obrazac === "null" || item.rp_obrazac == null || item.rp_obrazac === ""
                          ? item.rp_blanko || "Blanko recept"
                          : item.rp_obrazac}
                      </Card.Text>
                      {item.r_napomena && item.r_napomena !== "null" && (
                        <>
                          <div>Napomena:</div>
                          <Card.Text className="details-rp-obrazac">
                            {item.r_napomena}
                          </Card.Text>{" "}
                        </>
                      )}
                      <div className="details-stampa-btn-wrap mt-auto">
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() =>
                            setPrintModal({
                              show: true,
                              data: {
                                recept: item,
                                pacijent: {
                                  pacijent_ime,
                                  pacijent_prezime,
                                  br_tel,
                                  pacijent_dat_rodj,
                                },
                                lekar: izdao_recept_lj,
                                ustanova: izdao_recept_u,
                              },
                            })
                          }
                        >
                          Štampa&nbsp;🖶
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <p className="details-no-rp">Nema recepta za ovaj zahtjev.</p>
          )}
        </Card.Body>
        <Card className="px-2 pt-1 my-2">
          <div className="details-list-item">
            Napomena prijem:{" "}
            {napomena_prijem === "null" ? "" : napomena_prijem || "Nema"}
          </div>
        </Card>
        <Card className="px-2 pt-1">
          <div className="details-list-item">
            Napomena isporuka:{" "}
            {napomena_isporuka === "null" ? "" : napomena_isporuka || "Nema"}
          </div>
        </Card>
      </Card>
      <Modal
        show={printModal.show}
        onHide={() => setPrintModal({ show: false, data: null })}
        size="lg"
        centered
        dialogClassName="print-modal"
      >
        <Modal.Body>
          {printModal.data && (
            <MedicalPrescriptionContent
              request={requestData}
              recept={printModal.data.recept}
            />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setPrintModal({ show: false, data: null })}
          >
            Zatvori
          </Button>
          <Button variant="primary" onClick={() => window.print()}>
            Štampaj
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default DetailsPage;
