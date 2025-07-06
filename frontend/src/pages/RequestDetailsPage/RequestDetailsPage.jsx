import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card, Row, Col, Button, Modal } from "react-bootstrap";
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
          <Card.Title as="h1" className="details-title">
            Detalji zahtjeva #{id_zah}
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
            </Col>

            <Col>
              <Card className="details-section-card mb-2">
                <Card.Body>
                  <Card.Title as="h2" className="details-section-title mb-2">
                    Detalji zahteva
                  </Card.Title>
                  <ul className="details-list">
                    <li className="details-list-item">
                      <strong>Barcode:</strong> {barcode}
                    </li>
                    <li className="details-list-item">
                      <strong>Datum prijema:</strong>{" "}
                      {dat_prijema || "Nije uneto"}
                    </li>
                    <li className="details-list-item">
                      <strong>Datum isporuke:</strong>{" "}
                      {dat_isporuke || "Nije uneto"}
                    </li>
                    <li className="details-list-item">
                      <strong>Isporuka mg:</strong> {isporuka_mg}
                    </li>
                    <li className="details-list-item">
                      <strong>Izdao recept (ljekar):</strong> {izdao_recept_lj}{" "}
                      {izdao_recept_u}
                    </li>
                    <li className="details-list-item">
                      <strong>Napomena prijem:</strong>{" "}
                      {napomena_prijem || "Nema"}
                    </li>
                    <li className="details-list-item">
                      <strong>Napomena isporuka:</strong>{" "}
                      {napomena_isporuka || "Nema"}
                    </li>
                  </ul>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <h2 className="details-rp-title">Recepti (rp)</h2>
          {rp && rp.length > 0 ? (
            <Row xs={1} md={2} lg={3} className="g-3">
              {rp.map((item, idx) => (
                <Col key={idx}>
                  <Card className="details-rp-card h-100 d-flex flex-column">
                    <Card.Body className="d-flex flex-column">
                      <Card.Title className="details-rp-card-title">
                        {item.naziv || `Recept ID: ${item.id_det}`}
                      </Card.Title>
                      <Card.Text className="details-rp-card-text">
                        <strong>ID det:</strong> {item.id_det} <br />
                        <strong>ID art:</strong> {item.id_art || "-"} <br />
                        <strong>Tip RP:</strong> {item.tip_rp} <br />
                        <strong>Vrsta RP:</strong> {item.vrsta_rp} <br />
                        <strong>Količina:</strong> {item.kol} <br />
                        <strong>Broj mjeseci:</strong> {item.br_mjeseci || "-"}{" "}
                        <br />
                        <strong>Broj ponavljanja:</strong>{" "}
                        {item.br_ponavljanja || "-"} <br />
                      </Card.Text>
                      <Card.Text className="details-rp-obrazac">
                        {item.rp_obrazac}
                      </Card.Text>
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
              recept={printModal.data.recept}
              pacijent={printModal.data.pacijent}
              lekar={printModal.data.lekar}
              ustanova={printModal.data.ustanova}
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
